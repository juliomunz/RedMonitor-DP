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
├── index.html     ← interfaz (4 pantallas)
├── app.js         ← lógica: clasificación IA, patrones, alertas, dashboard
├── vercel.json    ← configuración de despliegue
└── README.md
```

---

## Herramientas del curso aplicadas

- **5W+H y Golden Circle** → definen el porqué/cómo/qué del prototipo.
- **RIP → SHELTER** → cada riesgo se convierte en una característica del MVP.
- **Casa de la Calidad (QFD)** → prioriza las características por contribución al usuario.
- **Backlog priorizado** → solo se implementan las 3 primeras características.
- **POWER / validación** → las observaciones (confianza del modelo, contexto de alertas) están reflejadas en la UI.
