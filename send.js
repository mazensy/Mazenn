export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { fullname, phone, location } = req.body;

  // استرجاع التوكن والـ chat ID من البيئة
  const BOT_TOKEN = process.env.BOT_TOKEN; // خزن التوكن في بيئة Vercel
  const CHAT_ID = process.env.CHAT_ID;     // خزن الـ chat ID في بيئة Vercel

  const text = `📌 طلب جديد:\n👤 الاسم: ${fullname}\n📞 الهاتف: ${phone}\n🏠 الإقامة: ${location}`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    const data = await response.json();

    if (data.ok) {
      res.status(200).json({ ok: true });
    } else {
      res.status(500).json({ ok: false, error: data.description });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
