# ToggleNest — Interview Q&A

> Use this document to prep for technical interviews about ToggleNest. Questions are grouped by topic and progress from basic to advanced.

## Difficulty Legend

- 🟢 **Basic** — fundamentals an interviewer expects you to know cold
- 🟡 **Intermediate** — how it's wired in *this* project
- 🔴 **Advanced** — tradeoffs, alternatives, edge cases

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Repo Layout](#2-architecture--repo-layout)
3. [Frontend — React Choices](#3-frontend--react-choices)
4. [Frontend — Implementation](#4-frontend--implementation)
5. [Styling & UI](#5-styling--ui)
6. [Backend — Express](#6-backend--express)
7. [Database — MongoDB + Mongoose](#7-database--mongodb--mongoose)
8. [Authentication — JWT + bcrypt](#8-authentication--jwt--bcrypt)
9. [Authorization — Roles + Ownership](#9-authorization--roles--ownership)
10. [Security Hardening](#10-security-hardening)
11. [API Design](#11-api-design)
12. [Error Handling](#12-error-handling)
13. [Performance](#13-performance)
14. [Deployment](#14-deployment)
15. [Production Practices](#15-production-practices)
16. [Tradeoffs & What Would You Change](#16-tradeoffs--what-would-you-change)

---

## 1. Project Overview

### Q: What is ToggleNest? 🟢 Basic

**Short answer:** A full-stack team task management app. Teams create projects, assign members, and track work on a Kanban board (To Do / In Progress / Done) with drag-and-drop.

### Q: Who uses it? 🟢 Basic

**Short answer:** Small teams that need a simple Trello/Jira alternative. Two roles — Admin (creates and manages projects) and Team Member (works on tasks).

### Q: What problem does it solve? 🟡 Intermediate

**Short answer:** Teams lose track of who's doing what. ToggleNest centralizes work with a visual board, role-based access, activity logs, and notifications.

### Q: What stack is this built on? 🟢 Basic

**Short answer:** MERN — MongoDB, Express, React, Node.js. Plus Mongoose (ORM), JWT (auth), bcrypt (password hashing), Tailwind (CSS), react-beautiful-dnd (drag-drop), Axios (HTTP).

### Q: What are the core features? 🟢 Basic

**Short answer:**
- JWT-secured authentication with role-based access
- Project CRUD with member assignment and deadlines
- Drag-and-drop Kanban board (To Do / In Progress / Done) with priority and due dates
- Stats dashboard with task completion percentages
- Activity log of every change
- In-app notifications

### Q: How is the app deployed? 🟢 Basic

**Short answer:** Frontend on Vercel (`togglenest.vercel.app`), backend on Render (`togglenest-api.onrender.com`), database on MongoDB Atlas.

---

## 2. Architecture & Repo Layout

### Q: What's the high-level architecture? 🟢 Basic

**Short answer:** Two separate apps in one git repo. React frontend on port 3000, Express + MongoDB backend on port 5000. They talk over a REST API with JSON.

### Q: Is this a true monorepo? 🟡 Intermediate

**Short answer:** No. There's no root `package.json` and no workspace tooling (npm workspaces, pnpm, turbo). It's two independent npm packages in sibling folders sharing one git repo. People casually call this a "monorepo" but technically it isn't one.

### Q: Why didn't you use npm workspaces? 🔴 Advanced

**Short answer:** Workspace overhead isn't worth it for a 2-package project. Workspaces shine when you have shared internal libraries. Frontend and backend share zero code here, so isolation is simpler.

### Q: Why split frontend and backend? 🟡 Intermediate

**Short answer:** Different concerns, different deploy targets. Frontend = static SPA → CDN (Vercel). Backend = stateful Node server → application host (Render). Each can scale and deploy independently.

> **Why not Next.js full-stack?** Could've used Next.js API routes to combine. Skipped because (a) Express has more middleware ecosystem, (b) cleaner separation of concerns, (c) easier interview talking point.

### Q: Why not microservices? 🔴 Advanced

**Short answer:** Premature for a portfolio app. Microservices add complexity (service discovery, inter-service auth, distributed tracing) that makes sense at 50+ engineers, not solo. One Express app is the right call.

---

## 3. Frontend — React Choices

### Q: Why React? 🟢 Basic

**Short answer:** Largest ecosystem and job market in 2026. Component model maps well to a feature-rich UI like Kanban. Lots of libraries (react-router, react-icons, dnd) ready to use.

### Q: React vs Vue vs Angular? 🟡 Intermediate

**Short answer:**
- **React:** biggest community, most jobs, most flexibility
- **Vue:** simpler API but smaller ecosystem
- **Angular:** heavyweight, opinionated, overkill for solo projects
- **Svelte:** lean and fast but still niche for jobs

### Q: Why Create React App, not Vite or Next.js? 🟡 Intermediate

**Short answer:** CRA was the default scaffolder for years and works out of the box. Vite is faster but newer. Next.js does SSR but I didn't need SEO since this is an authenticated app behind a login.

> **Honest follow-up:** If asked "CRA is deprecated, why did you use it?" — yes, it's no longer maintained by Meta. For a new project today I'd pick Vite. CRA was chosen because it's what I'd already used before.

### Q: Why React Router DOM? 🟢 Basic

**Short answer:** Standard library for client-side routing in React SPAs. v6 has a clean declarative API with `<Routes>` and `<Route>`.

### Q: BrowserRouter vs HashRouter — which and why? 🟡 Intermediate

**Short answer:** BrowserRouter — gives clean URLs like `/dashboard` instead of `#/dashboard`. Tradeoff: needs server (or Vercel) to rewrite unknown routes to `index.html` so deep links work. That's what [Frontend/vercel.json](Frontend/vercel.json) does.

### Q: How does ProtectedRoute work? 🟡 Intermediate

**Short answer:** A wrapper component that checks if a JWT token exists in localStorage. If yes → render the page. If no → redirect to `/login`. This is *frontend-only* gating; the real security is on the backend's `protect` middleware.

---

## 4. Frontend — Implementation

### Q: Where is the JWT stored? Why? 🟡 Intermediate

**Short answer:** In `localStorage`, under the key `token`. localStorage persists across tabs and browser restarts.

> **Tradeoff:** localStorage is XSS-vulnerable — any malicious script can read it. The safer alternative is httpOnly cookies (JS can't read them) but those need CSRF protection. For a portfolio app, localStorage is acceptable.

### Q: How does the axios interceptor work? 🟡 Intermediate

**Short answer:** Two interceptors in [Frontend/src/utils/api.js](Frontend/src/utils/api.js):
1. **Request interceptor:** reads the JWT from localStorage and adds `Authorization: Bearer <token>` to every outgoing request.
2. **Response interceptor:** if the server returns 401, clears the token and redirects to `/login` — handles expired tokens automatically.

### Q: What does the ErrorBoundary do? 🟡 Intermediate

**Short answer:** A React class component that catches JS errors during rendering. Without it, a crash anywhere in the tree shows a blank white page. With it, users see a friendly "Something went wrong — Reload" message.

### Q: What does ErrorBoundary NOT catch? 🔴 Advanced

**Short answer:**
- Errors in event handlers (use try/catch there)
- Errors in async/Promise code (use `.catch()`)
- Errors during server-side rendering
- Errors thrown in the ErrorBoundary itself

### Q: Why a custom logger.js? 🟡 Intermediate

**Short answer:** `console.error` in production code leaks debug info to anyone who opens DevTools. The custom `logError` in [Frontend/src/utils/logger.js](Frontend/src/utils/logger.js) only logs in development mode. Same API, gated by `NODE_ENV`.

### Q: Where is the JWT decoded on the frontend? 🔴 Advanced

**Short answer:** It isn't. The frontend only stores the token and sends it back. Decoding/verifying happens on the backend's `protect` middleware. **Never trust the frontend to validate auth.**

### Q: Why is REACT_APP_API_URL required at startup? 🔴 Advanced

**Short answer:** Earlier the code had `process.env.REACT_APP_API_URL || 'http://localhost:5000/api'`. That fallback was dangerous — if the env var was missing in production, the app would silently call localhost (broken). Now it throws at startup. **Fail loud, debug fast.**

### Q: What's the React state management approach? 🟡 Intermediate

**Short answer:** React's built-in `useState` and `useEffect`. No Redux, no Zustand, no Context for global state. Each page fetches its own data.

> **Why no Redux?** Redux shines for complex shared state across many components. Here, state is mostly page-local (a list of tasks, a form). Adding Redux would be over-engineering.

---

## 5. Styling & UI

### Q: Why Tailwind CSS? 🟢 Basic

**Short answer:** Utility-first → fast to write, no naming things, consistent design. Stays in JSX so I don't context-switch to CSS files. Production build only ships the classes I actually use (PurgeCSS).

### Q: Tailwind vs Material-UI vs Bootstrap? 🟡 Intermediate

**Short answer:**
- **Material-UI:** prebuilt components, but heavy bundle and rigid Material look
- **Bootstrap:** older, dated, harder to customize
- **Tailwind:** primitives only — full design control, lightweight, modern

### Q: Tailwind vs styled-components (CSS-in-JS)? 🔴 Advanced

**Short answer:**
- **CSS-in-JS:** styles colocated with components, but runtime cost (parsing styles in browser) and theme prop drilling.
- **Tailwind:** zero runtime, smaller bundle, atomic classes are easier to read once you know them.

### Q: Why react-beautiful-dnd if it's unmaintained? 🔴 Advanced

**Short answer:** Honest — it works for this project's size and was the most popular DnD library when I scaffolded.

> **Known issues:** Doesn't work with React 18 strict mode (commit `2051247` removes strict mode for this reason). For a new project I'd use **@hello-pangea/dnd** (a maintained drop-in fork) or **dnd-kit** (modern, accessible, the new standard).

### Q: How does drag-and-drop work? 🟡 Intermediate

**Short answer:**
1. `<DragDropContext onDragEnd={...}>` wraps the board
2. Each column is a `<Droppable>`, each task is a `<Draggable>`
3. On drop, the `onDragEnd` callback gets source/destination column info
4. We optimistically move the task in local state, then PUT to `/api/tasks/:id` with the new status
5. The backend updates the task and logs the activity

### Q: How is the app responsive? 🟡 Intermediate

**Short answer:** Tailwind's breakpoint utilities (`md:`, `lg:`). Kanban columns stack on mobile (single column) and become 3-up on `md+`. Sidebar collapses on small screens.

---

## 6. Backend — Express

### Q: Why Express? 🟢 Basic

**Short answer:** Minimal, flexible, huge middleware ecosystem (cors, helmet, morgan, express-validator), works with any DB, easy to learn. The "default" Node web framework.

### Q: Express vs Fastify? 🔴 Advanced

**Short answer:**
- **Fastify:** ~2× faster JSON throughput, built-in schema validation, better TypeScript support
- **Express:** larger ecosystem, more StackOverflow answers, more familiar to most teams

For a portfolio MERN app, Express is the safer pick. For a high-throughput API, Fastify wins.

### Q: Express vs NestJS? 🔴 Advanced

**Short answer:** NestJS adds dependency injection, decorators, and Angular-style structure. Powerful for large teams, but heavyweight for a small project — feels like overkill.

### Q: Does middleware order matter? 🟡 Intermediate

**Short answer:** Yes — critically. Order in [Backend/server.js](Backend/server.js):

1. `helmet` (security headers) — first so they cover all responses
2. `compression` — early so even errors get gzipped
3. `morgan` (logging) — logs every request including rejected ones
4. `body parsers` — before any route reads `req.body`
5. `mongoSanitize` — strips `$`/`.` from `req.body` BEFORE controllers see it
6. `cors` — must run before route handlers
7. routes
8. 404 handler
9. **error handler — must be last**, with 4 args `(err, req, res, next)`

### Q: Why is the error handler the last middleware? 🟡 Intermediate

**Short answer:** Express recognizes a middleware function with **4 arguments** as an error handler. It only fires when `next(err)` is called or an error is thrown upstream. Putting it last means it catches errors from anywhere.

### Q: What does the JSON body limit do? 🟡 Intermediate

**Short answer:** `express.json({ limit: '10kb' })` rejects requests with bodies larger than 10kb with HTTP 413. Prevents DoS attacks where attackers send huge payloads to exhaust server memory.

### Q: Why express.urlencoded? 🟢 Basic

**Short answer:** Parses HTML form submissions. The frontend uses JSON, but this is enabled defensively for any tool/test that posts form data.

---

## 7. Database — MongoDB + Mongoose

### Q: Why MongoDB? 🟡 Intermediate

**Short answer:**
- Schema-flexible — easy to add fields during prototyping
- JSON-native — Mongoose docs ↔ React state with no mapping
- Free tier on Atlas
- Embedded arrays (e.g., `members: [ObjectId]`) avoid join tables for simple cases

### Q: MongoDB vs PostgreSQL? 🔴 Advanced

**Short answer:**
- **PostgreSQL:** ACID transactions, strong typing, mature joins, better for relational data
- **MongoDB:** faster iteration, better for nested/document data, weaker consistency guarantees

For an internal tool with relational entities (users → projects → tasks), Postgres might fit better. MongoDB was chosen for the MERN stack convention and Atlas free tier.

### Q: Why Mongoose, not the native MongoDB driver? 🟡 Intermediate

**Short answer:** Mongoose adds:
- Schemas with validation (required, enum, min/max, regex)
- Middleware (pre('save') hooks for password hashing)
- Population for refs (joins)
- Stronger error messages

Without it you'd write all that yourself.

### Q: Mongoose vs Prisma? 🔴 Advanced

**Short answer:**
- **Prisma:** typed schema, generated client, multi-DB support, better DX
- **Mongoose:** MongoDB-only, weaker types (without TS), but battle-tested

For TypeScript projects, Prisma wins. For pure JS MongoDB, Mongoose is fine.

### Q: What does `select: false` on the password field do? 🟡 Intermediate

**Short answer:** Tells Mongoose to **never include `password` in query results by default**. So `User.findById(id)` returns the user *without* the password — even if you forget to exclude it. To include it (only for login comparison), call `.select('+password')`. Defense in depth.

### Q: Why bcrypt with 10 salt rounds? 🟡 Intermediate

**Short answer:**
- **bcrypt:** slow by design — makes brute-force attacks expensive
- **10 rounds:** ~100ms per hash on commodity hardware. Each extra round doubles compute. 10 is the modern minimum; 12 is safer; below 8 is unsafe.

### Q: bcrypt vs argon2? 🔴 Advanced

**Short answer:**
- **bcrypt:** older (1999), simpler, ubiquitous Node support
- **argon2:** newer (2015 winner of password-hashing competition), memory-hard (resists GPU attacks better)

Both are fine for a portfolio app. Argon2 is technically stronger if you need to defend against well-funded attackers.

### Q: What does the `pre('save')` hook do? 🟡 Intermediate

**Short answer:** [Backend/models/User.js](Backend/models/User.js) — runs before every `user.save()`. Hashes the password if it's been modified. Without it, plaintext passwords would land in the DB.

### Q: There was a bug in the pre('save') hook — what was it? 🔴 Advanced

**Short answer:** The original code called `next()` without `return`, so even when the password wasn't modified, execution continued to re-hash it. Result: every `user.save()` (e.g., when updating the user's name) would double-hash the already-hashed password and break login. Fixed by adding `return next()`.

### Q: Why add Mongoose indexes? 🟡 Intermediate

**Short answer:** Without an index, MongoDB does a full collection scan for every query (O(n)). With an index, lookups are O(log n). Added on:
- `Task.project` — most queries filter by project
- `Task.assignedTo` — "tasks assigned to me"
- `Notification.recipient + read` — unread count queries
- `ActivityLog.user + createdAt` — recent activity feed

### Q: What's a compound index? 🔴 Advanced

**Short answer:** An index on multiple fields. `{ recipient: 1, read: 1 }` indexes both — useful for queries like `Notification.find({ recipient: userId, read: false })`. Order matters: queries on `recipient` alone can still use this index (left-prefix), but queries on `read` alone cannot.

### Q: Why `mongoose.set('strictQuery', true)`? 🔴 Advanced

**Short answer:** Without it, queries with unknown fields silently match nothing. With strict, Mongoose ignores unknown fields. Mongoose 7+ defaults to true; setting it explicitly is future-proof.

---

## 8. Authentication — JWT + bcrypt

### Q: Why JWT, not server-side sessions? 🟡 Intermediate

**Short answer:**
- **JWT:** stateless — server doesn't store session data. Easy to scale across multiple backend instances.
- **Sessions:** server stores session ID → user mapping. Requires sticky sessions or a session store like Redis.

JWT is the modern default for stateless REST APIs.

### Q: What's actually inside a JWT? 🟡 Intermediate

**Short answer:** Three parts separated by dots: `header.payload.signature`
- **Header:** algorithm + type (`{alg: "HS256", typ: "JWT"}`)
- **Payload:** claims — this app puts `{id: userId, iat, exp}`
- **Signature:** HMAC-SHA256 of header+payload using `JWT_SECRET`

The payload is **base64-encoded, not encrypted** — anyone can read it. The signature is what proves the server issued it.

### Q: Why is the JWT_SECRET so long? 🔴 Advanced

**Short answer:** 64 random bytes (128 hex chars) = 512 bits of entropy. Brute-forcing the signature would take longer than the universe's age. The earlier placeholder (`your_super_secret_jwt_key_change_this_in_production`) was guessable and would let attackers forge tokens.

### Q: What if the JWT_SECRET leaks? 🔴 Advanced

**Short answer:** Catastrophe — anyone can mint valid tokens for any user.

**Mitigation:** rotate the secret immediately. Side effect: every existing JWT becomes invalid → all users logged out. They log in again with the same credentials. Their data is safe.

### Q: Why JWT_EXPIRE=7d? 🔴 Advanced

**Short answer:** Tradeoff between UX and security:
- Short expiry (1 hour) = safer but annoying (frequent re-login)
- Long expiry (30 days) = convenient but a stolen token stays valid longer
- 7 days = balanced for a portfolio app

Refresh tokens would let us have short access tokens + long refresh tokens, but that adds complexity.

### Q: How is the token verified on each request? 🟡 Intermediate

**Short answer:** [Backend/middleware/authMiddleware.js](Backend/middleware/authMiddleware.js):
1. Read `Authorization: Bearer <token>` header
2. `jwt.verify(token, JWT_SECRET)` — returns decoded payload or throws
3. `User.findById(decoded.id)` — load fresh user from DB
4. Attach `req.user` for downstream handlers

### Q: Why fetch the user from DB on every request? 🔴 Advanced

**Short answer:** The token only contains `id`. If the user was deleted or their role changed, we want to know now (not 7 days later when the token expires). Tradeoff: one extra DB query per request. Mitigation: User._id is indexed by default — sub-millisecond lookup.

### Q: Why no refresh token? 🔴 Advanced

**Short answer:** Adds significant complexity (token rotation, storage, revocation). 7-day access tokens are acceptable for a portfolio app. In a real product I'd implement refresh tokens with shorter access tokens (15 min) + longer refresh tokens (30 days, in httpOnly cookies).

---

## 9. Authorization — Roles + Ownership

### Q: What's the difference between Admin and Team Member? 🟢 Basic

**Short answer:**
- **Admin:** can update/delete any project. The first registered user is auto-Admin.
- **Team Member:** default role. Can be assigned to projects, work on tasks, but can't modify projects they don't own.

### Q: What's "mass assignment" and why is it dangerous? 🔴 Advanced

**Short answer:**

The bug: `Task.findByIdAndUpdate(id, req.body)` — accepts any field from the request. An attacker sends `{createdBy: someoneElsesId}` and overwrites the task's owner.

The fix: whitelist allowed fields. The `pickFields` helper in [Backend/controllers/taskController.js](Backend/controllers/taskController.js) only lets `title`, `description`, `status`, `priority`, `dueDate`, `assignedTo` through. Trying to set `createdBy` or `project` is silently ignored.

### Q: Why ownership checks if we already have role middleware? 🔴 Advanced

**Short answer:** Defense in depth. Roles answer "what kind of user are you?" — but not "is this YOUR resource?". A Team Member shouldn't be able to delete another team member's task even if they have permission to use the task system at all.

### Q: What's the permission rule for tasks? 🟡 Intermediate

**Short answer:**
- **Update:** project member, task creator, task assignee, OR Admin
- **Delete:** task creator, project creator, OR Admin

Update is permissive (so anyone in the project can drag tasks). Delete is stricter (prevents accidental destruction).

### Q: Why is the first user auto-Admin? 🟡 Intermediate

**Short answer:** Bootstrapping problem — there's no Admin to grant Admin to anyone else. Auto-promoting the first user solves it.

> **Tradeoff:** Anyone who registers first becomes Admin. In production you'd seed an Admin via a migration script. For a portfolio demo, register yourself first.

---

## 10. Security Hardening

### Q: What does Helmet do? 🟡 Intermediate

**Short answer:** Sets security HTTP response headers:
- `X-Frame-Options: DENY` — prevents clickjacking
- `Strict-Transport-Security` — forces HTTPS
- `X-Content-Type-Options: nosniff` — stops MIME sniffing
- `X-DNS-Prefetch-Control` — disables DNS prefetch
- `Content-Security-Policy` — restricts what scripts can load

One-line install, huge security upgrade.

### Q: What does express-rate-limit prevent? 🟡 Intermediate

**Short answer:** Brute-force attacks. Without it, an attacker can try 1000s of password combos per second. With `windowMs: 15min, max: 10` on `/api/auth/login`, after 10 attempts from the same IP, they get HTTP 429 Too Many Requests for 15 minutes.

### Q: What's NoSQL injection? 🔴 Advanced

**Short answer:** Sending MongoDB operators in JSON to bypass auth:

```js
// Login form sends:
{ "email": {"$ne": null}, "password": {"$ne": null} }
// Mongoose query becomes:
User.findOne({ email: {$ne: null}, password: {$ne: null} })
// Returns the first user, regardless of password
```

`express-mongo-sanitize` strips any key starting with `$` or containing `.` from `req.body`/`req.query` before it hits the DB.

### Q: Why CORS whitelist instead of `cors()`? 🟡 Intermediate

**Short answer:** `cors()` with no args = `Access-Control-Allow-Origin: *` — any website can send authenticated requests to your API. With a whitelist, only `localhost:3000` and `togglenest.vercel.app` can. Prevents CSRF-like attacks where a malicious site fires requests using the user's existing session.

### Q: Why hide stack traces in production? 🟡 Intermediate

**Short answer:** Stack traces leak file paths (`/opt/render/project/src/Backend/server.js`), library versions, and internal logic. Attackers use this to find exploits. In prod we return `{message: "Internal server error"}` only.

### Q: How is HTTPS enforced? 🔴 Advanced

**Short answer:** Vercel and Render terminate TLS at their edge — every request to `togglenest.vercel.app` or `togglenest-api.onrender.com` is HTTPS automatically. Helmet adds `Strict-Transport-Security` so browsers refuse to downgrade.

### Q: What's CSRF and why isn't it a concern here? 🔴 Advanced

**Short answer:** Cross-Site Request Forgery — a malicious site triggers requests using your existing session.

JWT in localStorage is *not* automatically attached to cross-origin requests (browsers don't expose localStorage to other origins). So CSRF doesn't apply here. CSRF *is* a concern if you switch to httpOnly cookies — that's why the cookie approach also needs CSRF tokens.

---

## 11. API Design

### Q: Why REST? 🟢 Basic

**Short answer:**
- Simple, well-understood
- Browser-native (just fetch/axios)
- Stateless
- HTTP caching works

GraphQL is more flexible but heavier; for CRUD on 5 entities, REST is the right tool.

### Q: Why express-validator? 🟡 Intermediate

**Short answer:** Inputs from clients can't be trusted. express-validator adds declarative validation:

```js
body('email').isEmail()
body('password').isLength({ min: 8 })
  .matches(/[A-Za-z]/).matches(/[0-9]/)
```

Centralized in [Backend/middleware/validators.js](Backend/middleware/validators.js). On failure, returns 400 with field-level errors.

### Q: Why these HTTP status codes? 🟡 Intermediate

**Short answer:**
- **200 OK** — successful read/update
- **201 Created** — successful POST that created a resource
- **400 Bad Request** — validation failed
- **401 Unauthorized** — not logged in / invalid token
- **403 Forbidden** — logged in but not allowed
- **404 Not Found** — resource doesn't exist
- **429 Too Many Requests** — rate-limited
- **500 Internal Server Error** — backend bug

### Q: Why nested routes vs flat? 🔴 Advanced

**Short answer:** This API uses flat routes with query filters: `/api/tasks?project=:id`. Pros: simpler routing, easier to add filters. Nested (`/api/projects/:id/tasks`) would emphasize the parent-child relationship. Both are valid — flat was chosen for simplicity.

### Q: Why JSON, not protobuf/MessagePack? 🔴 Advanced

**Short answer:** JSON is human-readable, browser-native, debuggable in DevTools. Binary formats (protobuf, MessagePack) are smaller and faster but require special tooling. Not worth it for a CRUD API.

### Q: Why is the 401 response generic ("Invalid email or password")? 🔴 Advanced

**Short answer:** **Account enumeration prevention.** If we said "user not found" vs "wrong password", attackers could probe to discover which emails are registered. The same generic message for both reveals nothing.

---

## 12. Error Handling

### Q: How does the 401 redirect work? 🟡 Intermediate

**Short answer:** The axios response interceptor in [Frontend/src/utils/api.js](Frontend/src/utils/api.js) checks every response. On 401, it clears localStorage and redirects to `/login`. So expired/invalid tokens automatically log the user out.

### Q: Why are unhandledRejection and uncaughtException handled? 🔴 Advanced

**Short answer:**
- **unhandledRejection:** a Promise rejected without `.catch()`. Recent Node versions terminate the process if no handler exists.
- **uncaughtException:** a synchronous error not caught by try/catch. Default behavior is process exit.

We log them so we can see what blew up before the process restarts.

### Q: Why graceful shutdown? 🔴 Advanced

**Short answer:** When Render redeploys, it sends SIGTERM. If we exit immediately:
- In-flight requests get dropped (users see 502)
- DB connections hang (Atlas eventually times them out)

With graceful shutdown:
1. Stop accepting new requests
2. Wait for in-flight ones to finish
3. Close the DB connection
4. Exit cleanly

There's a 10-second timeout in case something hangs.

### Q: SIGTERM vs SIGKILL? 🔴 Advanced

**Short answer:**
- **SIGTERM:** "please shut down" — handleable, can be caught
- **SIGKILL:** "die now" — cannot be caught, OS terminates the process

Render sends SIGTERM first, waits 10s, then SIGKILL if the process hasn't exited. Our shutdown handler uses that window cleanly.

---

## 13. Performance

### Q: Why compression? 🟢 Basic

**Short answer:** Gzips response bodies. Reduces a 100KB JSON payload to ~20KB. Faster downloads, especially for users on slow connections.

### Q: Why disable source maps in production? 🟡 Intermediate

**Short answer:** Source maps let DevTools show the original (pre-bundled) source. In production, that exposes your code to anyone who opens DevTools. Setting `GENERATE_SOURCEMAP=false` ships only the minified bundle.

> **Tradeoff:** Stack traces in DevTools become unreadable for users — but also for attackers. Worth it.

### Q: What causes Render's cold start? 🟡 Intermediate

**Short answer:** Render's free tier sleeps services after 15 minutes of inactivity. First request after sleep takes ~30 seconds:
1. Render boots a new container (~10s)
2. Node starts (~2s)
3. App loads modules (~5s)
4. Mongoose connects to Atlas (~10s)
5. First request handled

### Q: How do you mitigate cold starts? 🔴 Advanced

**Short answer:**
1. **External pinger** — UptimeRobot hits `/health` every 5 min, never sleeps (free)
2. **Paid tier** — Render's $7/mo Starter never sleeps
3. **Accept and inform** — show "first visit may be slow" message

### Q: Why these specific Mongoose indexes? 🔴 Advanced

**Short answer:** Indexed the fields most queries filter on:
- `Task.project` — every Kanban load filters by project
- `Task.assignedTo` — "my tasks" queries
- `Notification.recipient` — every notification fetch
- `ActivityLog.user, createdAt` — descending for recent activity

Without indexes, these are full collection scans. With them, sub-millisecond.

### Q: How would you cache responses? 🔴 Advanced

**Short answer:** Three layers:
1. **HTTP cache headers** — for static endpoints (e.g., user profile)
2. **Redis** — for hot reads (project list, dashboard stats) with short TTL
3. **CDN** — already in place via Vercel for the static frontend

Currently no caching layer. For portfolio scale, the DB queries are fast enough.

---

## 14. Deployment

### Q: Why Vercel + Render + Atlas (3 hosts)? 🟡 Intermediate

**Short answer:**
- **Vercel:** best free tier for static React apps, global CDN, instant deploys
- **Render:** best free tier for Node web services
- **Atlas:** best free tier for MongoDB, native to MongoDB Inc.

Could've put everything on Render to simplify, but Vercel's CDN is faster for static assets and the deploy DX is smoother.

### Q: Vercel vs Netlify? 🔴 Advanced

**Short answer:** Both excellent for static SPAs.
- **Vercel:** better Next.js support, slightly faster builds
- **Netlify:** better forms/edge functions

For CRA, either works. Vercel was chosen for the Next.js migration path if I ever take it.

### Q: Render vs Railway vs Fly.io? 🔴 Advanced

**Short answer:**
- **Render:** simplest dashboard, generous free tier (with cold sleep)
- **Railway:** better DX, $5 trial credit but then paid
- **Fly.io:** runs Docker, global edge, more complex setup

### Q: Why Atlas, not self-hosted MongoDB? 🟡 Intermediate

**Short answer:**
- Free tier (512MB)
- Automated backups
- Network security (IP whitelist)
- Built-in monitoring

Self-hosting = managing the box, OS updates, backups, security patches. Not worth the work for a portfolio.

### Q: What's vercel.json for? 🟡 Intermediate

**Short answer:** SPA rewrites. Without it, hitting `https://togglenest.vercel.app/dashboard` directly returns 404 (Vercel doesn't know that route — only React Router does). The rewrite says: "for any path, serve `index.html` and let React Router handle it."

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

### Q: Why the /health endpoint? 🟡 Intermediate

**Short answer:** Render's load balancer pings it to check if the container is alive. If `/health` stops responding, Render marks the container unhealthy and restarts it. Should be lightweight (no DB calls) so it's fast even under load.

### Q: Why was CORS_ORIGIN initially a placeholder? 🔴 Advanced

**Short answer:** Chicken-and-egg: backend needs frontend URL for CORS, frontend needs backend URL for API. Resolution:
1. Deploy backend with `CORS_ORIGIN=http://localhost:3000` (placeholder, lets local dev work)
2. Deploy frontend pointing to the now-live backend URL
3. Update backend's `CORS_ORIGIN` to include the new Vercel URL → triggers Render redeploy

### Q: Why comma-separated CORS_ORIGIN? 🔴 Advanced

**Short answer:** The code parses it into an array: `'http://localhost:3000,https://togglenest.vercel.app'.split(',')`. Lets dev (localhost) and prod (Vercel) both work simultaneously without redeploying when switching contexts.

---

## 15. Production Practices

### Q: Why .env.example files? 🟢 Basic

**Short answer:** Documents required env vars without committing actual secrets. A new dev clones the repo, copies `.env.example` to `.env`, fills in real values. Standard practice.

### Q: Why a separate .env.production for CRA? 🟡 Intermediate

**Short answer:** CRA reads `.env.production` only during `npm run build` (production builds). Setting `GENERATE_SOURCEMAP=false` there disables source maps in the production bundle without affecting `npm start` (which uses `.env.development`).

### Q: Why is REACT_APP_API_URL required at startup? 🔴 Advanced

**Short answer:** If it's missing in production, the original fallback (`localhost:5000`) would silently fail — users see broken API calls. Throwing at startup makes the deploy fail loudly so you fix the env var before going live. **Fail loud, not silent.**

### Q: Why DB connection retry? 🟡 Intermediate

**Short answer:** Render's containers can race with Atlas's network — first connection might fail with a transient error. Retrying 3 times with 2-second delays gives Atlas time to respond. Without retry, the container would crash and Render would re-spin it (slower).

### Q: Why the `engines` field in package.json? 🟡 Intermediate

**Short answer:**
```json
"engines": { "node": ">=18.0.0" }
```
Render and Vercel read this to pick the Node version. Without it, they default to whatever's current — could break if they upgrade defaults to a Node version that doesn't support our code.

### Q: How are secrets managed? 🟡 Intermediate

**Short answer:**
- **Local:** in `.env` (gitignored)
- **Render:** Environment Variables panel
- **Vercel:** Environment Variables panel
- **Never in code, never in git.**

### Q: How would you set up CI/CD? 🔴 Advanced

**Short answer:** GitHub Actions on every PR:
1. Lint (`npm run lint`)
2. Typecheck (if TS)
3. Run tests
4. Build to catch compile errors

Vercel and Render auto-deploy on push to `main` already, so the CI just gates merges. For larger projects, add staging environment + manual production promotion.

---

## 16. Tradeoffs & What Would You Change

### Q: What would you improve if you rebuilt this? 🔴 Advanced

**Short answer:**
1. **TypeScript everywhere** — type safety, better refactoring, IDE support
2. **Vite over CRA** — faster dev, modern tooling
3. **@hello-pangea/dnd** — replace deprecated react-beautiful-dnd
4. **PostgreSQL** — relational entities (users-projects-tasks) fit better
5. **httpOnly cookies for JWT** — XSS-safe storage
6. **WebSocket layer** — push notifications, live Kanban updates
7. **Test suite** — at least integration tests for auth + task CRUD

### Q: Why no real-time WebSockets? 🔴 Advanced

**Short answer:** Activity log and notifications poll on page load. Push (WebSocket / Server-Sent Events) would need Socket.io or similar. Skipped because:
- Free Render tier limits long-lived connections
- Adds complexity (sticky sessions, reconnect logic)
- Polling is fine for portfolio-scale traffic

### Q: Why no test suite? 🔴 Advanced

**Short answer:** Honest answer — time tradeoff. Manual testing was prioritized over test coverage. The first thing I'd add is one happy-path integration test for auth + task CRUD using Jest + Supertest.

### Q: How would you scale this to 10K users? 🔴 Advanced

**Short answer:**
1. Move backend to paid tier (no cold sleeps, more CPU)
2. Add Redis cache for hot reads
3. Atlas tier upgrade with replica reads
4. Static assets already on CDN via Vercel
5. Background job queue for notifications (BullMQ + Redis)
6. Sentry for error tracking
7. Prometheus + Grafana for metrics

### Q: Where are the bottlenecks? 🔴 Advanced

**Short answer:** At current scale, none — the app is over-engineered for portfolio traffic. Future bottlenecks:
- `getProjects` has no pagination → loads ALL projects
- Activity log has no time-window filter → unbounded growth
- Notification fetch on every page (no caching)

### Q: What's the security weakness you'd fix first? 🔴 Advanced

**Short answer:** **JWT in localStorage.** XSS lets any malicious script steal the token. Fix: switch to httpOnly + same-site=strict cookies. Requires backend changes (cookie-parser, set-cookie header) and CSRF token handling.

### Q: Best architectural decision? 🔴 Advanced

**Short answer:** The middleware order in [Backend/server.js](Backend/server.js) — helmet → compression → morgan → body parser → mongoSanitize → cors → routes → 404 → error handler. Each piece has a clear job and runs in the right order. Textbook Express.

### Q: Worst architectural decision? 🔴 Advanced

**Short answer:** Using react-beautiful-dnd despite knowing it's unmaintained. Should've used @hello-pangea/dnd from the start. The signal of "removed StrictMode for drag-drop" in commit history is a yellow flag in code review — it's compensating for a library bug.

### Q: How would you onboard a new dev to this codebase? 🔴 Advanced

**Short answer:**
1. Have them read [README.md](README.md) — features, setup, deploy
2. Walk through the request flow: frontend → axios → Express → middleware chain → controller → Mongoose → MongoDB
3. Pair on a small feature (e.g., add a task tag field) — touches Mongoose schema, controller, route, frontend form
4. Have them write a test for a controller they didn't touch — forces them to read code

---

## End of Q&A

That's ~90 Q&A pairs across 16 sections. Quick study tips:

1. **Read top to bottom once** to absorb the structure
2. **Spot-check the file references** by clicking through to actual code — this is what makes answers credible
3. **Practice answering 🔴 questions out loud** — those are the ones interviewers dig into
4. **For "why X not Y" questions, always have one concrete tradeoff ready** — not just "X is better"

Good luck with the interviews! 🚀
