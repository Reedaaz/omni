# Prompt — Auditoría GHL completa (estilo clínica dental)

---

Voy a pasarte una serie de capturas de pantalla de todos mis workflows y bots de GHL (GoHighLevel) para el proyecto **Omnexor** (agencia de automatización IA).

Quiero que hagas lo siguiente:

---

## FASE 1 — Documentar todo

A medida que te vaya pasando las capturas, mapea y guarda en memoria la estructura completa de cada elemento:

**Para cada Flow Builder / Bot:**
- Nombre del bot y Bot ID
- Trigger de activación
- Cada nodo en orden: tipo, nombre, qué hace
- Todas las ramas (branches): condiciones, tags aplicados, mensajes enviados
- Cómo termina cada rama (FINAL, loop, activación de otro bot, etc.)

**Para cada Workflow:**
- Nombre
- Trigger (tipo + condición exacta)
- Cada paso en orden
- Branches y condiciones
- Tags aplicados en cada punto
- Conexiones con otros workflows o bots

**Para cada template de WhatsApp mencionado:**
- Nombre del template
- En qué workflow/bot se usa
- Cuándo se envía (timing)

Cuando termines de recibir todas las capturas, dime "listo para auditar" y espera mi confirmación.

---

## FASE 2 — Auditoría experta GHL

Una vez documentado todo, actúa como **experto senior en GoHighLevel** con experiencia en:
- Flow Builder V3 y Conversation AI
- Workflows y automatizaciones WhatsApp
- Reglas Meta/WhatsApp Business (24h, templates)
- Gestión de pipelines y oportunidades
- GDPR y opt-out
- Arquitectura de sistemas de automatización para agencias IA

Analiza el ecosistema completo y detecta:

### Problemas críticos (arreglar urgente)
- Conflictos entre workflows (mismo trigger, mismo timing)
- Loops infinitos sin protección
- Mensajes >24h sin template Meta aprobado
- Reglas de GHL incumplidas (bot_completado, Stop Bot, etc.)
- Riesgo de duplicados y re-entradas

### Problemas importantes (próximas 2 semanas)
- Nodos fire-and-forget sin respuesta handling
- Tags inconsistentes o faltantes
- Ramas "None" / texto libre sin acción
- Notificaciones internas faltantes
- Pipeline sin estados completos

### Mejoras de optimización
- Timings mejorables
- CTAs faltantes en mensajes de renovación/upsell
- Métricas y tracking que faltan
- Experiencia de usuario mejorable

### Problemas transversales
- Regla 24h Meta — qué mensajes necesitan template aprobado
- Opt-out y GDPR
- Nomenclatura de tags (inconsistencias)
- Dependencias entre workflows que pueden fallar en cadena
- Fallbacks si WhatsApp falla

---

## FASE 3 — Generar HTML de auditoría

Genera un archivo HTML completo con:

- **Header** con nombre del proyecto, fecha, y badges de resumen (críticos / importantes / mejoras / workflows analizados)
- **Resumen ejecutivo** con contadores visuales y los problemas críticos destacados en banners
- **Sección de conflictos** entre workflows (si los hay)
- **Una sección por cada workflow/bot** con:
  - Diagrama de flujo del estado actual (con marcas visuales de dónde están los problemas)
  - Lista de problemas encontrados codificados por color (rojo crítico / naranja importante / verde mejora)
  - Para cada problema: ID, título, descripción del impacto, acción concreta a tomar
- **Sección de problemas transversales**
- **Tabla de plan de acción priorizado** con: ID, prioridad, problema, workflow afectado, acción concreta

**Estilo visual:**
- Fondo oscuro (#0f1117), tipografía limpia
- Códigos de color consistentes: rojo (#fc8181) crítico, naranja (#f6ad55) importante, verde (#68d391) mejora
- Tarjetas por workflow con diagrama de flujo simplificado
- Responsive

Guarda el HTML en `C:\Users\Redas\Documents\omnexor\GHL\auditoria-ghl-omnexor.html`

---

## Contexto de Omnexor que ya tienes

- Es una agencia de automatización con IA
- Bots propios: **Alex** (bienvenida), **Luna** (cualificación), **Anna** (reagendado)
- Campo de estado bot: `luna_step` (Single Line en GHL)
- Usa Flow Builder V3 + Conversation AI
- Stack: GHL + n8n + WhatsApp Business

## Reglas críticas de GHL que ya conoces

- **Switch node en n8n**: NUNCA usar — los outputs no se renderizan. Siempre If chain en cascada
- **bot_completado**: tag obligatorio en TODAS las ramas terminales de cada bot
- **Stop Bot**: siempre como primera acción antes de Book Appointment o acciones de cita
- **Update Opportunity**: no puede correr dentro del Flow Builder — usar tag como puente
- **Go To + AI Capture**: limpiar campo antes del Go To o usar campo diferente
- **Context Drift**: añadir "Haz SOLO esta pregunta. No inferas ni asumas la respuesta."
- **Loop infinito**: usar tags secuenciales (loop_1, loop_2, loop_3) como contador
- **Mensajes >24h**: siempre templates Meta aprobados

---

Empieza pidiéndome que te pase las capturas de los workflows y bots de Omnexor.
