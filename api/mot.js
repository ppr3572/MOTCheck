// api/mot.js
export default async function handler(req, res) {
  const { reg } = req.query;

  if (!reg) {
    return res.status(400).send('Missing registration number.');
  }

  const url = `https://www.check-mot.service.gov.uk/results?registration=${encodeURIComponent(reg)}&checkRecalls=true`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    const html = await response.text();

    // Check for common error pages
    if (html.includes('Vehicle details not found') || html.includes('No vehicle found')) {
      return res.status(404).send('Vehicle not found. Please check the registration.');
    }

    if (html.includes('Access denied') || html.includes('Blocked') || html.includes('Security check')) {
      return res.status(403).send('The MOT site blocked this server request. Please use the fallback method on the page.');
    }

    // Return the raw HTML
    return res.status(200).send(html);
  } catch (error) {
    return res.status(500).send(`Proxy error: ${error.message}`);
  }
}
