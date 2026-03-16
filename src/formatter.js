/**
 * Formatea los payloads de GHL en mensajes Telegram legibles.
 * GHL envía distintos shapes según el evento — este archivo normaliza todo.
 */

function esc(text) {
  // Escapa caracteres especiales de MarkdownV2
  if (!text) return '';
  return String(text).replace(/[_*[\]()~`>#+=|{}.!\\-]/g, '\\$&');
}

function formatPhone(phone) {
  if (!phone) return '—';
  return phone;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

function formatMessage(eventType, payload) {
  const data = payload.data || payload;

  switch (eventType) {

    // ─── NUEVO CONTACTO / LEAD ──────────────────────────────────────────────
    case 'ContactCreate':
    case 'contact.created':
    case 'contact_created': {
      const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Sin nombre';
      const source = data.source || data.attributionSource?.medium || '—';
      const tags = data.tags?.join(', ') || '—';

      return `🟢 *Nuevo Lead*\n\n` +
        `👤 *Nombre:* ${esc(name)}\n` +
        `📧 *Email:* ${esc(data.email || '—')}\n` +
        `📱 *Teléfono:* ${esc(formatPhone(data.phone))}\n` +
        `🌐 *Fuente:* ${esc(source)}\n` +
        `🏷️ *Tags:* ${esc(tags)}\n` +
        `📍 *Ubicación:* ${esc([data.city, data.country].filter(Boolean).join(', ') || '—')}\n` +
        `🕒 *Fecha:* ${esc(formatDate(data.dateAdded || payload.timestamp))}`;
    }

    // ─── OPORTUNIDAD CREADA ─────────────────────────────────────────────────
    case 'OpportunityCreate':
    case 'opportunity.created':
    case 'opportunity_created': {
      const contactName = [data.contact?.firstName, data.contact?.lastName].filter(Boolean).join(' ') || data.contactName || 'Sin nombre';
      const value = data.monetaryValue ? `${Number(data.monetaryValue).toLocaleString('es-ES')} ${data.currency || '€'}` : '—';

      return `💼 *Nueva Oportunidad*\n\n` +
        `👤 *Contacto:* ${esc(contactName)}\n` +
        `📋 *Oportunidad:* ${esc(data.name || '—')}\n` +
        `💰 *Valor:* ${esc(value)}\n` +
        `🗂️ *Pipeline:* ${esc(data.pipeline?.name || data.pipelineName || '—')}\n` +
        `📊 *Etapa:* ${esc(data.pipelineStage?.name || data.stageName || '—')}\n` +
        `🕒 *Fecha:* ${esc(formatDate(data.createdAt || payload.timestamp))}`;
    }

    // ─── OPORTUNIDAD CAMBIA DE ETAPA ────────────────────────────────────────
    case 'OpportunityStageUpdate':
    case 'opportunity.stageUpdate':
    case 'opportunity_stage_update':
    case 'OpportunityUpdate':
    case 'opportunity.updated': {
      const contactName = [data.contact?.firstName, data.contact?.lastName].filter(Boolean).join(' ') || data.contactName || 'Sin nombre';
      const prevStage = data.previousStage?.name || data.previousStageName || '—';
      const newStage = data.pipelineStage?.name || data.stageName || data.currentStageName || '—';

      return `🔄 *Oportunidad Actualizada*\n\n` +
        `👤 *Contacto:* ${esc(contactName)}\n` +
        `📋 *Oportunidad:* ${esc(data.name || '—')}\n` +
        `🗂️ *Pipeline:* ${esc(data.pipeline?.name || data.pipelineName || '—')}\n` +
        `📊 *Etapa anterior:* ${esc(prevStage)}\n` +
        `✅ *Nueva etapa:* ${esc(newStage)}\n` +
        `💰 *Valor:* ${esc(data.monetaryValue ? `${Number(data.monetaryValue).toLocaleString('es-ES')} ${data.currency || '€'}` : '—')}\n` +
        `🕒 *Fecha:* ${esc(formatDate(data.updatedAt || payload.timestamp))}`;
    }

    // ─── CITA AGENDADA ──────────────────────────────────────────────────────
    case 'AppointmentCreate':
    case 'appointment.created':
    case 'appointment_created': {
      const contactName = [data.contact?.firstName, data.contact?.lastName].filter(Boolean).join(' ') || data.title || 'Sin nombre';

      return `📅 *Nueva Cita Agendada*\n\n` +
        `👤 *Contacto:* ${esc(contactName)}\n` +
        `📅 *Fecha/Hora:* ${esc(formatDate(data.startTime))}\n` +
        `⏰ *Duración:* ${esc(data.duration ? `${data.duration} min` : '—')}\n` +
        `📍 *Calendario:* ${esc(data.calendar?.name || data.calendarName || '—')}\n` +
        `📝 *Notas:* ${esc(data.notes || data.description || '—')}\n` +
        `🕒 *Creada:* ${esc(formatDate(data.createdAt || payload.timestamp))}`;
    }

    // ─── FORMULARIO ENVIADO ─────────────────────────────────────────────────
    case 'FormSubmission':
    case 'form.submitted':
    case 'form_submitted': {
      const name = [data.firstName, data.lastName, data.name].filter(Boolean)[0] || 'Sin nombre';

      // Construir campos del formulario dinámicamente
      const skipKeys = ['id', 'locationId', 'contactId', 'formId', 'type', 'event', 'timestamp', 'createdAt', 'updatedAt'];
      const extraFields = Object.entries(data)
        .filter(([k]) => !skipKeys.includes(k) && !['firstName', 'lastName', 'name', 'email', 'phone'].includes(k))
        .slice(0, 6) // max 6 campos extra
        .map(([k, v]) => `📌 *${esc(k)}:* ${esc(String(v || '—'))}`)
        .join('\n');

      return `📝 *Formulario Enviado*\n\n` +
        `👤 *Nombre:* ${esc(name)}\n` +
        `📧 *Email:* ${esc(data.email || '—')}\n` +
        `📱 *Teléfono:* ${esc(formatPhone(data.phone))}\n` +
        `📋 *Formulario:* ${esc(data.formName || data.form?.name || '—')}\n` +
        (extraFields ? `\n${extraFields}\n` : '') +
        `🕒 *Fecha:* ${esc(formatDate(data.submittedAt || data.createdAt || payload.timestamp))}`;
    }

    // ─── EVENTOS NO MANEJADOS ───────────────────────────────────────────────
    default:
      console.log(`Evento no mapeado: ${eventType}`);
      return null; // no enviar mensaje para eventos desconocidos
  }
}

module.exports = { formatMessage };
