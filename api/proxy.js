function routeThroughTunnel(targetUrl) {
    // 1. Define the domains and specific links that MUST use the UK proxy
    const ukRequiredDomains = [
        "vocal.media",
        "kit.com",
        "sparkloop.com"
    ];

    try {
        const parsedUrl = new URL(targetUrl);
        
        // 2. Check if the link matches any of your target networks
        const needsTunnel = ukRequiredDomains.some(domain => parsedUrl.hostname.includes(domain));

        if (needsTunnel) {
            // Wrap it inside your live Vercel proxy URL
            return `https://uk-proxy-server.vercel.app/api/proxy?url=${encodeURIComponent(targetUrl)}`;
        }
    } catch (e) {
        console.error("Invalid URL passed to router:", e);
    }

    // 3. For any other app pages or external links, return the normal URL
    return targetUrl;
}
