export default async function handler(req, res) {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
    }

    try {
        const response = await fetch(targetUrl);
        let data = await response.text();
        
        // Extract the base domain (e.g., https://vocal.media) to handle raw relative paths
        const urlObj = new URL(targetUrl);
        const originUrl = urlObj.origin; 

        // Magic Fix: Rewrite links, images, and scripts so they route back through your Vercel proxy
        data = data.replace(/(href|src)="\/(?!\/)/g, `$1="${originUrl}/`);

        // Force clickable links to attach your proxy automatically when clicked
        const proxyBase = `https://${req.headers.host}/api/proxy?url=`;
        data = data.replace(/href="(https:\/\/vocal\.media[^"]*)"/g, `href="${proxyBase}$1"`);

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).json({ error: "Proxy fetch failed" });
    }
}
