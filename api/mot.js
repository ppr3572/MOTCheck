// api/mot.js
export default async function handler(req, res) {
  const { reg } = req.query;

  if (!reg) {
    return res.status(400).send('Missing registration number');
  }

  const url = `https://www.check-mot.service.gov.uk/results?registration=${encodeURIComponent(reg)}&checkRecalls=true`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`Proxy error: ${error.message}`);
  }
}
