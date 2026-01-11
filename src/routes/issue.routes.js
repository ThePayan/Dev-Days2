import { Router } from "express";
import { getAllIssues, getIssueByIssueId, fetchGithubIssues, fetchGithubIssuesPaginated } from "../controllers/issue.controller.js";

const issueRouter = Router();

issueRouter.get('/issues', getAllIssues);
issueRouter.get('/issues/:issueId', getIssueByIssueId);
issueRouter.post('/issues/fetch', fetchGithubIssues);
issueRouter.post('/issues/fetch-paginated', fetchGithubIssuesPaginated);

export { issueRouter };