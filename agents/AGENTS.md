# AGENTS.md — Directrices por IA

Archivo central de configuración para todas las IAs utilizadas en Omnexor.

---

## Archivos de contexto Omnexor (cargar al inicio de cada sesión)

Cuando trabajes con temas de Omnexor, GHL, bots (Alex, Luna, Anna), carga siempre estos archivos primero:

1. `C:\Users\Redas\agents\CLAUDE.md` — Contexto completo de Omnexor (bots, tiers, reglas GHL, bugs conocidos)
2. `C:\Users\Redas\.claude\agents\omnexor-ghl-agent.md` — Configuración del agente GHL
3. `C:\Users\Redas\.claude\agent-memory\omnexor-ghl-agent\MEMORY.md` — Memoria persistente del agente
4. `C:\Users\Redas\.claude\agent-memory\omnexor-ghl-agent\session_history.md` — Historial de conversación de la sesión actual

---

## Claude Code (Anthropic)

**Archivo de contexto:** `C:\Users\Redas\agents\CLAUDE.md` / `C:\Users\Redas\Documents\omnexor\CLAUDE.md`

### Directrices
- Responder siempre en **español casual**
- Usar el agente especializado `omnexor-ghl-agent` para todo lo relacionado con GHL, bots y workflows
- No hacer commits automáticos — confirmar siempre antes
- No crear archivos innecesarios; editar los existentes
- Cargar memoria persistente del agente al inicio de cada sesión GHL
- Respuestas cortas y directas; sin preambles ni relleno

### Especialización
- GHL Flow Builder V3, workflows, bots, WhatsApp templates
- n8n workflows y automatizaciones
- Proyectos: Omnexor (bots propios) + Tecnocasa (Inma)

---

## ChatGPT / OpenAI (Codex, GPT-4o)

**Archivo de contexto:** `C:\Users\Redas\agents\AGENTS.md` (este archivo)

### Directrices
- Leer siempre `C:\Users\Redas\agents\CLAUDE.md` para contexto Omnexor
- Responder en **español casual**
- No inventar endpoints o campos de GHL que no estén documentados
- Para copy de bots: tono cercano, conversacional, sin frases condescendientes
- No usar dropdown en custom fields — siempre Single Line

### Especialización
- Copy y redacción de mensajes para bots WhatsApp
- Revisión de prompts para AI Capture / AI Splitter
- Brainstorming de flujos y estructuras

---

## Gemini (Google)

**Archivo de contexto:** `C:\Users\Redas\agents\AGENTS.md` (este archivo)

### Directrices
- Leer siempre `C:\Users\Redas\agents\CLAUDE.md` para contexto Omnexor
- Responder en **español casual**
- Tener en cuenta los bugs conocidos de GHL antes de proponer soluciones
- No asumir que GHL funciona como plataformas genéricas — tiene limitaciones específicas documentadas

### Especialización
- Investigación y análisis de plataformas (GHL, n8n, MoltClaw)
- Comparativas y evaluación de herramientas
- Documentación y resúmenes

---

## Opencode (Mimo v2)

**Archivo de contexto:** `C:\Users\Redas\agents\AGENTS.md` (este archivo)

### Directrices
- Leer siempre los archivos de contexto de Omnexor antes de responder
- Responder en **español casual** y conciso
- Cargar memoria persistente del agente omnexor-ghl-agent al inicio de sesión
- Usar task_id para mantener contexto al cambiar de subagente

### Especialización
- Configuración de agentes y contexto entre sesiones
- Lectura de archivos de configuración de proyectos
- Manejo de historial de conversación para transferencia entre agentes

---

## Cursor AI

**Archivo de contexto:** `.cursorrules` en cada proyecto (si existe)

### Directrices
- Para proyectos Omnexor, seguir las mismas reglas que Claude Code
- No modificar workflows de n8n directamente — usar n8n MCP
- Respetar la estructura de archivos existente

---

## Estado de la sesión

<!-- Actualizar al inicio de cada sesión de trabajo -->

### Sesión actual
- Fecha:
- IA activa:
- Tarea principal: