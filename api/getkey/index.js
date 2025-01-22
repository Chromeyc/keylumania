const crypto = require('crypto');

// Simple in-memory storage
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        if (req.method === 'GET') {
            // Generate key
            const key = Math.random().toString(36).substr(2, 9);
            const timestamp = Date.now();
            keys.set(key, timestamp);
            return res.status(200).json({ key });
        }

        if (req.method === 'POST') {
            const { key } = req.body;
            if (!key) return res.json({ valid: false });

            const timestamp = keys.get(key);
            if (!timestamp) return res.json({ valid: false });

            // Check if key is less than 24h old
            const isValid = Date.now() - timestamp < 24 * 60 * 60 * 1000;
            if (!isValid) {
                keys.delete(key);
            }
            return res.json({ valid: isValid });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Export keys Map to be used by verify endpoint
module.exports = { keys }; 