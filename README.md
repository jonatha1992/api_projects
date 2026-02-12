# API Projects - Tecnofuision IT

API para obtener proyectos desde Firestore, incluyendo campos extendidos
como README, tecnologías y metadata adicional.

## URLs Disponibles

### URL Corta (Recomendada)
```
https://tecnofuision-it.web.app/api/projects
```

### URL Directa de Cloud Function
```
https://us-central1-tecnofuision-it.cloudfunctions.net/getProjects
```

Ambas URLs retornan exactamente el mismo contenido.

## Endpoint

### GET `/api/projects`

Obtiene proyectos de Firestore ordenados por `updatedAt` (descendente).

**Query params opcionales:**
- `limit` (number): cantidad de proyectos a devolver. Default: `50`, máximo: `200`.
- `includeReadme` (boolean): incluye o excluye campos de texto de README.
  - Default: `true`
  - Si envías `false`, omite: `readme`, `readmeContent`, `readmeMarkdown`, `readmeText`.

**Respuesta exitosa:**
```json
{
  "success": true,
  "count": 1,
  "limit": 50,
  "includeReadme": true,
  "projects": [
    {
      "id": "6zFhXeIswgQvY2iGNq4O",
      "title": "AudiText",
      "description": "Introducing AudioText: your one-stop solution...",
      "image": "https://firebasestorage.googleapis.com/...",
      "previewLink": "https://auditext.vercel.app",
      "githubLink": "https://github.com/jonatha1992/Auditext",
      "technologies": ["React", "Firebase", "Gemini"],
      "readmeUrl": "https://firebasestorage.googleapis.com/...",
      "readmeFileName": "README.md",
      "hasReadme": true,
      "isDeployed": true,
      "status": "Producción",
      "deploymentStatus": "production",
      "readmeContent": "# AudiText\n...",
      "createdAt": {
        "_seconds": 1761054601,
        "_nanoseconds": 978000000
      },
      "updatedAt": {
        "_seconds": 1761054601,
        "_nanoseconds": 978000000
      }
    }
  ]
}
```

**Campos retornados:**
- `id` - ID del documento en Firestore
- `title`, `description`, `image`, `previewLink`, `githubLink` - Compatibilidad con clientes actuales
- `technologies` - Array de tecnologías del proyecto (si existe)
  - También soporta fallback `tecnologies` por compatibilidad.
- `readmeUrl` - URL del README en Firebase Storage (si existe)
- `readmeFileName` - Nombre del archivo README (si existe)
- `hasReadme` - Indica si el proyecto tiene README asociado
- `isDeployed` - Booleano normalizado del estado de despliegue
- `status` - Campo original de Firestore (ej: `Desarrollo`, `Producción`)
- `deploymentStatus` - Estado de despliegue (`production` o `development`)
  - Prioridad de cálculo: `isDeployed` -> `status/environment/stage` -> inferencia por `previewLink`.
  - Si no existen, se infiere por `previewLink`:
    - URL HTTP/HTTPS válida => `production`
    - Texto sin URL (ej: "Próximamente", "no tiene al momento") => `development`
- `readme`, `readmeContent`, `readmeMarkdown`, `readmeText` - Se devuelven cuando `includeReadme=true`
- `createdAt` - Fecha de creación (timestamp de Firestore)
- `updatedAt` - Fecha de actualización (timestamp de Firestore)
- Cualquier otro campo adicional guardado en Firestore también se retorna.

## Estructura del Proyecto

```
api_projects/
├── index.js                    # Cloud Function principal
├── package.json                # Dependencias
├── firebase.json               # Configuración de Firebase
├── firestore.rules             # Reglas de seguridad de Firestore
├── firestore.indexes.json      # Índices de Firestore
├── public/
│   └── index.html             # Página de inicio del Hosting
└── README.md                   # Este archivo
```

## Tecnologías

- **Firebase Cloud Functions** - Serverless functions (Node.js 20)
- **Firebase Firestore** - Base de datos NoSQL
- **Firebase Hosting** - Hosting estático con rewrites
- **CORS** - Habilitado para todas las origins

## Deployment

Para desplegar cambios:

```bash
# Desplegar solo functions
firebase deploy --only functions

# Desplegar solo hosting
firebase deploy --only hosting

# Desplegar solo firestore rules
firebase deploy --only firestore:rules

# Desplegar todo
firebase deploy
```

## Seguridad

Las reglas de Firestore permiten:
- **Lectura pública** de la colección `projects`
- **Escritura solo desde consola/admin** (no público)

## Ejemplo de Uso

### JavaScript/Fetch
```javascript
fetch('https://tecnofuision-it.web.app/api/projects?limit=20&includeReadme=false')
  .then(response => response.json())
  .then(data => {
    console.log('Total proyectos:', data.count);
    console.log('Proyectos:', data.projects);
  });
```

### cURL
```bash
curl "https://tecnofuision-it.web.app/api/projects?limit=20&includeReadme=true"
```

### Axios
```javascript
import axios from 'axios';

const response = await axios.get(
  'https://tecnofuision-it.web.app/api/projects?limit=10&includeReadme=false'
);
console.log(response.data.projects);
```

## Autor

**Jonatha Correa**
- Email: jonicorrea1992@gmail.com
- GitHub: [@jonatha1992](https://github.com/jonatha1992)

## Licencia

Este proyecto es privado.
