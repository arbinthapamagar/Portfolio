/**
 * Content seed — projects, hero copy and footer socials.
 *
 * Idempotent: projects are matched on their GitHub URL (the stable key) and
 * upserted, so re-running only refreshes copy. Retired entries listed in
 * REMOVE_TITLES are deleted.
 *
 *   node seedContent.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dbConnect from './src/db/index.js';
import { Project } from './src/models/project.model.js';
import { Hero } from './src/models/hero.model.js';
import { About } from './src/models/about.model.js';
import { Footer } from './src/models/footer.model.js';
import { Service } from './src/models/services.model.js';
import { Experience } from './src/models/experience.model.js';
import { Education } from './src/models/education.model.js';

dotenv.config();

const GH = 'https://github.com/arbinthapamagar';
const LINKEDIN_URL = 'https://www.linkedin.com/feed/';

// placeholder seed entries that are not real work
const REMOVE_TITLES = [
    /shopify\s*discount\s*app/i,
    /^portfolio backend$/i,
    /^shipos\s*—\s*shipping/i,
];

const PROJECTS = [
    {
        title: 'Ultron — Local Agentic AI & RAG System',
        description:
            'A fully offline AI assistant built from scratch: a LangGraph ReAct agent wired to ~60 tool modules (files, shell, git, GitHub, browser automation, vision, email, calendar, databases, a credential vault), a staged RAG pipeline over ChromaDB, wake-word voice I/O, and a Claude-Code-style coding agent — all driving local Ollama models, so nothing ever leaves the machine. Ships as a FastAPI backend with a React/TypeScript frontend plus a terminal CLI.',
        problemSolved:
            "Cloud assistants bill per token, cannot touch your filesystem, and ship your documents to someone else's server. Ultron closes that loop locally — an abliterated Qwen2.5-Coder 7B for reasoning, nomic-embed-text for embeddings, Chroma for persistence — so it reads, writes and runs code in your own workspace and answers from your own PDFs with citations. The RAG side is a seven-stage pipeline (contextualize → analyze → expand → MMR retrieve → rerank → assemble → reason) with per-intent k and character budgets, a heuristic follow-up rewriter that only pays for an LLM call when a turn actually references earlier context, and a reasoning trace streamed to the UI stage by stage. Memory is layered: episodic turns in SQLite, a knowledge graph, and durable learned facts extracted on a background thread so the reply is never blocked.",
        stack: ['Python', 'FastAPI', 'LangGraph', 'LangChain', 'ChromaDB', 'Ollama', 'React', 'TypeScript', 'Whisper', 'Playwright'],
        role: 'Solo developer',
        featured: true,
        order: 1,
        links: { github: `${GH}/BOT`, liveDemo: '' },
    },
    {
        title: 'Tempu — Women-First EV Ride-Sharing Platform',
        description:
            'A women-first EV ride-sharing platform for Nepal: a Node/Express + MongoDB backend covering trips, bidding, drivers, suppliers, subscriptions, wallets, withdrawals, emergency SOS and call logs; a React admin web app; a React Native driver/rider app; and a separate Python RAG microservice powering the in-app support assistant. The whole stack runs under Docker Compose with a Makefile front door.',
        problemSolved:
            'Support agents were answering the same fare, policy and help-article questions by hand, and a generic chatbot would have invented answers. I built the AI as an isolated FastAPI microservice the Node backend proxies to, so it can crash, restart or be swapped without touching the app. Embeddings are pinned to local Ollama bge-m3 while chat is provider-switchable between Gemini and local Ollama via one env var — meaning the "brain" can change without ever re-embedding the store. Getting there meant discovering the hard way that a healthy-looking average similarity score can hide total retrieval failure in a second language: nomic-embed-text scored *higher* on Hebrew than English yet returned recall@1 of 0/8, which no relevance threshold can rescue. bge-m3 fixed it. Every retrieved chunk is gated by a tuned relevance floor before it reaches the model, and the provider layer rotates across multiple API keys and fallback models on quota errors, remembering the last working combination.',
        stack: ['Node.js', 'Express', 'MongoDB', 'React', 'React Native', 'Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Gemini', 'Docker'],
        role: 'Software developer & AI',
        featured: true,
        order: 2,
        links: { github: `${GH}/Tempu`, liveDemo: '' },
    },
    {
        title: 'VIntuna — AI-Assisted E-Commerce Store',
        description:
            'A full-stack e-commerce platform with a complete storefront (catalog, search, cart, addresses, orders, reviews, dark mode, bottom-nav mobile shell) and a full admin console for products, categories, banners, featured shelves, discounts, orders, reviews and contact messages — plus an embedded AI chat widget for shoppers and local payment handling.',
        problemSolved:
            "A store is only as good as the operator's control panel, so the whole catalog, discount and merchandising surface is admin-editable rather than hard-coded. The backend is Express 5 on Mongoose with JWT access/refresh token rotation, OTP email verification and password reset through Resend, Cloudinary-backed image uploads via Multer, Helmet and CORS hardening, and a layered apiError / apiResponse / asyncHandler convention so every route fails the same way. The discount engine models tiered and category rules server-side so pricing stays authoritative at checkout instead of being recomputed on the client.",
        stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Cloudinary', 'Resend'],
        role: 'Solo developer',
        featured: true,
        order: 3,
        links: { github: `${GH}/VIntuna_Ecommerce`, liveDemo: '' },
    },
    {
        title: 'Accessibility Compliance Engine',
        description:
            'A TypeScript CLI that crawls a website in headless Chromium, audits it with axe-core, grades the result against a chosen legal standard (Israeli IS-5568 WCAG 2.0/2.2, the European EAA, or the ADA), explains each failure in plain Hebrew or English, works out whether the theme or a third-party app caused it, and emits an HTML/PDF report. Bulk mode scans a list of domains into a worst-first CSV and an aggregate research report.',
        problemSolved:
            'Accessibility scanners hand merchants a wall of unattributed violations, which is useless when the fault sits in an app you did not write. This engine fetches the raw server HTML alongside the rendered DOM and diffs them: identifying classes present server-side came from the theme, classes that only appear after JavaScript runs were injected by an app. That single trick lets the report say "this came from your popup app, not your theme" and lets every finding be classified auto-fixable, AI-fixable, manual or external — the number that decides whether the product is a fix tool or a nag. It also scans five representative pages rather than five thousand, because a 5,000-product store has about six templates and rescanning a template only re-finds the same defect.',
        stack: ['TypeScript', 'Node.js', 'Playwright', 'axe-core', 'SQLite'],
        role: 'Solo developer',
        featured: true,
        order: 4,
        links: { github: `${GH}/accessibility`, liveDemo: '' },
    },
    {
        title: 'Matat — Agency Portfolio CMS',
        description:
            'A bilingual (Hebrew/English) agency site where literally every section is database-driven: hero, about, projects, apps, team, gallery, clients, testimonials, section headings and footer. The React frontend renders whatever the API returns, and a full admin panel behind JWT auth manages all of it — including drag-and-drop image dropzones, per-record detail pages, an inbox for contact messages with read state, and an embedded AI chat assistant.',
        problemSolved:
            'The client needed to change copy, swap images and publish new case studies without a developer and without a redeploy, in two languages with opposite reading directions. So nothing is hard-coded: eleven Mongoose models each get a controller, and singleton sections (hero, about, footer) upsert one document while collections paginate. Images go through Multer to Cloudinary with the publicId stored alongside the URL, so replacing or deleting a record also cleans up the remote asset instead of leaking orphans. The same architecture is what this portfolio is built on.',
        stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Cloudinary', 'Vite'],
        role: 'Software developer',
        featured: false,
        order: 5,
        links: { github: `${GH}/Matat-portfolio`, liveDemo: '' },
    },
    {
        title: 'Bilingual Documentation Chatbot',
        description:
            'A Node/Express chatbot that answers questions about a product\'s documentation in whichever language you ask — Hebrew or English — with Claude-style threaded conversation history, live web search when the docs come up short, and a zero-dependency engine switch between the Anthropic API and a local Ollama model.',
        problemSolved:
            'Two constraints pulled in opposite directions: it had to run with no API bill during development, but be good enough to ship. So the engine is a runtime switch — Anthropic Claude when ANTHROPIC_API_KEY is present, local Ollama Mistral otherwise — behind one interface, meaning the same prompt path is exercised either way. Documentation is loaded once at startup and held in memory instead of re-read per request. Language is detected per question and the reply is pinned to it, so a Hebrew question never gets an English answer. Conversation history persists to disk as capped sessions (threads with titles) rather than one flat log, so context stays scoped to the topic. Web search is a hand-rolled DuckDuckGo HTML scraper using nothing but native fetch — no API key, no signup, no rate-limit ceiling.',
        stack: ['Node.js', 'Express', 'Anthropic API', 'LangChain', 'Ollama', 'JavaScript'],
        role: 'Solo developer',
        featured: false,
        order: 6,
        links: { github: `${GH}/ChatBot`, liveDemo: '' },
    },
    {
        title: 'URL Shortener with Click Analytics',
        description:
            'A rate-limited link shortener with a click-analytics dashboard: Express + MongoDB behind a React/Vite front end, both containerised with an nginx-served production build and a single `docker compose up --build` to bring the whole thing online.',
        problemSolved:
            'A public shortener is an open write endpoint, which makes abuse the first design problem rather than an afterthought — so rate limiting sits in dedicated middleware ahead of the create route. Each redirect records a click event separately from the URL document, which keeps writes cheap and lets analytics aggregate without touching the hot redirect path. The whole stack ships as Docker Compose services with the React build served by nginx, so local dev and a deployed instance run the same way.',
        stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'nginx', 'Vite'],
        role: 'Solo developer',
        featured: false,
        order: 7,
        links: { github: `${GH}/Assessment`, liveDemo: '' },
    },
    {
        title: 'Laravel E-Commerce Storefront',
        description:
            'A server-rendered e-commerce app on Laravel 13 with Blade and Livewire: product catalogue by category and brand, cart, checkout with payment handling, order history, user auth, addresses, and an admin area for products, categories and orders.',
        problemSolved:
            'Built to work inside a classic MVC framework rather than the SPA-plus-API pattern I default to, which meant learning where Laravel wants each responsibility: Eloquent relationships instead of hand-joined queries, resource controllers and route middleware (`guest`, auth) instead of bespoke guards, Blade component composition instead of React components, and Livewire for the interactive pieces so the cart updates without me writing a separate front end. The payoff is a much sharper sense of what a framework gives you for free versus what I had been rebuilding by hand in Express.',
        stack: ['Laravel', 'PHP', 'Blade', 'Livewire', 'MySQL'],
        role: 'Solo developer',
        featured: false,
        order: 8,
        links: { github: `${GH}/e-commerce`, liveDemo: '' },
    },
    {
        title: 'Embedded Shopify Admin App',
        description:
            'An embedded Shopify admin app on the React Router 7 template with Polaris and App Bridge: product listing, create and edit flows plus a customer table, all driven through the Shopify GraphQL Admin API with Prisma-backed session storage and generated API types.',
        problemSolved:
            'Working inside a host platform is a different discipline from owning the whole stack — the app renders inside Shopify\'s admin iframe, so navigation, toasts and modals go through App Bridge rather than the DOM, and the UI has to be Polaris to look native. Authentication is OAuth session-based with Prisma persisting shop sessions, and every data read is a typed GraphQL query against the Admin API with codegen keeping the types honest. Building it end to end covered the full app lifecycle: OAuth install, embedded routing, GraphQL mutations for writes, and the Docker image for deployment.',
        stack: ['React', 'React Router', 'Shopify Polaris', 'App Bridge', 'GraphQL', 'Prisma', 'Docker'],
        role: 'Solo developer',
        featured: false,
        order: 9,
        links: { github: `${GH}/shopify-learning-`, liveDemo: '' },
    },
    {
        title: 'Video Platform Backend',
        description:
            'A production-shaped REST backend for a video platform — users, videos and channel subscriptions — with JWT access/refresh authentication, Cloudinary media uploads through Multer, aggregation-based pagination, and a hardened Express 5 setup.',
        problemSolved:
            'This is where the backend conventions the rest of my projects reuse were worked out. Access and refresh tokens are separate with rotation and httpOnly cookies, so a leaked access token has a short life. Feeds are built with mongoose-aggregate-paginate-v2 so joins, filtering and paging happen in one aggregation pipeline in the database instead of over-fetching and slicing in Node. Uploads go to a local temp directory via Multer, then to Cloudinary, with the temp file cleaned up on both success and failure. Helmet, CORS, express-rate-limit and express-mongo-sanitize sit in front, and apiError / apiResponse / asyncHandler give every route one shape for success and one for failure.',
        stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Cloudinary', 'Multer'],
        role: 'Solo developer',
        featured: false,
        order: 10,
        links: { github: `${GH}/Arbeen_Backend`, liveDemo: '' },
    },
    {
        title: 'This Portfolio — Headless CMS & Site',
        description:
            'The site you are reading: an Express + MongoDB API where every section is a resource with its own model, controller and admin screen, and a React 19 front end built with Vite, Tailwind and Motion — scroll-linked hero parallax, an aurora background, magnetic buttons, a custom cursor, reveal-on-scroll sections and a shared-layout animated navbar.',
        problemSolved:
            'A portfolio that needs a redeploy to fix a typo will never get updated, so nothing here is hard-coded. Singleton sections (hero, about, footer) upsert a single document; collections (projects, experience, testimonials, clients, services) paginate; section headings are their own resource so even the labels are editable. The public page fetches all nine endpoints in one Promise.allSettled pass, so a single failing section renders empty instead of blanking the page. Auth carries the access token in both an httpOnly cookie and an Authorization header, because browsers drop secure cookies on http://localhost and dev should not need a workaround.',
        stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind', 'Motion', 'JWT', 'Cloudinary'],
        role: 'Solo developer',
        featured: false,
        order: 11,
        links: { github: `${GH}/Portfolio`, liveDemo: '' },
    },
    {
        title: 'Fundamentals & Practice Builds',
        description:
            'The deliberate-practice layer underneath everything above: a React fundamentals workbook (props, conditional and list rendering, controlled forms, hooks, lifting state) built as ~20 isolated components; a Laravel learning app covering sessions, gates and policies, mail, and file uploads; Mongoose data-modelling exercises schema-ing e-commerce, hospital and todo domains from scratch; and vanilla-JS DOM games — Rock Paper Scissors and Tic Tac Toe — written with no framework at all.',
        problemSolved:
            'Each of these exists to isolate one thing and get it wrong cheaply, before it matters in a real project. The data-modelling repos in particular were the turning point: modelling the same three domains by hand is what made relationships, references versus embedding, and index choices feel obvious rather than memorised — which is why the schemas in Tempu and VIntuna came together quickly. The vanilla-JS games are there for the opposite reason: knowing what React is actually doing for you is worth having built a UI without it.',
        stack: ['JavaScript', 'React', 'Node.js', 'Mongoose', 'Laravel', 'PHP', 'HTML', 'CSS'],
        role: 'Self-directed learning',
        featured: false,
        order: 12,
        links: { github: GH, liveDemo: '' },
    },
];

// skill groups, in display order — JavaScript / Node first, since that is the core
const SERVICES = [
    {
        title: 'Core — JavaScript & Node',
        description: 'Where most of my work lives.',
        details:
            'Every production system on this site is a Node service: Express on top of Mongoose, JWT access/refresh rotation with httpOnly cookies, Multer-to-Cloudinary uploads, and a layered apiError / apiResponse / asyncHandler convention so every route succeeds and fails in one predictable shape. On the query side I lean on aggregation pipelines rather than over-fetching and slicing in Node. TypeScript where the surface is worth typing — the accessibility engine is entirely TS.',
        highlights: [
            'Express + Mongoose APIs with JWT access/refresh rotation — the pattern behind this portfolio, VIntuna and the Matat CMS.',
            'Aggregation-pipeline pagination via mongoose-aggregate-paginate-v2, so joins and filtering happen in the database rather than in Node.',
            'A layered apiError / apiResponse / asyncHandler convention so every route has one success shape and one failure shape.',
            'TypeScript end to end on the accessibility engine: a Playwright + axe-core CLI with typed rule, standard and report modules.',
        ],
        icon: 'zap',
        items: ['JavaScript', 'Node.js', 'Express', 'REST APIs', 'JWT Auth', 'TypeScript'],
        order: 1,
    },
    {
        title: 'AI, Agents & RAG',
        description: 'Agentic systems and retrieval, built end to end.',
        details:
            'I build agentic and retrieval systems from the pipeline up rather than calling one endpoint. On the agent side: LangGraph ReAct loops with tool routing, confirmation gating on destructive tools, and layered memory (episodic in SQLite, a knowledge graph, and durable facts extracted off the hot path). On the retrieval side: a staged pipeline — contextualize, classify intent, expand into query variants, MMR retrieve, rerank, assemble, then answer — with per-intent k and character budgets, and a relevance floor so an off-topic question cites nothing instead of guessing. Embeddings stay local on Ollama so switching the chat provider never means re-embedding the store; chat itself is provider-switchable between Anthropic, Gemini and local models, with key and model rotation on quota errors.',
        highlights: [
            'Ultron: a LangGraph ReAct agent wired to ~60 tool modules, with confirmation gating on the destructive ones.',
            'A seven-stage RAG pipeline — contextualize, classify intent, expand, MMR retrieve, rerank, assemble, answer — with per-intent k and character budgets.',
            'A relevance floor tuned to the embedder\'s own score distribution, so an off-topic question cites nothing instead of inventing an answer.',
            'Measured retrieval per language and found nomic-embed-text scoring higher on Hebrew while returning recall@1 of 0/8; moved to bge-m3.',
            'Provider-switchable chat (Anthropic, Gemini, local Ollama) with key and model rotation on quota errors, while embeddings stay local so the store never needs re-embedding.',
        ],
        icon: 'sparkles',
        items: ['LangChain', 'LangGraph', 'ChromaDB', 'Ollama', 'FastAPI', 'Anthropic API', 'Gemini'],
        order: 2,
    },
    {
        title: 'Frontend',
        description: 'Interfaces that feel fast.',
        details:
            'React with Vite, Tailwind for the system, and Motion for anything that moves — scroll-linked parallax, shared-layout transitions, staggered reveals, pointer-tracked tilt. I care about the boring parts too: route-level code splitting, one data fetch shared across pages instead of per-route refetching, and respecting prefers-reduced-motion on a site this animation-heavy. React Native for the Tempu driver and rider apps.',
        highlights: [
            'This site: route-level code splitting, one shared data fetch across pages, and scroll-linked hero motion.',
            'Shared-layout transitions, staggered reveals and pointer-tracked 3D tilt with Motion — with prefers-reduced-motion respected.',
            'Bilingual Hebrew/English interfaces where RTL is a layout requirement, not a text direction afterthought.',
            'React Native for the Tempu driver and rider apps, and Vue 3 with shadcn-vue on TextMe.',
        ],
        icon: 'code',
        items: ['React', 'React Native', 'Tailwind CSS', 'Vite', 'Motion', 'HTML', 'CSS'],
        order: 3,
    },
    {
        title: 'Databases',
        description: 'Modelling, queries and migrations.',
        details:
            'Mostly MongoDB via Mongoose, where the interesting work is schema design: references versus embedding, what deserves its own collection, and which indexes the real query patterns need. Tempu was the test of that — trips, bidding, drivers, suppliers, wallets, withdrawals and support tickets across 25+ collections, with status history kept as its own records rather than a mutable field so a trip can actually be traced. Relational work in PostgreSQL and MySQL, Prisma where the schema should be the source of truth, and SQLite for local single-file stores.',
        highlights: [
            'Tempu: 25+ Mongoose collections covering trips, bidding, drivers, wallets and support, with status history kept as records rather than a mutable field.',
            'Schema design as the first step — references versus embedding, and indexes chosen from the real query patterns.',
            'Relational work in PostgreSQL and MySQL, including Prisma-backed Shopify session storage.',
            'SQLite for local single-file stores — the episodic memory layer in Ultron and the accessibility engine\'s scan ledger.',
        ],
        icon: 'database',
        items: ['MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL', 'Prisma', 'SQLite'],
        order: 4,
    },
    {
        title: 'E-commerce',
        description: 'Storefronts and platform apps.',
        details:
            'Embedded Shopify apps on the React Router template: OAuth install, Prisma-backed session storage, typed GraphQL Admin API queries with codegen, and Polaris plus App Bridge so navigation, toasts and modals behave natively inside the admin iframe. Beyond the platform, I have built storefronts from scratch — catalog, cart, checkout, orders and a server-authoritative discount engine — plus WooCommerce work, and a scanner that can tell a merchant whether a defect came from their theme or an installed app.',
        highlights: [
            'Embedded Shopify apps on the React Router and Remix templates with Polaris and App Bridge, so navigation and modals behave natively in the admin iframe.',
            'Typed GraphQL Admin API queries with codegen keeping the types honest against the schema.',
            'A Shopify voucher pipeline: webhook enqueues, a pg-boss worker generates the PDF with Puppeteer and delivers by SES or SMS, with order tags for idempotency.',
            'WooCommerce plugin work — shipment creation, order import and delivery-slip generation.',
            'A storefront scanner that diffs server HTML against the rendered DOM to tell a merchant whether a defect came from their theme or an installed app.',
        ],
        icon: 'box',
        items: ['Shopify', 'WooCommerce', 'Shopify GraphQL API', 'Polaris', 'App Bridge'],
        order: 5,
    },
    {
        title: 'Python, PHP & Laravel',
        description: 'Beyond the JavaScript stack.',
        details:
            'Python is where the AI work lives — FastAPI services, LangChain/LangGraph, local model orchestration. PHP and Laravel came from deliberately building inside a classic MVC framework instead of the SPA-plus-API pattern I default to: Eloquent relationships rather than hand-joined queries, resource controllers and route middleware, Blade composition, and Livewire for the interactive pieces. Worth it for knowing what a framework gives you for free versus what I had been rebuilding by hand.',
        highlights: [
            'Python for the AI layer: FastAPI services, LangChain and LangGraph, and local model orchestration on Ollama.',
            'Laravel across four production products at Matat — ShipOS, TextMe, MYLO and the voucher apps.',
            'Eloquent relationships, resource controllers and route middleware instead of the hand-rolled equivalents I had been writing in Express.',
            'Blade composition with Livewire for the interactive pieces, and a Laravel storefront built from scratch.',
        ],
        icon: 'terminal',
        items: ['Python', 'PHP', 'Laravel', 'Blade', 'Livewire'],
        order: 6,
    },
    {
        title: 'Tools & infra',
        description: 'Day to day workflow.',
        details:
            'Docker Compose for anything with more than one service, so local dev and a deployed instance start the same way — Tempu runs Node, Python and Mongo together behind a Makefile. nginx serving built frontends, Cloudinary for media with publicIds tracked so deletes clean up the remote asset instead of leaking orphans, Playwright for headless browser automation and scanning, Postman and Git for the everyday.',
        highlights: [
            'Docker Compose for anything multi-service — Tempu runs Node, Python and Mongo together behind a Makefile.',
            'nginx serving built frontends, with the React build and the API deployed as separate containers.',
            'Cloudinary with publicIds tracked alongside URLs, so deleting a record cleans up the remote asset instead of leaking orphans.',
            'Playwright driving headless Chromium for the accessibility scanner, and Puppeteer for PDF rendering in the voucher worker.',
        ],
        icon: 'wrench',
        items: ['Git', 'Docker', 'Cloudinary', 'Postman', 'Playwright', 'nginx'],
        order: 7,
    },
];

// work history at Matat. Highlights are the changes actually shipped (taken from
// the commit history on each product), not the product's full feature list.
const MATAT = {
    company: 'Matat Technology',
    companyUrl: 'https://matat.co.il/',
    location: 'Kathmandu, Nepal',
};

const EXPERIENCE = [
    /* One card per company. The five products used to be five separate cards,
       which read as five employers; they are now the products this one role was
       spent on, each keeping its own link. */
    {
        ...MATAT,
        title: 'Software Developer',
        period: 'Jul 2026 – Present',
        current: true,
        description:
            'Matat builds and runs e-commerce software for Israeli merchants — Shopify and Wix apps, a multi-carrier shipping backend, and a loyalty platform. I work across that portfolio in Laravel and Vue on one side and Remix and React on the other, mostly on merchant-facing features and the settings and diagnostics that sit around them.',
        products: [
            {
                name: 'TextMe',
                url: 'https://textme.co.il',
                summary:
                    'SMS marketing and back-in-stock notifications for Shopify and Wix stores. Laravel with Sanctum behind, Vue 3 and TypeScript in front.',
                highlights: [
                    'Took back-in-stock notifications from store-wide to per-variant, so a merchant can arm alerts on a single size or colour instead of the whole product.',
                    'Fixed restock scope settings silently persisting "all variants" — the save reported success while quietly discarding the narrower choice the merchant had just made.',
                    'Added collapsible variant rows and variant images to the product picker, so a 40-variant product stopped burying the rest of the page.',
                    'Rewrote the restock-notification block help text after watching people misread when the back-in-stock form actually appears.',
                ],
            },
            {
                name: 'ShipOS',
                url: 'https://shipos.co.il',
                summary:
                    'Multi-carrier shipping backend that creates shipments for WooCommerce, Shopify and Wix stores and dispatches them to Israeli carriers.',
                highlights: [
                    'Surfaced the ShipOS server IPs in the ip_blocked warning — merchants whose host firewalled our callbacks previously saw a dead integration with nothing to whitelist.',
                    'Put branch-pickup package requirements into settings, so carrier constraints show before a merchant enables the option rather than after a shipment is rejected.',
                    'Worked inside deliberately cache-and-lock-protected shipment creation on all four entry points, where weakening the guard reintroduces a duplicate-shipment race with real carrier charges attached.',
                ],
            },
            {
                name: 'Kedem Spa',
                url: 'https://kedemspahouse.com',
                summary:
                    'Embedded Shopify app (Remix, Polaris, App Bridge) that turns gift-voucher orders into PDF vouchers and delivers them — a Remix server that enqueues and a pg-boss worker that sends.',
                highlights: [
                    'Added S3 storage for generated voucher PDFs, so a voucher stays retrievable instead of existing only as an email attachment.',
                    'Added SMS delivery alongside email, so a recipient with a phone number and no inbox still receives their voucher.',
                    'Allowed staff to send an SMS manually regardless of opt-in — the automatic path respects consent, but support needed a deliberate override for customers who had asked directly.',
                    'Made the voucher balance line dynamic, so the PDF shows the real remaining balance rather than the original face value.',
                ],
            },
            {
                name: 'BeautyJaffa',
                url: 'https://beautyspa-jaffa.com',
                summary:
                    'The second storefront on the same voucher platform, where recipient details arrive as Hebrew-named line-item properties on the Shopify order.',
                highlights: [
                    'Reworked recipient extraction so the Hebrew line-item properties map correctly onto the voucher fields.',
                    'Handled the self-purchase case: a customer buying for themselves leaves the recipient fields empty, which previously produced a voucher addressed to nobody.',
                ],
            },
            {
                name: 'MYLO Loyalty Club',
                url: '',
                summary:
                    'Modular Laravel loyalty platform for retail businesses, with a JSON-schema-validated per-business settings layer and a Vue storefront widget.',
                highlights: [
                    'Fixed the loyalty banner rendering left-to-right on Hebrew storefronts — the "Log in now" link now inherits RTL direction, so the call to action reads correctly for the store\'s actual customers.',
                ],
            },
        ],
        /* The work lives on each product above, so the role keeps no flat list of
           its own — one merged column of eight lines hid which product each
           change belonged to. */
        highlights: [],
        techStack:
            'Laravel, PHP, Vue, TypeScript, Remix, React, Node.js, Prisma, PostgreSQL, MySQL, Shopify, WooCommerce, Wix, AWS S3, Docker',
        order: 1,
    },
    {
        ...MATAT,
        title: 'Software Developer Intern',
        // period and specifics to be confirmed — drafted, not invented as fact
        period: '',
        description:
            'The internship that led into the developer role: learning a production Laravel and Vue codebase from the inside, working to real tickets against real merchant data rather than to a tutorial.',
        highlights: [
            'Worked inside an existing production codebase — reading it, tracing a feature end to end, and changing it without breaking the parts already in merchants\' hands.',
            'Picked up the team\'s working practice: branches and pull requests, code review, and shipping in small reviewable pieces.',
            'Moved from supervised fixes to owning merchant-facing features, which is what turned the internship into the developer role above.',
        ],
        techStack: 'Laravel, PHP, Vue, JavaScript, MySQL, Git',
        order: 2,
    },

    /* Administration and documentation roles before the move into development.
       Periods are intentionally blank until confirmed — a guessed date on a CV
       is worse than no date. */
    {
        title: 'Admin Officer — Documentation',
        company: 'Kalinchok Manpower',
        location: 'Kathmandu, Nepal',
        period: '',
        description:
            'A foreign-employment recruitment agency, where every placement is a paper trail: demand letters, labour approvals, medicals, insurance, visas and tickets, each with its own issuing office and its own deadline. I ran the documentation side of that pipeline for outgoing candidates.',
        highlights: [
            'Prepared and checked candidate files end to end — passport, contract, medical report, insurance and visa paperwork — before submission, so files were not returned over a missing page.',
            'Compiled demand letters, job agreements and labour-approval submissions, and tracked each one through to approval rather than filing and hoping.',
            'Kept the applicant register current — stage, outstanding document, next deadline — so anyone could say where a candidate stood without opening the cabinet.',
            'Sequenced medical, insurance, embassy and ticketing steps in the order they actually depend on, instead of stalling on a step booked too early.',
            'Handled the agency\'s routine correspondence and kept the filing system fit for audit and repeat verification requests.',
        ],
        techStack: 'Documentation, Correspondence, Record Keeping, MS Excel, MS Word',
        order: 3,
    },
    {
        title: 'Admin Officer — Quotations & Tenders',
        company: 'Kalinchok Security Pvt. Ltd.',
        location: 'Kathmandu, Nepal',
        period: '',
        description:
            'A manned-guarding company that wins its work by bid. I prepared the quotations and tender submissions behind that — costing a deployment, assembling the legal documents a bid has to carry, and getting it in before the deadline closed.',
        highlights: [
            'Built service quotations from post counts, shift patterns and duty hours, so a price reflected the deployment it was actually paying for.',
            'Assembled tender and bid documents — company registration, PAN/VAT, tax clearance, experience certificates and rate sheets — and filed them against published deadlines.',
            'Tracked tender notices for relevant contracts and flagged the ones worth bidding, closing date attached.',
            'Maintained client contracts, renewal dates and guard deployment records, and raised monthly invoices from attendance.',
            'Ran day-to-day office administration: correspondence, filing, and the paperwork that follows a contract once it is won.',
        ],
        techStack: 'Tender Preparation, Quotations, Invoicing, Record Keeping, MS Excel',
        order: 4,
    },
    {
        title: 'Admin Officer',
        company: 'Sherpa Adventure Gear',
        companyUrl: 'https://www.sherpaadventuregear.com/',
        location: 'Kathmandu, Nepal',
        period: '',
        description:
            'An outdoor-apparel brand selling through dealers inside Nepal and overseas. I handled the purchase-order and dispatch side of that: raising the orders, getting them out through the couriers, and keeping dealers and the warehouse talking to each other.',
        highlights: [
            'Prepared and processed purchase orders for overseas dealers and for dealers inside Nepal, checking styles, quantities and rates before an order went out rather than after it was queried.',
            'Booked and tracked courier consignments, and prepared the dispatch paperwork each shipment had to travel with.',
            'Coordinated between dealers, the warehouse and production on order status, so a dealer chasing a delivery got an answer instead of being passed around.',
            'Kept purchase-order and dispatch records current — placed, in transit, delivered, pending — so the state of an order did not depend on who you asked.',
            'Followed up on outstanding orders and courier delays while there was still time to re-book or resequence around them.',
            'Worked with outsourcing vendors on job orders and reconciled issued against returned quantities on receipt.',
        ],
        techStack:
            'Purchase Orders, Courier Coordination, Dealer Coordination, Record Keeping, MS Excel',
        order: 5,
    },
];

