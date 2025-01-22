const crypto = require('crypto');

// In-memory storage for keys (will reset on server restart)
const keys = new Map();

// Clean expired keys every hour
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of keys.entries()) {
        if (now - data.generatedAt > 24 * 60 * 60 * 1000) { // 24 hours
            keys.delete(key);
        }
    }
}, 60 * 60 * 1000); // Check every hour

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle key generation
    if (req.method === 'GET') {
        const { hash } = req.query;
        if (!hash) {
            return res.status(400).json({ error: 'Missing hash parameter' });
        }

        // Check if hash already has a valid key
        for (const [existingKey, data] of keys.entries()) {
            if (data.hash === hash) {
                const age = Date.now() - data.generatedAt;
                if (age < 24 * 60 * 60 * 1000) { // Less than 24 hours old
                    return res.status(200).json({ key: existingKey });
                }
                keys.delete(existingKey); // Delete expired key
                break;
            }
        }

        // Generate new key
        const key = crypto.randomBytes(16).toString('hex');
        keys.set(key, {
            hash: hash,
            generatedAt: Date.now()
        });

        return res.status(200).json({ key });
    }

    // Handle key verification
    if (req.method === 'POST') {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({ valid: false });
        }

        const keyData = keys.get(key);
        if (!keyData) {
            return res.status(200).json({ valid: false });
        }

        // Check if key is expired
        if (Date.now() - keyData.generatedAt > 24 * 60 * 60 * 1000) {
            keys.delete(key);
            return res.status(200).json({ valid: false });
        }

        return res.status(200).json({ valid: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

// Export keys Map to be used by verify endpoint
module.exports = { keys }; 