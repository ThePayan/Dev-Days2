import IssueRepository from '../repositories/issue.repository.js';
import { fetchGithubPaginated } from './github.js';

export const getAllIssues = async () => {
    return await IssueRepository.findAll();
};

export const getIssueByIssueId = async (issueId) => {
    return await IssueRepository.findByIssueId(issueId);
};



export const fetchGithubIssues = async (repoOwner, repoName) => {
    return await fetchGithubPaginated(
       `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
       { state: 'all' }
    );
};

export const fetchGithubIssuesPaginated = async (repoOwner, repoName, page = 1, perPage = 100) => {
    return await fetchGithubPaginated(
        `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
        { state: 'all', page, per_page: perPage }
    );
};



export const saveIssues = async (issues) => {
    const savedIssues = [];
    for (const issueData of issues) {
        const existingIssue = await IssueRepository.findByIssueId(issueData.id);
        if (!existingIssue) {
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