import axios from 'axios';
import IssueRepository from '../repositories/issue.repository.js';

const githubHeaders = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dev-days-app',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

export const getAllIssues = async () => {
    return await IssueRepository.findAll();
};

export const getIssueByIssueId = async (issueId) => {
    return await IssueRepository.findByIssueId(issueId);
};

export const fetchGithubIssues = async (repoOwner, repoName) => {
    const response = await axios.get(
        `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
        { params: { state: 'all' }, headers: githubHeaders },
    );
    return response.data;
};

// Descarga todas las páginas de issues de GitHub de forma recursiva (simple)
export const fetchGithubIssuesPaginated = async (repoOwner, repoName, page = 1, perPage = 100) => {
    const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
        params: { state: 'all', page, per_page: perPage },
        headers: githubHeaders,
    });

    const currentPage = response.data;

    // Si la página está llena, asume que hay más y llama a la siguiente
    if (currentPage.length === perPage) {
        const nextPages = await fetchGithubIssuesPaginated(repoOwner, repoName, page + 1, perPage);
        return [...currentPage, ...nextPages];
    }

    // Caso base: última página
    return currentPage;
};



export const saveIssues = async (issues) => {
    const savedIssues = [];
    for (const issueData of issues) {
        const existingIssue = await IssueRepository.findByIssueId(issueData.id);
        if (!existingIssue) {
            // TODO: Store the updated_at field from the GitHub issue
            const newIssue = {
                issueId: issueData.id,
                number: issueData.number,
                title: issueData.title,
                body: issueData.body,
                url: issueData.html_url,
                state: issueData.state,
                createdAt: issueData.created_at,
                updatedAt: issueData.updated_at,
            };
            savedIssues.push(await IssueRepository.create(newIssue));
        } else {
            savedIssues.push(existingIssue);
        }
    };
    return savedIssues;
};

export default {
    getAllIssues,
    getIssueByIssueId,
    fetchGithubIssues,
    fetchGithubIssuesPaginated,
    saveIssues
};