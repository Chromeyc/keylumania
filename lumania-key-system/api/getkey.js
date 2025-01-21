const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const KEYS_FILE = path.join(process.cwd(), 'data', 'keys.json');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { hash } = req.query;
    
    if (!hash) {
        return res.status(400).json({ error: 'Missing hash parameter' });
    }

    try {
        // Generate a random key
        const key = crypto.randomBytes(16).toString('hex');
        
        // Load existing keys
        let keys = {};
        try {
            const keysData = await fs.readFile(KEYS_FILE, 'utf8');
            keys = JSON.parse(keysData);
        } catch (error) {
            // File doesn't exist yet, that's fine
        }

        // Store the new key
        keys[key] = {
            generatedAt: new Date().toISOString(),
            hash: hash
        };

        // Save updated keys
        await fs.writeFile(KEYS_FILE, JSON.stringify(keys, null, 2));

        // Return the key to the user
        return res.status(200).json({ key });
    } catch (error) {
        console.error('Error generating key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}; 