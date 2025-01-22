export default async function handler(req, res) {
    if (req.method === 'POST') {
        const response = await fetch('https://keylumania.vercel.app/api/getkey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
} 