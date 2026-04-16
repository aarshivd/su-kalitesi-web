import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest): Promise<Response> {
  // Webhook gizli anahtarı doğrula
  const secret = process.env.SUPABASE_WEBHOOK_SECRET
  if (secret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${secret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    // Telegram henüz yapılandırılmamış — loglayıp 200 döndür
    console.warn('[alert/route] Telegram env vars eksik, mesaj atlanıyor:', body)
    return Response.json({ ok: true, skipped: true })
  }

  // Telegram mesajı oluştur
  const record = body.record ?? body
  const message = [
    '🚨 *AquaTrack Alarm*',
    `📍 Cihaz: ${record.device_id ?? 'bilinmiyor'}`,
    `📊 Parametre: ${record.parameter ?? '-'}`,
    `📈 Değer: ${record.value ?? '-'}`,
    `⚠️ Şiddet: ${record.severity ?? '-'}`,
    record.message ? `💬 ${record.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    }
  )

  if (!telegramRes.ok) {
    const err = await telegramRes.text()
    console.error('[alert/route] Telegram API hatası:', err)
    return Response.json({ error: 'Telegram error', detail: err }, { status: 502 })
  }

  return Response.json({ ok: true })
}
