# Guía de Ejecución - ISA DevDays 2025

Esta guía detalla cómo ejecutar y verificar cada uno de los entregables del proyecto.

## Requisitos Previos
1.  **Node.js** (v20 o superior).
2.  **Docker Desktop** (para MongoDB, Prometheus y Grafana).
3.  **Postman** (Colección `Dev-Days25` importada).
4.  Archivo `.env` configurado con:
    *   `MONGO_URI`
    *   `OPENAI_API_KEY`
    *   `AI_PROVIDER` (opcional: `openai` u `ollama`)

## 1. Paginación de Github (Recursividad)
**Objetivo:** Obtener issues de un repositorio de GitHub paginados de forma recursiva.

*   **Endpoint:** `POST /api/v1/issues/fetch-paginated`
*   **Prueba en Postman:** "FetchIssuesPaginated" (Carpeta N1 del postman).
*   **Body JSON:**
    ```json
    {
        "repository": {
            "owner": "glzr-io",
            "name": "glazewm"
        }
    }
    ```
*   **Verificación:** La respuesta devolverá un array de issues que combina múltiples páginas.

---

## 2. Ollama Local vs OpenAI
**Objetivo:** Cambiar entre proveedores de IA mediante configuración.

### Requisitos Previos (Solo para Ollama)
1.  Tener **Ollama** instalado en tu máquina.
2.  Tener el modelo descargado. Ejecuta en tu terminal:
    ```powershell
    ollama run llama3.1
    ```
    (Asegúrate de que este modelo coincide con el configurado en `src/services/ollama.service.js`).

### Configuración
Cambia la variable `AI_PROVIDER` en tu archivo `.env`:

    Usar Ollama (Local)
    ```env
    AI_PROVIDER=ollama
    # No necesitas OPENAI_API_KEY para esto
    ```


### Ejecución
Cualquier endpoint de IA usará automáticamente el proveedor que hayas elegido.


---

## 3. Histórico Meteorológico y Auditoría (OpenMeteo)
**Objetivo:** Consultar clima histórico, calcular media semanal y verificar umbral.

*   **Endpoint:** `POST /api/v1/audits/weather`
*   **Prueba en Postman:** "AuditWeathers" (Carpeta Tema5).
*   **Body JSON:**
    ```json
    {
        "city": "Seville",
        "temp": 18,
        "days": 21
    }
    ```
*   **Verificación:** La respuesta es un array de "auditorías". Fíjate en el campo `compliant`:
    *   `true`: La media semanal fue SUPERIOR a 18°C.
    *   `false`: La media fue inferior.
*   **Persistencia:** Estos datos se guardan automáticamente en MongoDB.

---

## 4. Resumen de Audio con IA
**Objetivo:** Generar un archivo de audio (MP3) con un resumen del clima reciente.

*   **Endpoint:** `POST /api/v1/ai/weather-summary`
*   **Prueba en Postman:** "Get Weather Audio Summary".
*   **Body JSON:**
    ```json
    {
        "city": "Seville"
    }
    ```
*   **Verificación:**
    *   Si usas "Send and Download" en Postman, se descargará un archivo `.mp3`.
    *   El audio contiene una voz narrando el clima de la última semana en español (o inglés según configuración del prompt).

---

## 5. Telemetría (Prometheus y Grafana)
**Objetivo:** Medir tiempos de respuesta y visualizarlos.

### Paso 1: Levantar Infraestructura
Ejecuta en la raíz del proyecto:
```powershell
docker-compose up -d
```
Esto inicia Prometheus (puerto 9090) y Grafana (puerto 3001).

### Paso 2: Generar Tráfico
Realiza varias peticiones en Postman a los endpoints anteriores (especialmente al de audio que tarda más) para generar datos.

### Paso 3: Visualizar en Grafana (Paso a Paso)
1.  **Entrar:** Abre `http://localhost:3001` (Usuario: `admin` / Password: `admin`).
2.  **Conectar Datos:**
    *   Ve al menú izquierdo (tres rayas) > Connections > Data sources.
    *   Clic en **"Add data source"** > Selecciona **Promiseus**.
    *   En "Connection" -> "Prometheus server URL" escribe: `http://host.docker.internal:9090`
    *   Baja al final y dale al botón azul **"Save & test"**.
3.  **Crear Gráfica:**
    *   En el menú izquierdo, clic en **"Dashboards"** (icono de 4 cuadrados) > botón azul **"New"** (arriba a la derecha) > **"New Dashboard"** > **"Add visualization"**.
    *   Selecciona tu datasource (el Prometheus que acabas de crear).
    *   En el cuadro de texto que dice "Enter a PromQL query..." (Métrica), escribe esta query para ver un histograma básico:
        ```promql
        http_request_duration_seconds_bucket
        ```
    *   Dale al botón azul pequeño **"Run queries"**. Deberías ver barras de colores.
    *   Finalmente, arriba a la derecha, dale a **"Apply"**.


