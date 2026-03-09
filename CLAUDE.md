# CLAUDE.md — n8n Workflows para Omnexor

## Objetivo
Crear, validar y mejorar workflows de n8n para Omnexor (agencia de marketing digital) y sus clientes, usando Claude Code como asistente principal.

---

## Contexto Omnexor

### Quién es
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

### Cliente activo: Tecnocasa (inmobiliaria)
- Bot: **Inma** — 3 perfiles (comprador, vendedor, alquiler)
- 11 custom fields, 3 pipelines, 10 workflows
- 25 plantillas WhatsApp generadas
- Testing en subcuenta Omnexor (restricción de número WA)

### Estado actual
- ✅ Arquitectura de bots Omnexor definida (Alex / Luna / Anna)
- ✅ AI Splitter con 5 ramas de tier configurado en Luna
- ✅ Plantillas WA Omnexor y Tecnocasa completas
- ✅ SOP Tecnocasa completo
- ⚠️ Bug GHL conocido: AI Capture salta preguntas por context drift (no resoluble con config)
- ❌ Branch "None" de Alex sin tag `revision_manual` ni notificación al equipo

### Próximos pasos GHL
1. Resolver branch None de Alex → añadir tag `revision_manual` + notificación interna
2. Añadir tag `bot_completado` al final de Luna + condición en WF2
3. Completar implementación Tecnocasa en GHL
4. Enviar plantillas a aprobación Meta

### Tono y estilo
- Comunicación en **español casual**
- Copy bots: cercano, conversacional, sin frases condescendientes
- Inma (Tecnocasa): tono cálido-profesional, sin coloquialismos, nunca promete valoraciones exactas

---

## n8n

### Herramientas disponibles
- n8n MCP server: https://github.com/czlonkowski/n8n-mcp
- n8n skills
- Acceso a documentación oficial de n8n cuando sea necesario

### Reglas de trabajo
- Siempre entender primero el objetivo del workflow
- Proponer una arquitectura antes de construir
- Validar nodos, expresiones y dependencias
- Priorizar claridad, mantenibilidad y simplicidad
- Si falta información crítica, indicarlo claramente

### Flujo recomendado
1. Entender requerimientos
2. Buscar nodos o templates relevantes
3. Diseñar el workflow
4. Crear o modificar el workflow
5. Validar expresiones y configuraciones
6. Dejar listo para conectar credenciales y probar

---

## Estado actual n8n (actualizado 2026-03-09)

### n8n local
- Corriendo en Docker → http://localhost:5678
- API key configurada en MCP
- Credencial OpenAI conectada (id: `4XRvJB5ZReo0OJRJ`)

### Workflows creados

| ID | Nombre | Nodos | Estado |
|----|--------|-------|--------|
| VYRdem6pDRKAu3lh | Omnexor — Lead Follow Up (Formulario GHL) | 24 | ❌ Inactivo |
| 72QHqPGeHkpQH7O2 | Omnexor — Luna (Agente Cualificador) | 15 | ❌ Inactivo |
| c7IBN4v6Xv6aOxhG | Omnexor — Luna v2 (HTTP OpenAI) | 23 | ✅ Activo |
| zX0p7NWCwxoE38KB | TEST — Luna conversacion | 5 | ✅ Activo |

### Luna v2 — Arquitectura
- **Webhook** POST `/luna-v2` — recibe mensajes de WhatsApp desde GHL
- **Set** — extrae contact_id, mensaje, nombre, datos previos (sector, desafío, presupuesto), historial
- **Code** — construye mensajes para OpenAI con system prompt de Luna
- **HTTP Request** → OpenAI GPT-4.1 (`gpt-4.1`, temp 0.7, max 500 tokens)
- Lógica de tiers: enterprise (5k+), midmarket (1.5k-5k), small (150-1.5k), no_calificado (<150), no_sabe
- Cuando tiene las 7 preguntas respondidas → devuelve JSON `qualification_complete` con tier, es_decisor, datos

### TEST — Luna conversacion
- Versión simplificada de 5 nodos para probar la conversación directamente
- Webhook POST `/luna-test`
- Mismo prompt de Luna con historial acumulado
- Devuelve `luna_dice` con la respuesta

### Pendiente
- [ ] Conectar GHL webhook → n8n cuando lead responde WA
- [ ] Nodo de routing post-cualificación (según tier → acciones GHL)
- [ ] Guardar historial de conversación por contact_id (memoria persistente)
- [ ] Integrar booking GHL para tiers Enterprise/Midmarket/Small
- [ ] API key GHL (disponible cuando termine trial o con cuenta agencia)
