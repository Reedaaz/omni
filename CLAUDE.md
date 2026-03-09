# CLAUDE.md — Omnexor GHL

## Contexto general Omnexor

Agencia de marketing digital que construye un sistema GHL propio y un modelo replicable para clientes (inmobiliarias, clínicas, etc.).

### Stack
- **Plataforma:** GoHighLevel (GHL) — Conversation AI Flow Builder V3
- **Canal principal:** WhatsApp (templates Meta)
- **Bots:** Flow Builder V3 con AI Capture, AI Splitter, AI Message, Book Appointment

### Bots Omnexor
| Bot | Función |
|-----|---------|
| **Alex** | Bienvenida y primer contacto |
| **Luna** | Cualificación del lead (preguntas + tier + booking) |
| **Anna** | Reagendado tras cancelación |

### Tiers Luna (por presupuesto mensual)
- **Enterprise** → 5.000€+
- **Midmarket** → 1.500€–4.999€
- **Small** → 150€–1.499€
- **Nocualificado** → menos de 150€
- **Nosabe** → no sabe / ambiguo → mensaje empático + booking

### Reglas críticas GHL
- Custom fields siempre **Single Line** (nunca dropdown — AI Capture no los lee)
- Filtros en workflows con múltiples tiers en **OR** (GHL pone AND por defecto)
- **Stop Bot** siempre como primera acción en workflows de citas
- **Update Opportunity** no puede correr dentro del Flow Builder — usar tag como puente
- El AI Capture infiere respuestas del historial de conversación (**context drift** — bug conocido de GHL)
- Tag `bot_completado` al final de Luna para evitar que Alex vuelva a activarla
- Leads nuevos sin `bot_completado` → WF2 activa Luna directamente

### Tono y estilo
- Comunicación en **español casual**
- Copy bots: cercano, conversacional, sin frases condescendientes

### Cliente activo: Tecnocasa (inmobiliaria)
- Bot: **Inma** — 3 perfiles (comprador, vendedor, alquiler)
- 11 custom fields, 3 pipelines, 10 workflows
- 25 plantillas WhatsApp generadas
- Tono: cálido-profesional, sin coloquialismos, nunca promete valoraciones exactas

---

## Redas

<!-- Edita solo esta sección -->

### Estado actual


### Próximos pasos


### Notas


---

## Joel

<!-- Edita solo esta sección -->

### Estado actual


### Próximos pasos


### Notas

