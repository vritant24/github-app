import Router from "@koa/router";
import { SESSION_COOKIE_NAME } from "../constants.js";
import { OAuthApp } from "@octokit/oauth-app";
import { Scopes } from "./app.js";

export default function createAuthRoutes(app: OAuthApp) {
    const router = new Router();
    router
        .prefix("/auth")
        .get("/login", async (ctx, next) => {
            const redirectUrl = new URL('/oauth/auth/callback', ctx.origin);

            const loginUrl = app.getWebFlowAuthorizationUrl({
                scopes: Scopes,
                redirectUrl: redirectUrl.toString()
            });

            ctx.status = 200;
            ctx.body = loginUrl.url
            await next();
        })
        .get("/callback", async (ctx, next) => {
            const query = ctx.request.query;
            const code = query.code;
            if (!code || Array.isArray(code)) {
                ctx.body = "Missing code";
                return;
            }

            const res = await app.createToken({
                code: code,
            });

            //set token in cookie
            ctx.cookies.set(SESSION_COOKIE_NAME, res.authentication.token, {
                httpOnly: true,
                sameSite: 'strict'
            });

            console.log("Authenticated as %s", res.authentication.tokenType);
            await next();
        });

    return router.routes();
}