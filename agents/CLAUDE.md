# CLAUDE.md — Proyecto Clínicas Dentales Barcelona

## Contexto del proyecto

Proyecto de outreach a clínicas dentales en Barcelona y provincia para ofrecer los servicios de Omnexor (automatización con IA, GHL, WhatsApp bots). El objetivo es conseguir demos/reuniones con clínicas interesadas en captación de pacientes.

---

## Archivos del proyecto

| Archivo | Contenido |
|---------|-----------|
| `clinicas_bcn_limpio.xlsx` | **RESULTADO FINAL** — 203 con email, 86 sin email. Nombres limpios, todos los emails válidos por clínica |
| `clinicas_bcn_sin_email.xlsx` | 86 clínicas sin email (para segundo intento de scraping) |
| `clinicas_bcn_instantly.csv` | 259 filas para Instantly — columna `email`, un email por fila, nombres limpios |
| `clinicas_bcn_sin_tocar.csv` | 128 clínicas aún sin scrappear |
| `clinicas_dentales_tarragona.csv` | 19 clínicas Tarragona (Google Maps) |
| `sitios hechos.txt` | Output raw del scraping (311 entradas procesadas) |

---

## Herramientas de scraping usadas

- **Google Maps (Apify)** — `compass/crawler-google-places` — extrae nombre, dirección, teléfono, web, valoración, reviews
- **Script Python con Crawlbase** — crawlea webs de las clínicas para extraer emails → output en `sitios hechos.txt`
- **Instantly** — plataforma de email outreach

---

## Reglas de limpieza de datos

### Emails a filtrar (no válidos para outreach)
- `rgpd@`, `dpd@`, `dpo@` — emails de protección de datos (GDPR)
- `noreply@`, `no-reply@`, `postmaster@`, `bounce@`, `donotreply@` — técnicos
- Emails con `.png`, `.jpg`, `.gif` — falsos positivos del scraper
- `name@name.com` — placeholder de formulario
- Dominios `sentry.wixpress.com`, `sentry-next.wixpress.com` — monitoreo de errores Wix
- Hashes UUID como parte local (32+ caracteres hex)
- Cadenas de franquicias (Vitaldent, Sanitas, Adeslas, Bucalia)

### Emails a MANTENER
- `admin@`, `webmaster@` — en clínicas pequeñas puede ser el contacto principal
- `info@` — válido
- Gmail/Hotmail personales — muchas clínicas pequeñas los usan

### Todos los emails por clínica
- No quedarse con uno solo — guardar todos los válidos separados por ` | `
- Para Instantly: un email por fila, duplicar el resto de datos

### Limpieza de nombres de empresa
- Quitar sufijos ` - Barcelona`, `, Barcelona`, ` en Barcelona` cuando son descriptivos
- Quitar ` * Dentista en Barcelona`, `: Dentistas en Barcelona`
- Mantener barrios que son parte de la marca (Sarrià, Guinardó, Sant Andreu, etc.)
- Quitar todo lo que va después de `|` o `•`

### Formato CSV para Instantly
- Columna `email` (minúsculas, singular)
- Columnas: `email`, `company`, `phone`, `address`, `website`, `rating`, `reviews`
- Un email por fila — si hay varios, generar una fila por cada uno con los mismos datos
- Solo CSV con encoding UTF-8 BOM — NO xlsx

---

## Flujo de trabajo scraping

1. **Apify Google Maps** → dataset CSV con nombre, web, teléfono, dirección, rating
2. **Script Python Crawlbase** → crawlea cada web → output en `sitios hechos.txt`
3. **Cruce de datos** → juntar emails del txt con datos de Google Maps
4. **Limpieza** → filtrar emails malos, limpiar nombres
5. **Excel final** → `clinicas_bcn_limpio.xlsx` pestañas Con Email / Sin Email
6. **CSV Instantly** → `clinicas_bcn_instantly.csv`

### Para continuar el scraping
- Usar `clinicas_bcn_sin_tocar.csv` como input
- Error 401 → API key de Crawlbase caducada, renovarla
- CSV para notebooks Python: NUNCA añadir filas separadoras — rompen pandas. Usar columna `Estado`

---

## Notas técnicas Python

- Guardar CSV con `encoding='utf-8-sig'` para compatibilidad con Excel
- `openpyxl` para generar Excel con formato (`pip install openpyxl`)
- Separador emails múltiples: ` | ` (espacio-pipe-espacio)

---

## Workflows n8n — Reglas aprendidas

### CRÍTICO: Switch node
**NUNCA usar Switch** — los outputs no se renderizan en n8n. Siempre usar **If chain en cascada**.

### Versiones correctas de nodos
- HTTP Request: `typeVersion: 4.4`
- If node: `typeVersion: 2.3` + `conditions.options.version: 2`
- Code node: `typeVersion: 2`
- Webhook: `typeVersion: 2.1`, `responseMode: "onReceived"`

### Expresiones n8n
- **No usar optional chaining** (`?.`) — no soportado. Usar `(array.find(f => f.key === 'x') || {}).value || ''`
- En nodos mensaje, si el input viene de HTTP response → referenciar nodo anterior: `$('Nombre Nodo').item.json.field`
- Code node para extracción compleja de datos de contacto GHL (más fiable que Set node)

### Patrón estándar bots WhatsApp GHL
```
Webhook → Set (vars) → HTTP Get Contact → Code (extraer fields) → If (filtro tags) → If chain (estado) → HTTP Update → HTTP Send Message
```

---

## Reglas GHL Flow Builder V3

### Reglas críticas
- Custom fields siempre **Single Line** (nunca dropdown — AI Capture no los lee)
- Filtros en workflows con múltiples tiers en **OR** (GHL pone AND por defecto)
- **Stop Bot** siempre como primera acción en workflows de citas
- **Update Opportunity** no puede correr dentro del Flow Builder — usar tag como puente
- Tag `bot_completado` al final de cada bot — aplicar en TODAS las ramas terminales
- Wait nodes de 24h: el primer mensaje después SIEMPRE debe ser template Meta aprobado
- **Transfer Bot** tarda 30-60s — gestionar expectativa con mensaje previo
- **Go To + AI Capture**: limpiar campo antes del Go To o usar campo diferente

### Bugs conocidos GHL
- **Context Drift**: AI Capture infiere del historial. Fix: "Haz SOLO esta pregunta. No inferas ni asumas la respuesta."
- **AI Splitter fallback con respuestas válidas**: incluir ejemplos de frases en el prompt
- **Loop infinito**: usar tags secuenciales (`loop_1`, `loop_2`, `loop_3`) como contador
- **Doble booking**: pedir al usuario que responda en un solo mensaje

---

## Tono y estilo

- Comunicación en **español casual**
- Público: propietarios/directores de clínica dental, no grandes corporaciones
- Ángulo de valor: "captar más pacientes con automatización IA + WhatsApp"