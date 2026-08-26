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
import { Footer } from './src/models/footer.model.js';

dotenv.config();

const GH = 'https://github.com/arbinthapamagar';
const LINKEDIN_URL = 'https://www.linkedin.com/feed/';

// placeholder seed entries that are not real work
const REMOVE_TITLES = [/shopify\s*discount\s*app/i, /^portfolio backend$/i];

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
        role: 'Full-stack & AI engineer',
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
        role: 'Full-stack developer',
        featured: false,
        order: 5,
        links: { github: `${GH}/Matat-portfolio`, liveDemo: '' },
    },
    {
        title: 'ShipOS — Shipping & Logistics Platform',
        description:
            'The data layer and admin console for a multi-carrier shipping platform: 45+ Mongoose models covering orders and order items, shipments and shipping status history, delivery providers and provider settings, pickup locations and pickup-point status, licences and licence types, companies, customers and customer notes, recipients, packages, payment details, SMS templates and settings, webhook logs, API request logs, and bilingual English/Hebrew city and street registries. A React admin front end sits on top with dashboard, orders, shipments, companies, customers, licences, reports and settings views.',
        problemSolved:
            'Shipping is where a schema either holds up or collapses — every carrier has its own statuses, every order can split across packages, and audit trails are non-negotiable when a parcel goes missing. The work here was modelling that domain properly: status transitions kept as their own logged collections rather than a mutable field, webhook and API-request logs stored so a carrier integration can be replayed and debugged after the fact, provider settings separated from providers so credentials rotate independently, and city/street data held bilingually because addresses are entered in Hebrew but queried in English. It also integrates storefront sources — Shopify and Wix website models feed orders in.',
        stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'React', 'Vite', 'Cloudinary'],
        role: 'Backend & data modelling',
        featured: false,
        order: 6,
        links: { github: `${GH}/Ship`, liveDemo: '' },
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
        order: 7,
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
        order: 8,
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
        order: 9,
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
        order: 10,
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
        order: 11,
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
        order: 12,
        links: { github: `${GH}/Portfolio`, liveDemo: '' },
    },
    {
        title: 'Fundamentals & Practice Builds',
        description:
            'The deliberate-practice layer underneath everything above: a React fundamentals workbook (props, conditional and list rendering, controlled forms, hooks, lifting state) built as ~20 isolated components; a Laravel learning app covering sessions, gates and policies, mail, and file uploads; Mongoose data-modelling exercises schema-ing e-commerce, hospital and todo domains from scratch; and vanilla-JS DOM games — Rock Paper Scissors and Tic Tac Toe — written with no framework at all.',
        problemSolved:
            'Each of these exists to isolate one thing and get it wrong cheaply, before it matters in a real project. The data-modelling repos in particular were the turning point: modelling the same three domains by hand is what made relationships, references versus embedding, and index choices feel obvious rather than memorised — which is why the schemas in ShipOS and VIntuna came together quickly. The vanilla-JS games are there for the opposite reason: knowing what React is actually doing for you is worth having built a UI without it.',
        stack: ['JavaScript', 'React', 'Node.js', 'Mongoose', 'Laravel', 'PHP', 'HTML', 'CSS'],
        role: 'Self-directed learning',
        featured: false,
        order: 13,
        links: { github: GH, liveDemo: '' },
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

    const hero = await Hero.findOneAndUpdate(
        {},
        {
            $set: {
                subtitle:
                    'Full-stack developer building agentic AI, RAG systems and web platforms with Node, React and Python.',
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
    console.log(`content seed done — ${PROJECTS.length} projects`);
};

seed().catch((err) => {
    console.error('Content seed failed:', err.message);
    process.exit(1);
});
