import { createGithubOauthApp  } from "./oauth-app/app.js";
import Koa from "koa";
import mount from "koa-mount";
import createOauthAuthRoutes from './oauth-app/auth.js';
import { SESSION_COOKIE_NAME } from "./constants.js";
import createReposRoutes from "./oauth-app/repos.js";

// CREATE APP
const oauthApp = await createGithubOauthApp();

const app = new Koa()

// middleware to handle get session cookie
app.use(async (ctx, next) => {
    const session = ctx.cookies.get(SESSION_COOKIE_NAME);
    if (session) {
        ctx.state.session = session;
    }
    await next();
});

app.use(mount("/oauth", createOauthAuthRoutes(oauthApp)));
app.use(mount("/oauth", createReposRoutes(oauthApp)));

app.onerror = (err) => {
    console.error(err);
}

app.listen(3000, () => {
    console.log("Server running on port 3000");
});