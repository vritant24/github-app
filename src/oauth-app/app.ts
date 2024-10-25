import { OAuthApp } from "@octokit/oauth-app";
import { getEnvironmentVariables } from "../utilities.js";

export const Scopes = ["repo", "user"];

export async function createGithubOauthApp() {
    const env = getEnvironmentVariables();
    
    const app = new OAuthApp({
        clientId: env.OAUTH_CLIENT_ID,
        clientSecret: env.OAUTH_CLIENT_SECRET,
    });
    return app;
}