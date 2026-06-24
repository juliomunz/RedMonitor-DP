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
├── index.html       ← interfaz (4 pantallas)
├── app.js           ← lógica: clasificación IA, patrones, alertas, dashboard, validación GTFS
├── gtfs_freq.js     ← datos GTFS: frecuencias, calendario y funciones de consulta
├── gtfs_stops.js    ← datos GTFS: 12.096 paraderos con coordenadas GPS, búsqueda y geolocalización
├── vercel.json      ← configuración de despliegue
└── README.md
```

> **Orden de carga obligatorio en `index.html`:**
> ```html
> <script src="gtfs_freq.js"></script>
> <script src="gtfs_stops.js"></script>
> <script src="app.js"></script>
> ```

---

## Integración con datos GTFS reales

A partir de la versión actual el prototipo incorpora datos oficiales del **GTFS V165.20260530** publicado por el DTPM (Departamento de Transporte Público Metropolitano), válidos hasta el 31 de diciembre de 2026.

Documentación de referencia sobre la estructura GTFS y las relaciones entre tablas: [dtpm.cl/matrices-de-viaje](https://www.dtpm.cl/index.php/documentos/matrices-de-viaje).

### Fuente de datos

Los archivos fueron descargados directamente desde [dtpm.cl/gtfs-vigente](https://www.dtpm.cl/index.php/noticias/gtfs-vigente) y procesados para generar tres estructuras embebidas en el frontend:

| Archivo fuente | Datos extraídos | Destino |
|---|---|---|
| `routes.txt` | 417 recorridos RED (agency_id = RM) con nombre origen–destino | `app.js` → `GTFS_ROUTES` |
| `frequencies.txt` | 11.064 franjas horarias con headway en segundos (L/S/D) | `gtfs_freq.js` → `GTFS_FREQ` |
| `calendar.txt` | Servicios L (lun–vie), S (sáb), D (dom) | `gtfs_freq.js` → lógica de `getTodayService()` |
| `calendar_dates.txt` | 9 fechas festivas con excepciones de servicio | `gtfs_freq.js` → `GTFS_CAL_EX` |
| `trips.txt` | 717 pares ruta–dirección (ida/retorno) con trip_id y shape_id | `gtfs_stops.js` (join intermedio) |
| `stop_times.txt` | 1.096.386 tiempos de paso, filtrados a secuencia por trip representativo | `gtfs_stops.js` (join intermedio) |
| `stops.txt` | 12.096 paraderos con coordenadas GPS y nombre comercial | `gtfs_stops.js` → `GTFS_STOPS` |

### Cadena de joins GTFS

Los paraderos se resuelven siguiendo la cadena relacional estándar del GTFS:

```
routes.txt (route_id)
    → trips.txt (trip_id, direction_id, shape_id)
        → stop_times.txt (stop_id, stop_sequence)
            → stops.txt (stop_name, stop_lat, stop_lon)
```

Cada recorrido tiene dos sentidos (ida `I` y retorno `R`), cada uno con su secuencia ordenada de paraderos. Por ejemplo, el recorrido G01 tiene 55 paradas en ida (de *Camino La Vara* a *María Elena / esq. Miguel Mujica*) y 60 paradas en retorno.

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

**Identificación de paradero con geolocalización**

Cuando el ciudadano selecciona un recorrido válido, aparece un selector de paraderos con dos formas de uso:

- **Selección manual:** un dropdown muestra todas las paradas del recorrido en orden secuencial, separadas por sentido (ida/retorno). El usuario puede elegir en cuál está esperando.
- **Geolocalización automática (📍 Ubicarme):** el navegador solicita acceso GPS al dispositivo y busca la parada más cercana del recorrido seleccionado usando cálculo Haversine. También muestra las paradas alternativas dentro de 500 metros para que el usuario pueda corregir si la detección no es exacta.

El paradero seleccionado se incluye en el veredicto (`paradero Parada 5 / (M) Santa Rosa (PG95)`) y en el prompt de la IA:

```
- Paradero: Parada 5 / (M) Santa Rosa (PG95, coords: -33.542982, -70.634139)
```

Esto permite que el modelo identifique el punto exacto del incidente y genere acciones más precisas.

**Reintentos automáticos ante sobrecarga de API**

Si la API de Anthropic devuelve error `529 (overloaded)`, el sistema reintenta automáticamente hasta 3 veces con espera escalonada (1,5 s → 3 s → 4,5 s). Durante cada reintento el panel muestra `"Servidor ocupado, reintentando (1/3)…"`.

### Funciones públicas de gtfs_freq.js

| Función | Descripción |
|---|---|
| `getTodayService()` | Retorna `{ serviceId: 'L'/'S'/'D', label: string }` según el día actual y festivos |
| `getCurrentFrequency(routeId)` | Retorna la franja horaria activa y el headway en minutos para un recorrido ahora mismo |
| `assessDelay(routeId)` | Evalúa la severidad del retraso (`Alta / Media / Baja`) según el headway programado |

### Funciones públicas de gtfs_stops.js

| Función | Descripción |
|---|---|
| `getRouteDirections(routeId)` | Retorna sentidos disponibles (ida/retorno) con origen, destino y cantidad de paradas |
| `getRouteStops(routeId, direction)` | Lista ordenada de paradas `[lat, lon, nombre, stop_id]`. `direction`: `'I'`, `'R'` o ambos |
| `findNearestStop(routeId, lat, lon, dir)` | Parada más cercana a las coordenadas GPS dadas (Haversine) |
| `findNearbyStops(routeId, lat, lon, radio, dir)` | Todas las paradas dentro de un radio en metros (máx. 5 resultados) |
| `hasRouteStops(routeId)` | Verifica si hay datos de paradas disponibles para un recorrido |

---

## Herramientas del curso aplicadas

- **5W+H y Golden Circle** → definen el porqué/cómo/qué del prototipo.
- **RIP → SHELTER** → cada riesgo se convierte en una característica del MVP.
- **Casa de la Calidad (QFD)** → prioriza las características por contribución al usuario.
- **Backlog priorizado** → solo se implementan las 3 primeras características.
- **POWER / validación** → las observaciones (confianza del modelo, contexto de alertas, frecuencia real) están reflejadas en la UI.