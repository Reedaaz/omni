# SOP Omnexor — Procedimiento Operativo Completo

> Versión 1.0 — 2026-03-18
> Subcuenta GHL dedicada · Canal principal: WhatsApp Business

---

## 1. Visión general

Omnexor es una agencia de marketing digital que opera un sistema automatizado de captación, cualificación y cierre de leads a través de GoHighLevel (GHL). El sistema combina bots conversacionales (Flow Builder V3 + Conversation AI) con workflows de automatización, todo orquestado mediante un sistema de tags como máquina de estados.

### Stack tecnológico

| Componente | Herramienta |
|------------|------------|
| CRM / Automatización | GoHighLevel (GHL) |
| Bots conversacionales | Flow Builder V3 (AI Capture, AI Splitter, AI Message, Book Appointment) |
| Canal de comunicación | WhatsApp Business API (templates Meta) |
| Gestión de estado | Sistema de tags (32 tags — posición, tier, historial) |

---

## 2. Arquitectura del funnel

```
[Lead nuevo] → Alex (bienvenida) → WF-1 (activación) → Luna (cualificación + tier + booking)
    → WF-2 (enrutamiento por tier) → WF-3 (recordatorios pre-cita) → Cita
        → Showed → WF Ganado ✓
        → No Show → Anna (reagendado) → WF-3 de nuevo o descarte
```

### Flujo resumido

1. **Entrada**: Lead llena formulario "Cualificación Pre-IA" → se crea contacto
2. **Alex**: Bot de bienvenida — primer contacto por WhatsApp
3. **WF-1**: Activa Luna si el lead no tiene `bot_completado`
4. **Luna**: Cualifica al lead (sector, desafío, facturación, presupuesto) → asigna tier → intenta booking
5. **WF-2**: Enruta según tier al pipeline correcto (Enterprise → closer, Midmarket → cita, Small → nurturing)
6. **WF-3**: Recordatorios pre-cita (24h, 1h, 5min)
7. **Cita**: Si asiste → ganado. Si no → WF No Show activa Anna
8. **Anna**: Intenta reagendar. Si lo consigue → vuelve a WF-3. Si no → descarte

---

## 3. Bots

### 3.1 Bot Alex — Bienvenida

| Campo | Valor |
|-------|-------|
| Tipo | Flow Builder V3 |
| Trigger | Contacto nuevo inbound (WhatsApp) |
| Función | Primer contacto, bienvenida, derivar a WF-1 |

**Flujo:**
1. Recibe al lead con mensaje de bienvenida
2. Recoge contexto básico
3. Pasa el control a WF-1 para activar Luna

**Regla clave:** Alex NO pone `bot_completado` — ese tag es exclusivo de Luna.

---

### 3.2 Bot Luna — Cualificación

| Campo | Valor |
|-------|-------|
| Tipo | Flow Builder V3 |
| Bot ID | `osP7IQgAJISVcOZCOU03` |
| Trigger | Tag `luna_iniciada` añadido (vía WF-1) |
| Función | Cualificación completa del lead + asignación de tier + booking |

**Flujo detallado:**

```
Chat Initiated
  → #21 AI Capture: Validar negocio
  → #23 AI Capture: Sector
  → #24 AI Capture: Principal desafío
  → #25 AI Capture: Tamaño empresa / facturación
  → #26 AI Capture: Presupuesto mensual marketing
  → #27 AI Capture: Confirmación datos
  → AI Splitter (presupuesto) → 5 ramas de tier + "No condition met"
```

**Ramas del AI Splitter de presupuesto:**

| Rama | Tier asignado | Acción siguiente |
|------|---------------|------------------|
| 5.000€+ | `tier_enterprise` | #29 ¿Es decisor? → Book Appointment → Transfer Bot a Anna |
| 1.500€–4.999€ | `tier_midmarket` | #30 ¿Es decisor? → Book Appointment → FINAL |
| 150€–1.499€ | `tier_small` | #31 ¿Es decisor? → Book Appointment → FINAL |
| <150€ | `tier_nocualificado` | Mensaje despedida → `bot_completado` → FINAL |
| No sabe / ambiguo | `tier_nosabe` | Mensaje empático → Splitter "¿Quiere seguir?" → Sí: #32 Book / No: FINAL |
| No condition met | — | Loop con contador (max 3 intentos) |

