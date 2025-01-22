// Share the keys Map between files
const { keys } = require('../getkey/index.js');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key } = req.body;
    if (!key) {
        return res.status(200).json({ valid: false });
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