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
- Tag `bot_completado` al final de Luna para evitar que Alex vuelva a activarla — aplicar en TODAS las ramas terminales
- Leads nuevos sin `bot_completado` → WF2 activa Luna directamente
- Crear oportunidad en pipeline tan pronto se asigna tier (antes del booking, no después)
- Guardar `es_decisor` en custom field Single Line — el closer necesita saberlo antes de la cita
- Wait nodes de 24h: el primer mensaje después SIEMPRE debe ser template Meta aprobado (mensajes libres fallan silenciosamente)
- Transfer Bot (Enterprise): añadir Wait mínimo antes para que llegue el mensaje de confirmación primero
- Loops con Go To: el nodo destino debe usar un custom field diferente — GHL salta capturas si el campo ya tiene valor

### Bugs conocidos GHL Flow Builder V3
- **Context Drift (AI Capture):** con capturas secuenciales, la IA infiere respuestas del historial y se salta preguntas. Solución: añadir en cada nodo "Haz SOLO esta pregunta. No inferas ni asumas la respuesta. Espera una respuesta explícita."
- **AI Splitter "No condition met" con respuestas válidas:** expresiones numéricas variadas ("unos mil euros", "sobre 1500€") pueden caer en fallback. Solución: incluir ejemplos de frases en el prompt del splitter.
- **Loop infinito en "No condition met":** sin límite de iteraciones el lead queda atrapado. Solución: tags secuenciales (`loop_1`, `loop_2`) como contador — al 3er intento cerrar conversación.
- **Book Appointment doble booking:** dos mensajes rápidos del usuario pueden crear dos reservas. Solución: pedir al usuario que responda en un solo mensaje.
- **Transfer Bot tarda 30-60s en activarse:** el lead puede quedar sin respuesta durante la transición. Gestionar expectativa con mensaje previo.
- **Go To + AI Capture:** si el campo ya tiene valor, GHL salta el nodo en la segunda pasada. Limpiar el campo antes del Go To o usar campo diferente.

### Tono y estilo
- Comunicación en **español casual**
- Copy bots: cercano, conversacional, sin frases condescendientes

### Bot Luna — mejoras pendientes (análisis 2026-03-09)
| Prioridad | Mejora |
|-----------|--------|
| 🔴 CRÍTICO | Prompt de aislamiento en cada AI Capture (#21-#27) contra context drift |
| 🔴 CRÍTICO | Límite de iteraciones en loop "No condition met" (tags `loop_1/2/3`) |
| 🟠 ALTO | Tag `bot_completado` en ramas "No cualificado" y "No" del splitter No sabe |
| 🟠 ALTO | Mover "Crear oportunidad" al momento de asignación de tier (antes del booking) |
| 🟡 MEDIO | Wait antes de Transfer Bot en rama Enterprise |
| 🟡 MEDIO | Mensajes post-booking diferenciados por tier (Enterprise → escalada a closer) |
| 🟡 MEDIO | Guardar `es_decisor` en custom field en capturas #29/#30/#31/#32 |
| 🟡 MEDIO | Fallback explícito en splitter "¿Quiere seguir agendando?" (3ª rama) |

---

### Tecnología a vigilar
- **MoltClaw** (gomoltclaw.ai) — plataforma de agentes IA de GHL, beta desde feb 2026. Combina OpenClaw (open-source) con 350+ endpoints de GHL. Si saca API/MCP abierto, permitiría conectar Claude directamente a todo el stack de GHL (CRM, workflows, WhatsApp, Voice AI, Knowledge Base...). Pendiente de confirmar acceso externo.

---

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


---

## Contexto personal (second brain)

Archivos de contexto — cargar con @ cuando sea relevante, no se auto-importan:

- `@context/me.md` — perfil de Redas
- `@context/work.md` — detalle completo de Omnexor, packs, clientes, herramientas
- `@context/team.md` — equipo (Redas + Joel)
- `@context/current-priorities.md` — prioridades Q2 2026
- `@context/goals.md` — milestones del trimestre

**Decisiones importantes:** `decisions/log.md` (append-only)
**Templates:** `templates/session-summary.md`

### Skills a construir (backlog)
- WF de onboarding replicable para clientes nuevos
- Workflow de prospección outbound (clínicas, inmobiliarias)
- Generador de pipelines base + calendarios GHL
