export default async function handler(req, res) {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        let data = await response.text();
        
        const urlObj = new URL(targetUrl);
        const originUrl = urlObj.origin; 

        // Safely fix absolute asset paths without breaking regex engines
        data = data.split('href="/').join(`href="${originUrl}/`);
        data = data.split('src="/').join(`src="${originUrl}/`);

        // Handle form action submissions so they also route through the proxy destination safely
        data = data.split('action="/').join(`action="${originUrl}/`);

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).json({ error: "Proxy fetch failed", details: error.message });
    }
}
