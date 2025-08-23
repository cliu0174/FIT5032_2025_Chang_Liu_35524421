// functions/index.js
import functions from 'firebase-functions'
import corsLib from 'cors'
import { Resend } from 'resend'

const cors = corsLib({ origin: true })

// 从 functions:config 里拿密钥和目标收件人
const RESEND_KEY = functions.config().resend?.key
const ADMIN_EMAIL = functions.config().app?.admin_email

if (!RESEND_KEY || !ADMIN_EMAIL) {
  console.warn('Resend key or admin email not set. Use `firebase functions:config:set ...`')
}

const resend = new Resend(RESEND_KEY)

export const sendEmail = functions
  .region('australia-southeast1') // 你在澳洲就用这个，别的地区可改
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
      try {
        const { name, from, subject, message, attachment } = req.body || {}

        // attachment: { filename, content, type } 其中 content 为 base64
        const attachments = attachment
          ? [{ filename: attachment.filename, content: attachment.content }]
          : []

        const { data, error } = await resend.emails.send({
          from: `${name || 'Website'} <no-reply@yourdomain.dev>`, // 可自定义发件显示名
          to: [ADMIN_EMAIL],
          reply_to: from,       // 便于你在邮箱里直接回信
          subject: subject || 'New message from website',
          html: `<p><b>From:</b> ${name || ''} &lt;${from || ''}&gt;</p>
                 <p>${(message || '').replace(/\n/g, '<br>')}</p>`,
          attachments
        })

        if (error) throw error
        res.json({ ok: true, id: data?.id || '' })
      } catch (e) {
        console.error(e)
        res.status(500).json({ ok: false, error: e.message || String(e) })
      }
    })
  })
