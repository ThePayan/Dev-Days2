import axios from 'axios';

const githubHeaders = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dev-days-app',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

/**
 * Función que recibe una url y un objeto de parámetros
 * 
 * @param {string} url - Es la url de la api de github
 * @param {object} params - Es un objeto con los parámetros de la api de github como page y per_page
 */

//Función genérica recursiva (no final #ADDAtrauma) para obtener datos paginados de GitHub
export const fetchGithubPaginated = async (url, params = {}) => {
    const page = params.page || 1;
    const perPage = params.per_page || 100; // Pongo 100 por default, porque como sea grande se lleva la misma vida en cargar el postman 🔥

    try {
        const response = await axios.get(url, {
            params: { ...params, page, per_page: perPage },
            headers: githubHeaders,
        });

        const currentPageData = response.data;

        if (Array.isArray(currentPageData) && currentPageData.length === perPage) {
            const nextParams = { ...params, page: page + 1, per_page: perPage };
            const nextPagesData = await fetchGithubPaginated(url, nextParams);
            return [...currentPageData, ...nextPagesData];
        }

        return currentPageData;
    } catch (error) {
        console.error(`Error fetching GitHub data from ${url}:`, error.message);
        throw error;
    }
};

export default {
    fetchGithubPaginated
};
