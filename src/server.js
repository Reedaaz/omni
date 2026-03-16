const express = require('express');
const { formatMessage } = require('./formatter');
const { sendTelegramMessage } = require('./telegram');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET || '';

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'GHL → Telegram Bot', timestamp: new Date().toISOString() });
});

// Main webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    // Optional: verify secret token in header
    if (WEBHOOK_SECRET) {
      const incoming = req.headers['x-webhook-secret'] || req.headers['x-ghl-secret'] || '';
      if (incoming !== WEBHOOK_SECRET) {
        console.warn('⚠️  Webhook secret mismatch');
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const payload = req.body;
    const eventType = payload.type || payload.event || 'unknown';

    console.log(`📥 Evento recibido: ${eventType}`);
    console.log(JSON.stringify(payload, null, 2));

    const message = formatMessage(eventType, payload);

    if (message) {
      await sendTelegramMessage(message);
      console.log(`✅ Mensaje enviado a Telegram para evento: ${eventType}`);
    } else {
      console.log(`⏭️  Evento ignorado: ${eventType}`);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('❌ Error procesando webhook:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
