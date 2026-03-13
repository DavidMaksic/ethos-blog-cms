export default async function handler(req, res) {
   if (req.method !== 'POST')
      return res.status(405).json({ error: 'Method not allowed' });

   const { slug, changes } = req.body || {};

   try {
      const response = await fetch(
         'https://ethos-blog.vercel.app/api/revalidate',
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${process.env.REVALIDATE_SECRET}`,
            },
            body: JSON.stringify({ changes, ...(slug && { slug }) }),
         },
      );

      const data = await response.json();

      if (!response.ok) {
         console.error('Revalidate failed:', response.status, data);
         return res
            .status(500)
            .json({ error: 'Next.js revalidate failed', detail: data });
      }

      res.status(200).json({ status: 'success' });
   } catch (err) {
      console.error('Handler error:', err);
      res.status(500).json({ error: err.message });
   }
}
