export function getEnvironmentVariables() {

    const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
    const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
    
    if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET) {
        throw new Error("Missing environment variables");
    }

    return {
        OAUTH_CLIENT_ID,
        OAUTH_CLIENT_SECRET
    };
}