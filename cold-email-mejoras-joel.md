# Cold Email Clínicas Dentales — Mejoras propuestas
**Para:** Joel
**De:** Redas
**Fecha:** 2026-03-25

---

## El problema

La secuencia actual tiene 3 steps y no está generando respuestas. Tras revisar el copy, estos son los motivos:

| # | Problema | Dónde |
|---|---------|-------|
| 1 | Email 1 demasiado largo — 3 preguntas de golpe | Step 1 |
| 2 | Hook genérico — no demuestra que sabemos algo de ellos | Step 1 |
| 3 | Táctica "curiosidad → pitch en follow-up" está quemada en 2026 | Step 1 → 2 |
| 4 | "Prometo que este es mi último mensaje" — la frase más usada del cold email | Step 3 |
| 5 | Pedimos llamada demasiado pronto (Step 2, segundo contacto) | Step 2 |
| 6 | Sin prueba social con número real | Toda la secuencia |

---

## Propuesta: secuencia nueva (4 steps)

**Principios aplicados:** emails cortos (60–80 palabras), una sola pregunta por email, CTA progresivo (sí/no primero → luego llamada), personalización real con ciudad, números concretos.

---

### STEP 1 — Día 0

**Asunto A:** `pregunta rápida, {{firstName}}`
**Asunto B:** `las citas perdidas de {{companyName}}`
**Asunto C:** `{{companyName}} — una cosa que vi`

> Hola {{firstName}},
>
> Trabajo con clínicas dentales en España automatizando la recuperación de pacientes que no se presentan.
>
> Una clínica en {{city}} recuperó 14 huecos muertos el primer mes — sin que recepción tuviera que llamar a nadie.
>
> ¿Es la gestión de no-shows algo que estáis mirando ahora mismo en {{companyName}}, o ya lo tenéis resuelto?
>
> {{senderName}}

**Por qué funciona:** personalización real (ciudad), número específico (14 huecos), pregunta fácil de responder sí/no, sin presión ni pitch.

---

### STEP 2 — Día 3 *(reply thread)*

**Asunto:** `re: pregunta rápida, {{firstName}}`

> {{firstName}}, por si se perdió entre los demás correos.
>
> Para darte contexto: montamos un sistema que manda recordatorios por WhatsApp y reagenda automáticamente cuando el paciente no confirma. Sin apps nuevas, sin cambiar vuestro sistema actual.
>
> En clínicas con 8–15 citas al día, el ahorro medio es de 2.200€/mes en huecos recuperados.
>
> Si tiene sentido para {{companyName}}, ¿te parece bien que te mande un resumen de cómo funciona? (un PDF de 2 páginas, sin llamada)
>
> {{senderName}}

**Por qué funciona:** CTA de baja fricción (pide un PDF, no una llamada), número concreto, no impone.

---

### STEP 3 — Día 7 *(ángulo nuevo)*

**Asunto A:** `el coste oculto de {{companyName}}`
**Asunto B:** `¿cuánto tiempo pierde recepción al día en esto?`

> {{firstName}},
>
> Dato que solemos ver en clínicas antes de trabajar con ellas:
>
> Recepción dedica entre 45 min y 1h30 al día a confirmar citas, perseguir no-shows y reasignar huecos a mano.
>
> Eso son 30+ horas al mes de una persona haciendo trabajo que se puede automatizar al 90%.
>
> ¿Eso os suena a {{companyName}} o ya lo tenéis optimizado?
>
> {{senderName}}

**Por qué funciona:** ángulo diferente al Step 1 (tiempo del equipo, no dinero), dato concreto, nueva pregunta sí/no.

---

### STEP 4 — Día 12 *(breakup con valor)*

**Asunto A:** `último mensaje, {{firstName}}`
**Asunto B:** `te dejo esto por si acaso`

> {{firstName}},
>
> No voy a insistir más — entiendo que el timing no siempre es el correcto.
>
> Te dejo esto por si te es útil: hemos documentado los 5 errores más comunes en la gestión de citas en clínicas dentales. Sin pitch, solo el documento.
>
> ¿Lo quieres?
>
> Y si en algún momento el tema vuelve a estar sobre la mesa, aquí estaré.
>
> {{senderName}}

**Por qué funciona:** no mendiga, aporta valor, deja la puerta abierta con dignidad.

---

## Configuración Instantly recomendada

| Parámetro | Actual | Propuesto |
|-----------|--------|-----------|
| Step 1 → 2 | 3 días | 3 días |
| Step 2 → 3 | 1 día | 4 días |
| Step 3 → 4 | — | 5 días |
| Hora envío | — | 9:00–10:30h (martes-jueves) |
| Stop on reply | — | ✅ Activado |
| Emails/día por dominio | — | Máx. 40 |

---

## Resultado esperado

| Métrica | Secuencia actual | Objetivo |
|---------|-----------------|---------|
| Reply rate | ~0–1% | 3–6% |
| Interesados reales | ~0% | 1–3% |