const fs = require('fs').promises;
const path = require('path');

const KEYS_FILE = path.join(process.cwd(), 'data', 'keys.json');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key } = req.body;
    
    if (!key) {
        return res.status(400).json({ error: 'Missing key' });
    }

    try {
        // Load keys
        const keysData = await fs.readFile(KEYS_FILE, 'utf8');
        const keys = JSON.parse(keysData);

        // Check if key exists
        if (keys[key]) {
            return res.status(200).json({ valid: true });
        } else {
            return res.status(200).json({ valid: false });
        }
    } catch (error) {
        console.error('Error verifying key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}; 