const EDUCATION = [
    {
        title: 'Bachelor of Science (Hons) in Information Technology',
        institution: 'Texas College of Management and IT',
        affiliation: 'Affiliated with Lincoln University',
        location: 'Kathmandu, Nepal',
        period: 'Graduated 2026',
        kind: 'degree',
        status: 'Graduated',
        description:
            'Four-year honours degree covering programming fundamentals, data structures and algorithms, database systems, software engineering, operating systems, computer networks and web development, finished with a final-year project.',
        highlights: [
            'Final-year project: VIntuna, a full-stack e-commerce platform with an AI chat widget, admin console and a server-side discount engine.',
            'Database systems and data modelling — the relational grounding behind the PostgreSQL and MySQL work, and the reason schema design comes before code for me.',
            'Data structures and algorithms, operating systems and computer networks — the fundamentals that make debugging a race condition or a retrieval pipeline tractable rather than guesswork.',
            'Software engineering practice: requirements, version control, documentation and working to a spec rather than to a vibe.',
        ],
        techStack: 'JavaScript, Python, PHP, MySQL, HTML, CSS',
        order: 1,
    },
    {
        title: 'MERN Stack Training',
        institution: 'Broadway Infosys',
        location: 'Kathmandu, Nepal',
        period: '2024',
        kind: 'training',
        status: 'Completed',
        description:
            'Intensive hands-on training across the MERN stack — MongoDB, Express, React and Node — building the API-plus-SPA pattern end to end rather than following along with a finished tutorial.',
        highlights: [
            'Mongoose schema design: references versus embedding, indexes, and aggregation pipelines instead of over-fetching and filtering in Node.',
            'Express APIs with JWT access and refresh tokens, httpOnly cookies, and middleware for auth, validation and error handling.',
            'React with hooks, routing, controlled forms and lifted state, wired to a real API rather than mock data.',
            'File uploads through Multer to Cloudinary, and the deploy-and-env discipline that comes with running the two halves separately.',
        ],
        techStack: 'MongoDB, Express, React, Node.js, Mongoose, JWT, Cloudinary',
        order: 2,
    },
];

