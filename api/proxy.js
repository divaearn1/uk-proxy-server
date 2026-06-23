export default async function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
    }

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).json({ error: "Proxy fetch failed" });
    }
}
  
