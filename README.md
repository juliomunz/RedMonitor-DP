# RED Monitor — Prototipo MVP

**Supervisión inteligente del transporte público RED de Santiago**
Proyecto final · Diseño y Prototipado — Ciencia de Datos e IA · Grupo 2

Un agente que recibe reportes ciudadanos, los **clasifica automáticamente con IA**, detecta **patrones recurrentes** y genera **alertas operacionales** priorizadas para los operadores del sistema RED.

---

## ¿Qué implementa? (las 3 características priorizadas + dashboard)

| # | Característica (epopeya) | Pantalla | Criterio de aceptación verificable |
|---|---|---|---|
| 1 | Captura de reportes ciudadanos | Reportar incidente | Reporte en **≤ 3 clics** (contador visible en pantalla) |
| 2 | Clasificación automática con IA | Clasificación con IA | Categoría + prioridad + confianza en **< 5 s** |
| 3 | Generación de alertas operacionales | Alertas | Alerta automática **< 5 s**; detección de patrones recurrentes |
| 4 | Dashboard (MVP simplificado) | Panel operacional | KPIs, historial y distribución por tipo |

---

## Cómo se usa

1. Abre la app.
2. Pulsa **"Conectar IA"** (arriba a la derecha):
   - **IA real:** pega tu API key de Anthropic (`sk-ant-...`). La clave se usa solo desde tu navegador, no se envía a ningún servidor propio ni se guarda.
   - **Modo demostración:** clasifica con reglas locales, sin conexión ni clave. Ideal para evaluar el flujo completo sin configurar nada.
3. Completa un reporte (tipo + recorrido), envía, y observa la clasificación, las alertas y el panel.

> **Nota de seguridad.** No se incrusta ninguna API key en el código (eso la expondría públicamente en un sitio estático). Por eso la clave se ingresa en la interfaz, igual que en el ejemplo visto en clases.

---

## Archivos

```
red-monitor/
├── index.html      ← interfaz (4 pantallas)
├── app.js          ← lógica: clasificación IA, patrones, alertas, dashboard, validación GTFS
├── gtfs_freq.js    ← datos GTFS: frecuencias, calendario y funciones de consulta (cargar antes de app.js)
├── vercel.json     ← configuración de despliegue
└── README.md
```

> **Orden de carga obligatorio en `index.html`:**
> ```html
> <script src="gtfs_freq.js"></script>
> <script src="app.js"></script>
> ```

---

## Integración con datos GTFS reales

A partir de la versión actual el prototipo incorpora datos oficiales del **GTFS V165.20260530** publicado por el DTPM (Departamento de Transporte Público Metropolitano), válidos hasta el 31 de diciembre de 2026.

### Fuente de datos

Los archivos fueron descargados directamente desde [dtpm.cl/gtfs-vigente](https://www.dtpm.cl/index.php/noticias/gtfs-vigente) y procesados para generar dos estructuras embebidas en el frontend:

| Archivo fuente | Datos extraídos | Destino |
|---|---|---|
| `routes.txt` | 417 recorridos RED (agency_id = RM) con nombre origen–destino | `app.js` → `GTFS_ROUTES` |
| `frequencies.txt` | 11.064 franjas horarias con headway en segundos (L/S/D) | `gtfs_freq.js` → `GTFS_FREQ` |
| `calendar.txt` | Servicios L (lun–vie), S (sáb), D (dom) | `gtfs_freq.js` → lógica de `getTodayService()` |
| `calendar_dates.txt` | 9 fechas festivas con excepciones de servicio | `gtfs_freq.js` → `GTFS_CAL_EX` |

### Funcionalidades habilitadas por el GTFS

**Validación de recorridos en tiempo real**

Al escribir el número de recorrido en el formulario, el sistema verifica contra los 417 recorridos reales de RED:

- `✓ G01 · La Vara - Santo Tomas` si el recorrido existe
- `⚠ No encontrado. ¿Quisiste decir: G01C?` con sugerencias clickeables si hay variantes cercanas
- `✗ "G999" no existe en RED` si no hay coincidencia alguna

El envío del reporte queda bloqueado si el recorrido no existe en el GTFS. Si existe pero no opera hoy, se muestra una advertencia sin bloquear.

**Nombre automático del recorrido**

El panel de clasificación muestra el nombre completo sacado del GTFS, por ejemplo `G01 · La Vara - Santo Tomas`, en lugar de solo el código.

**Día de servicio correcto**

La app detecta automáticamente si hoy es día hábil (L), sábado (S) o domingo (D), y aplica las excepciones de festivos definidas en `calendar_dates.txt`. Los festivos 2026 cubiertos son: 29 jun, 16 jul, 15 ago, 18–19 sep, 12 oct, 31 oct, 8 dic, 25 dic.

**Frecuencia esperada vs. retraso real**

En el momento exacto del reporte, el sistema consulta la franja horaria activa del recorrido y extrae el headway programado. Esta información se usa en dos lugares:

- En el **veredicto** del panel de clasificación: `frecuencia programada cada 10 min (06:30–08:00)`
- En el **prompt enviado a Claude**, enriqueciendo el contexto para que la IA pueda razonar sobre la gravedad real del retraso:

```
- Tipo de día: Día hábil
- Frecuencia programada AHORA: cada 10 min (franja 06:30–08:00, Día hábil)
```

Con ese contexto, el modelo puede concluir "el headway es 10 min y el usuario reporta retraso → prioridad Alta" en vez de inferirlo solo desde el texto libre del comentario.

**Reintentos automáticos ante sobrecarga de API**

Si la API de Anthropic devuelve error `529 (overloaded)`, el sistema reintenta automáticamente hasta 3 veces con espera escalonada (1,5 s → 3 s → 4,5 s). Durante cada reintento el panel muestra `"Servidor ocupado, reintentando (1/3)…"`.

### Funciones públicas de gtfs_freq.js

| Función | Descripción |
|---|---|
| `getTodayService()` | Retorna `{ serviceId: 'L'/'S'/'D', label: string }` según el día actual y festivos |
| `getCurrentFrequency(routeId)` | Retorna la franja horaria activa y el headway en minutos para un recorrido ahora mismo |
| `assessDelay(routeId)` | Evalúa la severidad del retraso (`Alta / Media / Baja`) según el headway programado |

---

## Herramientas del curso aplicadas

- **5W+H y Golden Circle** → definen el porqué/cómo/qué del prototipo.
- **RIP → SHELTER** → cada riesgo se convierte en una característica del MVP.
- **Casa de la Calidad (QFD)** → prioriza las características por contribución al usuario.
- **Backlog priorizado** → solo se implementan las 3 primeras características.
- **POWER / validación** → las observaciones (confianza del modelo, contexto de alertas, frecuencia real) están reflejadas en la UI.