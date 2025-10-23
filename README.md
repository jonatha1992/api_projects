# API Projects - Tecnofuision IT

API simple para obtener proyectos desde Firestore.

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

Obtiene todos los proyectos de Firestore.

**Respuesta exitosa:**
```json
{
  "success": true,
  "count": 5,
  "projects": [
    {
      "id": "6zFhXeIswgQvY2iGNq4O",
      "title": "AudiText",
      "description": "Introducing AudioText: your one-stop solution...",
      "image": "https://firebasestorage.googleapis.com/...",
      "previewLink": "https://github.com/jonatha1992/Auditext",
      "githubLink": "https://github.com/jonatha1992/Auditext",
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
- `title` - Título del proyecto
- `description` - Descripción completa
- `image` - URL de la imagen en Firebase Storage
- `previewLink` - Link de previsualización
- `githubLink` - Link del repositorio en GitHub
- `createdAt` - Fecha de creación (timestamp de Firestore)
- `updatedAt` - Fecha de actualización (timestamp de Firestore)

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

- **Firebase Cloud Functions** - Serverless functions (Node.js 18)
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
fetch('https://tecnofuision-it.web.app/api/projects')
  .then(response => response.json())
  .then(data => {
    console.log('Total proyectos:', data.count);
    console.log('Proyectos:', data.projects);
  });
```

### cURL
```bash
curl https://tecnofuision-it.web.app/api/projects
```

### Axios
```javascript
import axios from 'axios';

const response = await axios.get('https://tecnofuision-it.web.app/api/projects');
console.log(response.data.projects);
```

## Autor

**Jonatha Correa**
- Email: jonicorrea1992@gmail.com
- GitHub: [@jonatha1992](https://github.com/jonatha1992)

## Licencia

Este proyecto es privado.
