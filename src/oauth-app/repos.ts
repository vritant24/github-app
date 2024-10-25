import Router from "@koa/router";
import { OAuthApp } from "@octokit/oauth-app";
import { HttpError } from "koa";
import { SESSION_COOKIE_NAME } from "../constants.js";

export default function createReposRoutes(app: OAuthApp) {
    const router = new Router();

    router
        .prefix("/repos")
        .get("/repositories", async (ctx, next) => {
            const session = ctx.state.session;
            if (!session) {
                ctx.status = 401;
                return;
            }

            const userOctokit = await app.getUserOctokit({
                token: session,
                scopes: ["repo", "user"],
            });

            let res;
            try {
                res = await userOctokit.request("GET /user/repos");
            } catch (error) {
                if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') {
                    if (error.status === 401) {
                        // access token is invalid
                        // clear session cookie
                        ctx.cookies.set(SESSION_COOKIE_NAME, "", {
                            httpOnly: true,
                            sameSite: 'strict',
                            expires: new Date(0),
                        });
                        ctx.status = 401;
                        return;
                    }
                    ctx.status = error.status;
                    return;
                }

                console.error(error);
                ctx.status = 500;
                ctx.body = error;
                return;
            }

            if (res.status !== 200) {
                ctx.status = res.status;
                ctx.body = res.data;
                return;
            }

            const data = res.data;
            const repoNames: string[] = [];
            for (const repo of data) {
                repoNames.push(repo.full_name);
            }

            // get all repo names
            ctx.body = repoNames
            await next();
        });

    return router.routes();
}