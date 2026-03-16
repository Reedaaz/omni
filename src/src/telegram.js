const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    if (!BOT_TOKEN || !CHAT_ID) {
      const err = new Error('Faltan variables de entorno: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID');
      console.error('❌', err.message);
      return reject(err);
    }

    const body = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.ok) {
            console.error('❌ Telegram API error:', parsed.description);
            // No rechazar — loguear y continuar (para no bloquear el webhook)
            resolve(parsed);
          } else {
            resolve(parsed);
          }
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Error de red enviando a Telegram:', err.message);
      reject(err);
    });

    req.write(body);
    req.end();
  });
}

module.exports = { sendTelegramMessage };
