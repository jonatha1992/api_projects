# API Projects - Firebase Cloud Functions ✅ SIMPLE

Backend SUPER SIMPLE para obtener proyectos desde Firebase Storage.

## ✅ Lo que está LISTO

- ✅ Código super simple (solo lee carpetas de Storage)
- ✅ Sin Firestore ni bases de datos
- ✅ CORS configurado
- ✅ Probado localmente ✅
- ✅ Listo para desplegar

## 📁 Archivos del Proyecto

```
api_projects/
├── index.js           # Cloud Function (código principal)
├── package.json       # Dependencias
├── firebase.json      # Configuración Firebase
├── .firebaserc        # Proyecto: tecnofuision-it
├── test-local.js      # Script de prueba
└── README.md          # Este archivo
```

## 🚀 Desplegar EN 2 PASOS

### Paso 1: Habilitar Cloud Functions

Ve a Google Cloud Console y habilita las APIs (haz clic y presiona "HABILITAR"):

- https://console.cloud.google.com/apis/library/cloudfunctions.googleapis.com?project=tecnofuision-it
- https://console.cloud.google.com/apis/library/artifactregistry.googleapis.com?project=tecnofuision-it

### Paso 2: Desplegar

```bash
firebase deploy --only functions
```

¡Listo! Tu API estará en:
```
https://us-central1-tecnofuision-it.cloudfunctions.net/getProjects
```

---

## 🧪 Probar Localmente

```bash
node test-local.js
```

Este script:
- Se conecta a Firebase Storage de producción
- Muestra cuántos proyectos tienes
- Lista los primeros 5 proyectos con sus imágenes

---

## 📦 Respuesta de la API

```json
{
  "success": true,
  "count": 5,
  "projects": [
    {
      "id": "6zFhXeIswgQvY2iGNq4O",
      "name": "6zFhXeIswgQvY2iGNq4O",
      "images": [
        "https://storage.googleapis.com/tecnofuision-it.firebasestorage.app/projects/6zFhXeIswgQvY2iGNq4O/image1.jpg"
      ],
      "thumbnail": "https://storage.googleapis.com/.../image1.jpg",
      "files": [
        {
          "name": "image1.jpg",
          "url": "https://storage.googleapis.com/.../image1.jpg",
          "size": 124567,
          "contentType": "image/jpeg"
        }
      ]
    }
  ]
}
```

---

## 🎯 Cómo Funciona

1. Lee las carpetas en `projects/` de Firebase Storage
2. Agrupa los archivos por carpeta (cada carpeta = 1 proyecto)
3. Identifica las imágenes por `contentType`
4. Retorna JSON con proyectos, imágenes y archivos

**Ejemplo de estructura en Storage:**
```
projects/
├── 6zFhXeIswgQvY2iGNq4O/
│   ├── screenshot1.jpg
│   ├── screenshot2.jpg
│   └── demo.mp4
├── MduZa93NxmHvrcH3OGIu/
│   └── preview.png
└── nOXuQImJq5Nj8eQICEo2/
    ├── icon.png
    └── mockup.jpg
```

---

## 🔧 Solución de Problemas

### Error: "service account doesn't exist"

Habilita las APIs del Paso 1.

### Error: "permission denied"

1. Ve a https://console.firebase.google.com/project/tecnofuision-it/functions
2. Verifica que Cloud Functions esté habilitado
3. Reintenta el deploy

### La API retorna [] (vacío)

Verifica que tienes carpetas en `projects/` en Firebase Storage:
https://console.firebase.google.com/project/tecnofuision-it/storage

---

## 📝 Código Principal (index.js)

```javascript
// Lee carpetas de Storage
const [files] = await bucket.getFiles({ prefix: 'projects/' });

// Agrupa por carpeta
files.forEach(file => {
  const folderId = file.name.split('/')[1];
  projectFolders[folderId].push(file);
});

// Retorna JSON
response.json({ success: true, projects: [...] });
```

---

## 🚀 Próximos Pasos (Opcional)

Si quieres agregar nombres personalizados en lugar de IDs:

1. Crea un archivo `info.json` en cada carpeta de Storage:
```json
{
  "name": "Mi Proyecto",
  "description": "Descripción del proyecto",
  "tags": ["web", "react"],
  "year": "2024"
}
```

2. Modifica `index.js` para leer estos archivos

Pero **por ahora funciona perfecto** con los IDs de las carpetas.

---

**Proyecto:** tecnofuision-it
**Función:** getProjects
**Región:** us-central1
**Storage Bucket:** tecnofuision-it.firebasestorage.app