const seed = async () => {
    await dbConnect();

    for (const pattern of REMOVE_TITLES) {
        const { deletedCount } = await Project.deleteMany({ title: pattern });
        console.log(`removed ${deletedCount} project(s) matching ${pattern}`);
    }

    for (const project of PROJECTS) {
        // GitHub URL is the stable identity — title copy can change freely
        await Project.findOneAndUpdate(
            { 'links.github': project.links.github },
            { $set: project },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        console.log(`  ${String(project.order).padStart(2)}. ${project.title}`);
    }

    for (const service of SERVICES) {
        await Service.findOneAndUpdate(
            { title: service.title },
            { $set: { ...service, isActive: true } },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        console.log(`  skill group ${service.order}. ${service.title}`);
    }
    // drop any group the list above no longer covers
    const { deletedCount } = await Service.deleteMany({
        title: { $nin: SERVICES.map((s) => s.title) },
    });
    console.log(`removed ${deletedCount} stale skill group(s)`);

    for (const entry of EXPERIENCE) {
        await Experience.findOneAndUpdate(
            { title: entry.title },
            { $set: entry },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        console.log(`  role ${entry.order}. ${entry.title}`);
    }
    // clear out the placeholder rows the timeline shipped with
    const removedRoles = await Experience.deleteMany({
        title: { $nin: EXPERIENCE.map((e) => e.title) },
    });
    console.log(`removed ${removedRoles.deletedCount} stale experience entr(ies)`);

    for (const entry of EDUCATION) {
        await Education.findOneAndUpdate(
            { title: entry.title },
            { $set: { ...entry, isActive: true } },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        console.log(`  education ${entry.order}. ${entry.title}`);
    }
    const removedEdu = await Education.deleteMany({
        title: { $nin: EDUCATION.map((e) => e.title) },
    });
    console.log(`removed ${removedEdu.deletedCount} stale education entr(ies)`);

    // clear the invented counters ("10+ happy clients") so About falls back to
    // figures derived from the real content; admin-entered stats still override
    const about = await About.findOneAndUpdate(
        {},
        {
            $set: { title: 'Software developer — backend-leaning, agentic AI and RAG' },
            // clear the invented counters ("10+ happy clients") so About falls back
            // to figures derived from the real content; admin stats still override
            $pull: { stats: { label: /happy clients|projects shipped|years building/i } },
        },
        { returnDocument: 'after' }
    );
    console.log(about ? `about updated — ${about.stats.length} stat(s) left` : 'no about document');

    const hero = await Hero.findOneAndUpdate(
        {},
        {
            $set: {
                subtitle:
                    'Software developer building agentic AI, RAG systems and web platforms with Node, React and Python.',
            },
        },
        { returnDocument: 'after' }
    );
    console.log(hero ? 'hero subtitle updated' : 'no hero document — skipped');

    const footer = await Footer.findOneAndUpdate(
        {},
        { $set: { githubUrl: GH, linkedinUrl: LINKEDIN_URL } },
        { returnDocument: 'after' }
    );
    console.log(footer ? 'footer socials updated' : 'no footer document — skipped');

    await mongoose.disconnect();
    console.log(
        `content seed done — ${PROJECTS.length} projects, ${SERVICES.length} skill groups, ` +
        `${EXPERIENCE.length} roles, ${EDUCATION.length} education entries`
    );
};

seed().catch((err) => {
    console.error('Content seed failed:', err.message);
    process.exit(1);
});
