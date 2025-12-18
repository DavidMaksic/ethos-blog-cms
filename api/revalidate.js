export default async function handler(req, res) {
   if (req.method !== 'POST')
      return res.status(405).json({ error: 'Method not allowed' });

   const { slug } = req.body;

   const response = await fetch(
      'https://ethos-blog.vercel.app/api/revalidate',
      {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REVALIDATE_SECRET}`,
         },
         body: JSON.stringify({ slug }),
      }
   );

   if (!response.ok)
      return res.status(500).json({ error: 'Next.js revalidate failed' });

   res.status(200).json({ status: 'success' });
}
