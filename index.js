const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

/**
 * Cloud Function - Get projects from Firestore
 * GET /getProjects
 *
 * Lee los proyectos de Firestore con toda la información
 */
exports.getProjects = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
      }

      const db = admin.firestore();

      // Obtener todos los proyectos de Firestore
      const projectsSnapshot = await db.collection('projects').get();

      if (projectsSnapshot.empty) {
        return response.status(200).json({
          success: true,
          count: 0,
          projects: [],
          message: 'No projects found in Firestore'
        });
      }

      // Mapear los proyectos
      const projects = projectsSnapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          image: data.image || '',
          previewLink: data.previewLink || '',
          githubLink: data.githubLink || '',
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null
        };
      });

      return response.status(200).json({
        success: true,
        count: projects.length,
        projects: projects
      });

    } catch (error) {
      console.error('Error:', error);
      return response.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
});
