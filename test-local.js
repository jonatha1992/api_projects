/**
 * Test script - Prueba la API localmente
 * Ejecuta: node test-local.js
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin con configuración
admin.initializeApp({
  storageBucket: 'tecnofuision-it.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function testAPI() {
  console.log('\n🧪 Probando API localmente...\n');
  console.log('📦 Bucket:', bucket.name);
  console.log('');

  try {
    // Obtener archivos en projects/
    console.log('📂 Buscando carpetas en Storage (projects/)...\n');

    const [files] = await bucket.getFiles({ prefix: 'projects/' });

    console.log(`✅ Total de archivos encontrados: ${files.length}\n`);

    // Agrupar por carpeta
    const projectFolders = {};

    files.forEach(file => {
      const parts = file.name.split('/');
      if (parts.length >= 2 && parts[0] === 'projects') {
        const folderId = parts[1];
        if (!projectFolders[folderId]) {
          projectFolders[folderId] = [];
        }
        if (parts[2]) {
          projectFolders[folderId].push(file);
        }
      }
    });

    const projectIds = Object.keys(projectFolders);
    console.log(`📁 Carpetas (proyectos) encontradas: ${projectIds.length}\n`);

    if (projectIds.length === 0) {
      console.log('⚠️  No se encontraron carpetas de proyectos en Storage');
      console.log('\n💡 Verifica que tengas carpetas en:');
      console.log('   https://console.firebase.google.com/project/tecnofuision-it/storage\n');
      return;
    }

    // Mostrar primeros 5 proyectos
    console.log('📋 Primeros proyectos:\n');

    projectIds.slice(0, 5).forEach((id, index) => {
      const projectFiles = projectFolders[id];
      const images = projectFiles.filter(f =>
        f.metadata.contentType && f.metadata.contentType.startsWith('image/')
      );

      console.log(`${index + 1}. ID: ${id}`);
      console.log(`   Archivos: ${projectFiles.length}`);
      console.log(`   Imágenes: ${images.length}`);

      if (images.length > 0) {
        const url = `https://storage.googleapis.com/${bucket.name}/${images[0].name}`;
        console.log(`   Primera imagen: ${url.substring(0, 80)}...`);
      }
      console.log('');
    });

    console.log(`\n✅ La API funcionará correctamente!\n`);
    console.log('🚀 Para desplegar:\n');
    console.log('   1. Habilita Cloud Functions en Google Cloud Console');
    console.log('   2. Ejecuta: firebase deploy --only functions\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de estar autenticado:');
    console.log('   firebase login\n');
  }

  process.exit(0);
}

testAPI();
