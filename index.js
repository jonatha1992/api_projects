const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const README_TEXT_FIELDS = [
  'readme',
  'readmeContent',
  'readmeMarkdown',
  'readmeText'
];
const PRODUCTION_VALUES = new Set(['prod', 'production', 'produccion', 'producción']);
const DEVELOPMENT_VALUES = new Set(['dev', 'development', 'desarrollo']);

function parseLimit(value) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

function parseIncludeReadme(value) {
  if (typeof value !== 'string') {
    return true;
  }

  return value.toLowerCase() !== 'false';
}

function timestampToMillis(timestamp) {
  if (!timestamp) {
    return 0;
  }

  if (typeof timestamp.toMillis === 'function') {
    return timestamp.toMillis();
  }

  if (typeof timestamp._seconds === 'number') {
    const nanos = typeof timestamp._nanoseconds === 'number' ? timestamp._nanoseconds : 0;
    return (timestamp._seconds * 1000) + Math.floor(nanos / 1000000);
  }

  if (typeof timestamp.seconds === 'number') {
    const nanos = typeof timestamp.nanoseconds === 'number' ? timestamp.nanoseconds : 0;
    return (timestamp.seconds * 1000) + Math.floor(nanos / 1000000);
  }

  return 0;
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\/\S+$/i.test(value.trim());
}

function normalizeLifecycle(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim().toLowerCase();

  if (PRODUCTION_VALUES.has(normalized)) {
    return 'production';
  }

  if (DEVELOPMENT_VALUES.has(normalized)) {
    return 'development';
  }

  return '';
}

function parseBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (['true', '1', 'yes', 'si', 'sí'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no'].includes(normalized)) {
      return false;
    }
  }

  return null;
}

function resolveIsDeployed(data, previewLink) {
  const explicitBoolean = parseBoolean(data.isDeployed);

  if (explicitBoolean !== null) {
    return explicitBoolean;
  }

  const explicitStatus =
    normalizeLifecycle(data.status) ||
    normalizeLifecycle(data.environment) ||
    normalizeLifecycle(data.stage);

  if (explicitStatus) {
    return explicitStatus === 'production';
  }

  return isHttpUrl(previewLink);
}

function resolveDeploymentStatus(data, previewLink) {
  return resolveIsDeployed(data, previewLink) ? 'production' : 'development';
}

/**
 * Cloud Function - Get projects from Firestore
 * GET /getProjects
 *
 * Query params:
 * - limit (number): default 50, max 200
 * - includeReadme (boolean): default true
 *
 * Lee proyectos de Firestore con soporte para campos dinámicos.
 */
exports.getProjects = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
      }

      const db = admin.firestore();
      const limit = parseLimit(request.query.limit);
      const includeReadme = parseIncludeReadme(request.query.includeReadme);

      // Obtener todos los proyectos y ordenarlos luego para no excluir documentos antiguos.
      const projectsSnapshot = await db.collection('projects').get();

      if (projectsSnapshot.empty) {
        return response.status(200).json({
          success: true,
          count: 0,
          projects: [],
          limit,
          includeReadme,
          message: 'No projects found in Firestore'
        });
      }

      // Mapear proyectos manteniendo compatibilidad y exponiendo campos nuevos.
      const projects = projectsSnapshot.docs
        .map(doc => {
          const data = doc.data() || {};
          const previewLink =
            typeof data.previewLink === 'string'
              ? data.previewLink
              : typeof data.demoLink === 'string'
                ? data.demoLink
                : '';
          const githubLink =
            typeof data.githubLink === 'string'
              ? data.githubLink
              : typeof data.repoLink === 'string'
                ? data.repoLink
                : '';
          const deploymentStatus = resolveDeploymentStatus(data, previewLink);
          const isDeployed = resolveIsDeployed(data, previewLink);

          const project = {
            id: doc.id,
            ...data,
            title: typeof data.title === 'string' ? data.title : '',
            description: typeof data.description === 'string' ? data.description : '',
            image: typeof data.image === 'string' ? data.image : '',
            previewLink,
            githubLink,
            technologies: Array.isArray(data.technologies)
              ? data.technologies
              : Array.isArray(data.tecnologies)
                ? data.tecnologies
                : [],
            readmeUrl:
              typeof data.readmeUrl === 'string'
                ? data.readmeUrl
                : typeof data.readmeURL === 'string'
                  ? data.readmeURL
                  : '',
            readmeFileName: typeof data.readmeFileName === 'string' ? data.readmeFileName : '',
            hasReadme: Boolean(
              data.hasReadme ||
                data.readmeUrl ||
                data.readmeURL ||
                data.readmeFileName ||
                data.readme ||
                data.readmeContent ||
                data.readmeMarkdown ||
                data.readmeText
            ),
            isDeployed,
            deploymentStatus,
            createdAt: data.createdAt || null,
            updatedAt: data.updatedAt || null
          };

          if (!includeReadme) {
            README_TEXT_FIELDS.forEach(field => {
              delete project[field];
            });
          }

          return project;
        })
        .sort((a, b) => {
          const aTimestamp = timestampToMillis(a.updatedAt) || timestampToMillis(a.createdAt);
          const bTimestamp = timestampToMillis(b.updatedAt) || timestampToMillis(b.createdAt);
          return bTimestamp - aTimestamp;
        })
        .slice(0, limit);

      return response.status(200).json({
        success: true,
        count: projects.length,
        limit,
        includeReadme,
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
