export default async function handler(req, res) {
   const { url } = req.query;
   if (!url) return res.status(400).json({ error: 'Missing url' });

   try {
      const response = await fetch(decodeURIComponent(url));
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', contentType);
      res.send(new Uint8Array(arrayBuffer));
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch image' });
   }
}
