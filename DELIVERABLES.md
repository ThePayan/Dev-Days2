# Lista de Entregables

| ID | Categoría | Descripción | Estado |
| :--- | :--- | :--- | :---: |
| **ENTREGABLE NIVEL 0** | | | |
| **N0-1** | Node | Proyecto base realizado en clase (con modificaciones propuestas terminadas). | [x] |
| **ENTREGABLES DE NIVEL 1** | | | |
| **N1-1** | Recursividad | Función recursiva: Paginación de datos de la API de GitHub. | [x] |
| **N1-2** | Telemetría | Creación de métricas personalizadas (Histograma de tiempo de respuesta). | [ ] |
| **N1-3** | IA | Integración de proveedores IA (OpenAI vs Ollama). | [x] |
| **N1-4** | Frontend | Visualización y frontend sobre datos de auditoría. | [ ] |
| **ENTREGABLES DE NIVEL 2** | | | |
| **PROPUESTA 1** | | | |
| **N2-P1-A** | Telemetría | Instrumenta una app y expón telemetría. | [ ] |
| **N2-P1-B** | Auditoría | Auditoría sobre Acuerdos de Nivel de Servicios (ANS/SLA). | [ ] |
| **N2-P1-C** | IA | Chatbot para interpretar métricas de telemetría. | [ ] |
| **PROPUESTA 2** | | | |
| **N2-P2-A** | Auditoría | Auditoría sobre datos meteorológicos (OpenMeteo endpoint). | [x] |
| **N2-P2-B** | IA | Audio resumen del tiempo pasado con IA. | [x] |
| **N2-P2-C** | Telemetría | Instrumenta y mide el tiempo de respuesta de la API de Weather. | [x] |
| **NIVEL 2 - RETOS ADICIONALES** | | | |
| **N2-EX-1** | IA | Hacer que la IA devuelva una respuesta estructurada en formato JSON. | [ ] |
| **N2-EX-2** | Telemetría | Exporta métricas y trazas a Prometheus y Jaeger (Hecho Prometheus). | [x] |
| **N2-EX-3** | Frontend | Visualización y frontend sobre datos de auditoría. (Depende de N2-P1-B y/o N2-P2-A). | [ ] |
| **N2-EX-4** | Libre | Cualquier reto que explore LLMs, auditoría, telemetría o aumentar entregables. | [ ] |

## RETO 0: Proyecto inicial + modificaciones

### TEMA 1
**1. Añadir funcionalidad de Update:**
*   **Servicio:** Exportamos la función `updateUser`. Buscamos el usuario por ID y, si existe, actualizamos sus campos desestructurando la información recibida.
*   **Controlador:** Creamos `updateUser`, extraemos el ID y el body. Llamamos al servicio: si devuelve valor retornamos 200, si no, 404.
*   **Router:** Registramos la ruta correspondiente.

**2. Restricción en Middleware:**
*   Añadimos `.isLength({ min: 3, max: 50 })` a la validación.
*   Modificamos el mensaje de error para mayor claridad.

### TEMA 2
**1. Campo `updatedAt`:**
*   **Modelo:** Añadimos la propiedad `updatedAt` (camelCase).
*   **Servicio:** Aseguramos que se guarde esta propiedad en `saveIssues`.

### N1-1: Recursividad
**1. Configuración de Headers (`githubHeaders`):**
Configuramos `Accept` para la versión JSON recomendada, `User-Agent` para evitar rechazos de GitHub, y `Authorization` opcional con token para aumentar el límite de peticiones (recomendado si se prueban grandes repositorios).

**2. Función Recursiva (`fetchGithubPaginated`):**
    Mantiene una implementación recursiva no final.
*   **Parámetros:** Recibe URL y parámetros de paginación (`page`, `per_page`, `state`).
*   **Lógica:**
    1.  Realiza la petición con `axios` a la URL construida (ej: `.../issues?page=2&per_page=100`).
    2.  Verifica si la respuesta está llena (`length === perPage`).
    3.  **Caso Recursivo:** Si está llena, llama a sí misma para la página siguiente (`page + 1`) y concatena los resultados.
    4.  **Caso Base:** Si no está llena, devuelve los datos actuales, terminando la recursión.

**3. Integración en Controlador `fetchGithubIssuesPaginated`:**
*   Extrae `owner` y `repo` del body.
*   Llama al servicio recursivo.
*   Guarda los issues obtenidos en base de datos.
*   Retorna 200 OK con los issues guardados.

### N1-3: IA (Integración de Proveedores)
**1. Aplicación del Patrón Factory (`ai.choose.js`):**
Implementamos un "selector" que decide qué servicio usar en tiempo de ejecución.
*   Lee la variable de entorno `AI_PROVIDER`.
*   Retorna el módulo completo (`ollamaService` o `openaiService`) según la configuración.

**2. Servicios Intercambiables:**
Ambos servicios (`openai.service.js` y `ollama.service.js`) implementan la misma interfaz implícita (ej: `generateText`), permitiendo que el controlador los use indistintamente.

**3. Configuración (`.env`):**
*   `AI_PROVIDER=openai`: Usa la API de OpenAI (requiere key).
*   `AI_PROVIDER=ollama`: Usa una instancia local de Ollama (ej: modelo Llama 3).

### N2-P2-A: Auditoría Clima (OpenMeteo)
**1. Obtención de Datos (`weather.service.js`):**
*   **Geocodificación:** `getCoordinates(city)` obtiene latitud/longitud usando OpenMeteo Geocoding API.
*   **Histórico:** `getWeeklyWeather` consulta la API de Archivo de OpenMeteo para obtener la temperatura media diaria (`temperature_2m_mean`) de los últimos 7 días.

**2. Lógica de Auditoría (`audit.services.js`):**
*   `auditWeather` orquesta el proceso.
*   Divide los datos en semanas (chunks de 7 días).
*   Calcula la media de temperatura de cada semana.
*   **Verificación:** Compara si `media > umbral` (compliant).
*   **Persistencia:** Guarda un registro en MongoDB.

### N2-P2-B: Audio Resumen con IA
**1. Generación de Resumen (`openai.service.js`):**
*   `generateWeatherSummary`: Recibe los datos del clima JSON y usa `gpt-4o-mini` para redactar un resumen en texto natural, enfocado en tendencias.

**2. Conversión a Audio (TTS):**
*   `generateAudio`: Usa el endpoint `audio/speech` de OpenAI (modelo `tts-1`, voz `alloy`) para convertir el texto a un buffer MP3.

**3. Endpoint de Streaming (`ai.controller.js`):**
*   `getWeatherAudioSummary`: Orquesta la llamada y devuelve el buffer directamente con header `Content-Type: audio/mp3`, permitiendo reproducción inmediata.

### N2-P2-C: Telemetría (Prometheus)
**1. Instrumentación (`response-time.middleware.js`):**
*   Middleware que intercepta todas las peticiones.
*   Cronometra el tiempo con `process.hrtime` desde el inicio hasta el evento `finish` de la respuesta.
*   Registra la duración en un Histograma de OpenTelemetry (`http_request_duration_seconds`).

**2. Etiquetas (Labels):**
Para permitir un filtrado en Grafana, añadimos:
*   `route`: La URL invocada (ej: `/api/v1/ai/weather-summary`).
*   `method`: POST, GET, etc.
*   `status_code`: 200, 500, etc.

**3. Exposición (`otel.js`):**
*   Configuramos `PrometheusExporter` en el puerto 9464 para que Prometheus pueda hacer "scrape" de las métricas.




