import { Application, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";

const app = new Application();
const router = new Router();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

router
 .get('/', (context) => {
    context.response.body = 'Hello world!';
 })
 .get('/json', (context) => {
    context.response.body = {status: 'ok'};
 })
 .get('/json/:id', (context) => {
    context.response.body = {
     status: 'ok',
     id: context.params.id
    };
 });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