**Tiers de Luna (por presupuesto mensual):**

| Tier | Rango | Destino |
|------|-------|---------|
| Enterprise | 5.000€+ | Closer manual asignado |
| Midmarket | 1.500€–4.999€ | Pipeline principal de conversión |
| Small | 150€–1.499€ | Nurturing / pipeline small |
| No cualificado | <150€ | Descarte directo |
| No sabe | Ambiguo | Booking opcional + seguimiento empático |

**Reglas críticas de Luna:**

- `bot_completado` debe estar en TODAS las ramas terminales sin excepción
- Prompts de aislamiento contra context drift en cada AI Capture (#21-#27): *"Haz SOLO esta pregunta. No uses información previa para inferir. Espera respuesta explícita."*
- Loop "No condition met" con contador: `luna_loop_1` → `luna_loop_2` → 3er intento cierra conversación
- NO crear oportunidad dentro del Flow Builder — usar tags como puente para WF-2
- Guardar `es_decisor` en custom field Single Line en #29/#30/#31/#32
- Ejemplos de frases en cada rama del AI Splitter para evitar clasificaciones erróneas

---

### 3.3 Bot Anna — Reagendado

| Campo | Valor |
|-------|-------|
| Tipo | Conversation AI (IA con prompt, no Flow Builder) |
| Trigger | Transfer Bot desde Omni General / Activación desde WF No Show |
| Tag existente | `anna_activa` |
| Función | Reagendar citas tras cancelación o no-show |

**Comportamiento:**
- Contacta al lead con tono empático
- Ofrece nuevas fechas disponibles
- Si reagenda → vuelve al ciclo de WF-3
- Si rechaza o no responde → descarte

**Pendiente:** Auditoría completa del prompt de Anna (ver checklist punto 11).

---

### 3.4 Bot Omni General — FAQ Router

| Campo | Valor |
|-------|-------|
| Tipo | Flow Builder V3 |
| Bot ID | `U8ZgeJuBbmuQCZb0UgWs` |
| Trigger | Chat Initiated (genérico) |
| Función | Router de consultas generales + transfer a Anna para citas |

**Ramas del AI Splitter:**

| Rama | Acción |
|------|--------|
| Agendar / reagendar / cancelar | AI Message de transición → Transfer Bot a Anna |
| Pregunta sobre Omnexor | #2 AI Capture → Respuesta informativa → FINAL |
| No condition met | #3 AI Capture → Fallback → FINAL |

**Regla clave:** Antes del Transfer Bot a Anna, siempre incluir mensaje puente: *"Ahora mismo te paso con Anna, que gestionará tu cita. Un momento..."* (el Transfer Bot tarda 30-60s).

---

## 4. Workflows

### 4.1 WF-1 — Activación de Luna

| Campo | Valor |
|-------|-------|
| Trigger | Formulario enviado → "Cualificación Pre-IA" |
| Función | Crear contacto, primer mensaje, activar Luna si procede |

**Flujo:**

```
Formulario Pre-IA
  → Create Contact
  → Crear oportunidad (stage: Nuevo lead)
  → Wait
  → Template WhatsApp: omx_bienvenida_lead ✅
  → Wait respuesta
    → Contestó → Verificar NO tiene bot_completado → Activar Bot Luna
    → No contestó (2h) → Template: omx_followup_2h ✅ → Wait 24h
      → Contestó → Activar Bot Luna
      → No contestó → Template: omx_followup_24h ✅ → Wait 24h
        → Contestó → Activar Bot Luna
        → No contestó → Tag no_cualificado → Actualizar oportunidad → FINAL
```

**Tags que maneja:** `entrada_nuevo`, `alex_activo`, `wf1_activando`

**Reglas:**
- Todos los mensajes post-wait DEBEN ser templates Meta aprobados (no mensajes libres)
- Filtro `bot_completado` antes de cada activación de Luna
- Ramas "None" deben tener tag + notificación interna

---

### 4.2 WF-2 — Enrutamiento post-cualificación

| Campo | Valor |
|-------|-------|
| Trigger | Tag añadido = `wf2_enrutando` |
| Función | Evaluar tier y enrutar al pipeline correcto |

**PRIMERA ACCIÓN OBLIGATORIA: Stop Bot**

**Ramas por tier:**

| Tier | Pipeline/Stage | Tags | Acción |
|------|---------------|------|--------|
| Enterprise | Pipeline Enterprise | `closer_asignado` | Crear oportunidad + notificar closer |
| Midmarket | Pipeline Midmarket → `wf2_enrutado` | — | Crear oportunidad → WF-3 |
| Small | Pipeline Small | `nurturing` | Crear oportunidad + secuencia nurturing |
| No sabe | — | `nurturing` | Seguimiento empático |
| No cualificado | Cerrar como "Perdido" | — | — |

**Reglas críticas:**
- Stop Bot como primera acción (siempre)
- Filtros de tier en **OR** (GHL pone AND por defecto — bug conocido)
- WF-2 es el ÚNICO responsable de crear oportunidades en pipeline (no el Flow Builder de Luna)
- Crear oportunidad al detectar tier, NO esperar al booking
- Protección anti-doble ejecución: verificar tag `oportunidad_creada` al inicio

---

### 4.3 WF-3 — Recordatorios pre-cita

| Campo | Valor |
|-------|-------|
| Trigger | Appointment Created / Confirmed en calendario |
| Función | Ciclo de recordatorios hasta la hora de la cita |

**Flujo:**

```
Appointment Confirmed
  → Condition: ¿tiene agendado_ia?
    → NO (primera vez):
        → Add Tag agendado_ia
        → Template: omx_confirmacion_cita ✅
        → Wait hasta 24h antes → Template: omx_recordatorio_24h ✅ → Add Tag recordatorio_enviado
        → Wait hasta 1h antes → Template: omx_recordatorio_1h ✅
        → Wait hasta 5min antes → Template: omx_recordatorio_5min ✅
    → SÍ (reagendado):
        → Solo confirmación nuevo horario
        → Continuar desde Wait 24h
```

**Tags que maneja:** `recordatorio_24h`, `recordatorio_2h`, `cita_proxima`, `recordatorio_enviado`, `agendado_ia`

**Reglas:**
- Verificar `agendado_ia` al inicio para diferenciar primera cita vs reagendado
- TODOS los mensajes post-wait DEBEN ser templates Meta aprobados
- Al cancelar una cita, el WF de cancelación debe eliminar `agendado_ia`

---

### 4.4 WF No Show

| Campo | Valor |
|-------|-------|
| Trigger | Appointment status cambia a "No Show" |
| Función | Contactar al lead, intentar reagendar vía Anna |

**Flujo:**

```
Appointment No Show
  → Add Tag noshow_detectado + noshow (historial)
  → Remove Tag cita_proxima
  → Wait 1-2h (margen por tardanza)
  → Template: omx_noshow_contacto ✅
  → Wait respuesta (2 días)
    → Contestó → Activar Anna (anna_activa) → Reagendado o descarte
    → No contestó → Template: omx_noshow_24h ✅ → Wait 24h
      → Contestó → Activar Anna
      → No contestó → Tag no_show_sin_respuesta → Internal Notification → FINAL
```

**Tags que maneja:** `noshow_detectado`, `noshow`, `anna_activa`, `anna_reagendando`, `reagendado`, `anna_descartada`

---

### 4.5 WF Ganado — Cita realizada

| Campo | Valor |
|-------|-------|
| Trigger | Appointment status cambia a "Showed" |
| Función | Marcar lead como convertido |

**Flujo:**
1. Remove tag `cita_proxima`
2. Add tag `ganado`
3. Actualizar oportunidad a stage "Ganado"
4. Template: `omx_post_sesion` ✅

---

## 5. Sistema de tags — Máquina de estados

### 5.1 Principios

1. **Un solo tag de posición activo** — en todo momento el contacto tiene exactamente UN tag de posición. Al avanzar, se borra el anterior y se añade el nuevo.
2. **Historial permanente** — los tags de historial y tier nunca se borran. Se acumulan.
3. **Orden universal en cada step** — Stop Bot (si aplica) → Remove Tag anterior → Add Tag nuevo → Acción del negocio.
4. **`bot_completado` como barrera** — en TODAS las ramas terminales de Luna. Impide reactivación por Alex.

### 5.2 Tags de posición (16) — se borran al avanzar

| Tag | Workflow / Bot | Descripción |
|-----|---------------|-------------|
| `entrada_nuevo` | Entrada | Lead acaba de entrar, sin bot activo |
| `alex_activo` | Bot Alex | Alex enviando bienvenida |
| `wf1_activando` | WF-1 | WF-1 procesando activación de Luna |
| `luna_iniciada` | Bot Luna | Luna asignada, esperando primer mensaje |
| `luna_cualificando` | Bot Luna | Luna haciendo preguntas activamente |
| `luna_booking` | Bot Luna | Luna en proceso de agendar (tier ya asignado) |
| `luna_loop_1` | Bot Luna | Primer reintento en loop "no condition met" |
| `luna_loop_2` | Bot Luna | Segundo reintento — 3er intento cierra |
| `wf2_enrutando` | WF-2 | WF-2 evaluando tier para enrutar |
| `wf2_enrutado` | WF-2 | WF-2 completó enrutamiento |
| `recordatorio_24h` | WF-3 | Recordatorio 24h enviado |
| `recordatorio_2h` | WF-3 | Recordatorio 2h enviado |
| `cita_proxima` | WF-3 | Cita confirmada pendiente |
| `noshow_detectado` | WF No Show | No show registrado, Anna pendiente |
| `anna_activa` | Bot Anna | Anna en conversación activa **(ya existe en GHL)** |
| `anna_reagendando` | Bot Anna | Anna ofreciendo nueva fecha |

### 5.3 Tags de tier (5) — permanentes, los asigna Luna

| Tag | Presupuesto | Destino |
|-----|-------------|---------|
| `tier_enterprise` | 5.000€+ | Closer manual |
| `tier_midmarket` | 1.500€–4.999€ | Pipeline conversión |
| `tier_small` | 150€–1.499€ | Nurturing / small |
| `tier_nocualificado` | <150€ | Descarte |
| `tier_nosabe` | Ambiguo | Booking opcional |

### 5.4 Tags de historial (11) — permanentes, acumulativos

| Tag | Cuándo se añade | Notas |
|-----|----------------|-------|
| `bot_completado` | Todas las ramas terminales de Luna | **(ya existe)** — barrera anti-reactivación |
| `cita_agendada` | Booking completado en Luna | **(ya existe)** |
| `agendado_ia` | Confirmación primera cita en WF-3 | **(ya existe)** — evita duplicar recordatorios en reagendados |
| `luna_completada` | Luna cierra con éxito | Cualificación OK |
| `luna_descartada` | No cualificado o loop agotado | Luna cerró sin cualificar |
| `recordatorio_enviado` | Primer recordatorio de WF-3 | Al menos un recordatorio enviado |
| `noshow` | Appointment = No Show | Permanente aunque reagende |
| `reagendado` | Anna consigue nueva cita | — |
| `anna_descartada` | Anna agota intentos | — |
| `ganado` | Appointment = Showed | Lead convertido |
| `nurturing` | WF-2 rama Small o Nosabe | Derivado a largo plazo |
| `closer_asignado` | WF-2 rama Enterprise | — |

### 5.5 Diagrama de estados

```
[Contacto nuevo]
     │
     ▼
entrada_nuevo
     │
     ▼ (Alex inicia)
alex_activo
     │
     ▼ (Alex termina)
wf1_activando
     │
     ├─ ya tiene bot_completado ──────────────── FIN (no hacer nada)
     │
     ▼ (Luna asignada)
luna_iniciada → luna_cualificando
     │
     ├─ No cualificado ── tier_nocualificado + luna_descartada + bot_completado ── FIN
     │
     ├─ tier asignado ─── tier_[X] (permanente)
     │         │
     │         ▼
     │   luna_booking
     │         │
     │         ├─ Booking OK  ── wf2_enrutando + luna_completada + cita_agendada + bot_completado
     │         └─ No booking  ── wf2_enrutando + luna_completada + bot_completado
     │
     ├─ loop_1 ──► loop_2 ──► luna_descartada + bot_completado ── FIN
     │
     ▼ (WF-2 enruta)
wf2_enrutando
     │
     ├─ Enterprise ─── closer_asignado ──────── FIN / seguimiento manual
     ├─ Midmarket  ─── wf2_enrutado ──────────── WF-3 ▼
     ├─ Small      ─── nurturing ──────────────── nurturing / WF-3 ▼
     ├─ Nosabe     ─── nurturing ──────────────── seguimiento
     └─ No cualif. ────────────────────────────── FIN
              │
              ▼ (WF-3 — hay cita)
     recordatorio_24h ──► recordatorio_2h ──► cita_proxima
              │
              ├─ Showed ── ganado ───────────── FIN ✓
              │
              └─ No Show ── noshow_detectado + noshow
                                │
                                ▼ (Anna)
                         anna_activa ──► anna_reagendando
                                │
                                ├─ Reagenda ── reagendado ──► vuelve a WF-3
                                └─ Rechaza  ── anna_descartada ── FIN
```

### 5.6 Estados finales — combinaciones de tags

| Situación | Tags historial presentes | Tag posición |
|-----------|-------------------------|--------------|
| Ganado (cita realizada) | `ganado` + `cita_agendada` + `luna_completada` | ninguno |
| No show sin reagendar | `noshow` + `anna_descartada` | ninguno |
| Reagendado (esperando cita) | `noshow` + `reagendado` | `recordatorio_24h` |
| No cualificado | `luna_descartada` + `tier_nocualificado` + `bot_completado` | ninguno |
| Loop agotado | `luna_descartada` + `bot_completado` + tier (si fue asignado) | ninguno |
| Nurturing largo plazo | `nurturing` + tier | ninguno |
| Enterprise — closer asignado | `closer_asignado` + `tier_enterprise` | ninguno (gestión manual) |

---

## 6. Templates WhatsApp (Meta Business)

Todos los mensajes enviados después de un wait de 24h+ DEBEN usar templates Meta aprobados. Los mensajes libres fallan silenciosamente en GHL fuera de la ventana de 24h.

### 6.1 WF-1 Activación — Captación

| # | Nombre template | Momento de uso | Variables |
|---|----------------|----------------|-----------|
| 1 | `omx_bienvenida_lead` | Primer contacto | {{1}}=nombre, {{4}}=empresa |
| 2 | `omx_followup_2h` | Follow up 2h sin respuesta | {{1}}=nombre, {{4}}=empresa |
| 3 | `omx_followup_24h` | Último aviso 24h | {{1}}=nombre, {{4}}=empresa |

### 6.2 WF-3 Recordatorios

| # | Nombre template | Momento de uso | Variables |
|---|----------------|----------------|-----------|
| 4 | `omx_confirmacion_cita` | Inmediato post-booking | {{1}}=nombre, {{2}}=fecha, {{3}}=hora, {{4}}=empresa |
| 5 | `omx_recordatorio_24h` | 24h antes de la cita | {{1}}=nombre, {{2}}=fecha, {{3}}=hora, {{4}}=empresa |
| 6 | `omx_recordatorio_1h` | 1h antes | {{1}}=nombre, {{4}}=empresa, {{5}}=enlace sala |
| 7 | `omx_recordatorio_5min` | 5 min antes | {{1}}=nombre, {{5}}=enlace sala |

### 6.3 WF No Show — Recuperación

| # | Nombre template | Momento de uso | Variables |
|---|----------------|----------------|-----------|
| 8 | `omx_noshow_contacto` | Primer contacto post no-show | {{1}}=nombre, {{4}}=empresa |
| 9 | `omx_noshow_24h` | Recuperación final 24h | {{1}}=nombre, {{4}}=empresa |

### 6.4 Post-sesión

| # | Nombre template | Momento de uso | Variables |
|---|----------------|----------------|-----------|
| 10 | `omx_post_sesion` | Tras cita realizada (showed) | {{1}}=nombre, {{4}}=empresa |

---

## 7. Custom fields GHL

| Campo | Tipo | Usado por | Notas |
|-------|------|-----------|-------|
| `luna_step` | Single Line | Bot Luna | Campo de estado del bot |
| `es_decisor` | Single Line | Bot Luna (#29-#32) | El closer necesita saberlo antes de la cita |
| Sector | Single Line | Bot Luna (#23) | Nunca dropdown — AI Capture no los lee |
| Principal desafío | Single Line | Bot Luna (#24) | — |
| Facturación | Single Line | Bot Luna (#25) | — |
| Presupuesto | Single Line | Bot Luna (#26) | — |

**Regla:** Custom fields siempre **Single Line** (nunca dropdown — AI Capture de GHL no los lee).

---

## 8. Reglas críticas de GHL

### 8.1 Reglas de operación

| Regla | Detalle |
|-------|---------|
| Stop Bot primero | En WF-2 y cualquier workflow que recibe del bot, Stop Bot como primera acción |
| Filtros OR en tier | GHL pone AND por defecto — cambiar manualmente a OR en filtros con múltiples tiers |
| Templates post-wait | Mensajes después de Wait 24h+ siempre template Meta aprobado (los libres fallan silenciosamente) |
| `bot_completado` universal | En TODAS las ramas terminales de Luna — no hay excepciones |
| Oportunidades en WF-2 | Crear oportunidad en WF-2 al detectar tier, NO dentro del Flow Builder de Luna |
| Transfer Bot + mensaje | Siempre enviar mensaje de transición antes del Transfer Bot (delay 30-60s) |
| Loop con Go To | El nodo destino debe usar un custom field diferente — GHL salta capturas si el campo ya tiene valor |
| Wait mínimo | El Wait mínimo en GHL es 1 minuto — no usar para gestionar delays del Transfer Bot |

### 8.2 Bugs conocidos GHL Flow Builder V3

| Bug | Descripción | Solución |
|-----|-------------|----------|
| Context Drift | Con AI Captures secuenciales, la IA infiere respuestas del historial y se salta preguntas | Prompt de aislamiento en cada nodo |
| AI Splitter fallback | Expresiones numéricas variadas caen en "No condition met" | Ejemplos de frases en el prompt de cada rama |
| Loop infinito | Go To sin límite de iteraciones atrapa al lead | Tags secuenciales como contador (max 3) |
| Doble booking | Dos mensajes rápidos del usuario crean dos reservas | Pedir al usuario que responda en un solo mensaje |
| Transfer Bot delay | 30-60s sin respuesta durante la transición | Mensaje puente previo |
| Go To + AI Capture | Si el campo ya tiene valor, GHL salta el nodo en la segunda pasada | Limpiar campo antes del Go To o usar campo diferente |
| Update Opportunity | No puede ejecutarse dentro del Flow Builder de forma fiable | Usar tag como puente → WF externo |

---

## 9. Orden universal de ejecución en cada paso

En cada transición de estado, seguir siempre este orden:

```
1. Stop Bot (si aplica — solo en workflows que reciben del bot)
2. Remove Tag anterior (posición)
3. Add Tag nuevo (posición + historial si aplica)
4. Acción del negocio (crear oportunidad, enviar mensaje, notificación, etc.)
```

---

## 10. Hallazgos de auditoría y plan de acción

### Resumen de la auditoría

| Severidad | Cantidad |
|-----------|----------|
| Críticos | 8 |
| Importantes | 10 |
| Optimizaciones | 5 |

### Checklist de implementación (priorizado)

| # | Tarea | Severidad | Elemento | Tiempo est. |
|---|-------|-----------|----------|-------------|
| 1 | Añadir `bot_completado` en ramas terminales de Luna sin este tag | CRITICO | Bot Luna (LUN-03, LUN-04) | ~15 min |
| 2 | Implementar contador de iteraciones en loop "No condition met" | CRITICO | Bot Luna (LUN-02) | ~45 min |
| 3 | Añadir prompts de aislamiento contra Context Drift en #21-#27 | CRITICO | Bot Luna (LUN-01) | ~45 min |
| 4 | Convertir mensajes libres a templates Meta en WF-1, WF-3, WF No Show | CRITICO | WF-1, WF-3, WF No Show | 1-2h + espera Meta |
| 5 | Eliminar "Crear oportunidad" del Flow Builder Luna → centralizar en WF-2 | CRITICO | Bot Luna + WF-2 (LUN-05, WF2-01) | ~1h |
| 6 | Añadir mensaje puente en Bot Omni antes del Transfer Bot a Anna | CRITICO | Bot Omni (BOG-01) | ~10 min |
| 7 | Añadir ejemplos de frases en AI Splitter de presupuesto | CRITICO | Bot Luna (LUN-06) | ~20 min |
| 8 | Añadir filtro anti-re-entrada en WF-3 para reagendados | IMPORTANTE | WF-3 (WF3-02) | ~20 min |
| 9 | Guardar `es_decisor` en custom field en #29/#30/#31/#32 | IMPORTANTE | Bot Luna (LUN-08) | ~20 min |
| 10 | Añadir notificaciones internas en puntos de fallo sin visibilidad | IMPORTANTE | WF-1, WF-2, WF No Show | ~30 min |
| 11 | Auditar prompt de Anna (bot de reagendado) — Fase 2 | IMPORTANTE | Anna | ~1h |
| 12 | Crear 28 tags nuevos en GHL Settings (4 ya existen) | IMPORTANTE | Tags | ~30 min |
| 13 | Probar con contacto de test: recorrer todo el funnel paso a paso | IMPORTANTE | Todo | ~1h |

---

## 11. Cliente activo: Tecnocasa (inmobiliaria)

| Campo | Valor |
|-------|-------|
| Bot | **Inma** — 3 perfiles (comprador, vendedor, alquiler) |
| Custom fields | 11 |
| Pipelines | 3 |
| Workflows | 10 |
| Templates WhatsApp | 25 |
| Tono | Cálido-profesional, sin coloquialismos, nunca promete valoraciones exactas |

---

## 12. Convenciones y estándares

### Nomenclatura

- **Tags:** `snake_case` minúsculas, sin tildes, sin espacios
- **Custom fields:** `snake_case`, tipo Single Line siempre
- **Templates WhatsApp:** prefijo `omx_` + nombre descriptivo

### Tono y estilo

- Comunicación en **español casual**
- Copy de bots: cercano, conversacional, sin frases condescendientes
- Templates: asertivos pero respetuosos, con emojis moderados

### Principios de desarrollo

- Siempre probar con contacto de test antes de activar en producción
- Un tag de posición activo a la vez — verificar manualmente tras cada cambio
- Documentar cualquier cambio en este SOP
- Templates Meta: someter a aprobación con antelación (24-48h de proceso)

---

## 13. Tecnología a vigilar

**MoltClaw** (gomoltclaw.ai) — Plataforma de agentes IA de GHL, en beta desde feb 2026. Combina OpenClaw (open-source) con 350+ endpoints de GHL. Si saca API/MCP abierto, permitiría conectar Claude directamente a todo el stack de GHL (CRM, workflows, WhatsApp, Voice AI, Knowledge Base). Pendiente de confirmar acceso externo.

---

*Última actualización: 2026-03-18*
*Archivos de referencia: auditoria-ghl-omnexor.html · tags-estado-omnexor.html · template whatsapp omnexor postgemini.html*