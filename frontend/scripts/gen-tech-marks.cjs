const si = require('simple-icons');
const fs = require('fs');

// item label (normalised) -> simple-icons slug
const MAP = {
  javascript: 'javascript', js: 'javascript',
  typescript: 'typescript', ts: 'typescript',
  nodejs: 'nodedotjs', node: 'nodedotjs',
  express: 'express',
  jwtauth: 'jsonwebtokens', jwt: 'jsonwebtokens',
  langchain: 'langchain', langgraph: 'langgraph',
  ollama: 'ollama', fastapi: 'fastapi',
  anthropicapi: 'anthropic', anthropic: 'anthropic',
  gemini: 'googlegemini',
  react: 'react', reactnative: 'react', reactrouter: 'reactrouter',
  tailwindcss: 'tailwindcss', tailwind: 'tailwindcss',
  vite: 'vite', motion: 'framer',
  html: 'html5', css: 'css',
  mongodb: 'mongodb', mongoose: 'mongoose',
  postgresql: 'postgresql', postgres: 'postgresql',
  mysql: 'mysql', prisma: 'prisma', sqlite: 'sqlite',
  shopify: 'shopify', woocommerce: 'woocommerce',
  shopifygraphqlapi: 'graphql', graphql: 'graphql',
  polaris: 'shopify', shopifypolaris: 'shopify', appbridge: 'shopify',
  python: 'python', php: 'php', laravel: 'laravel', blade: 'laravel',
  livewire: 'livewire',
  vue: 'vuedotjs', vuejs: 'vuedotjs', vue3: 'vuedotjs',
  wix: 'wix', remix: 'remix', puppeteer: 'puppeteer',
  git: 'git', docker: 'docker', cloudinary: 'cloudinary',
  postman: 'postman', nginx: 'nginx', resend: 'resend',
};

const slugs = [...new Set(Object.values(MAP))].sort();
const marks = {};
for (const slug of slugs) {
  const key = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
  const icon = si[key];
  if (!icon) throw new Error('missing slug: ' + slug);
  marks[slug] = { t: icon.title, h: icon.hex, p: icon.path };
}

const header = `/**
 * Brand marks for the tech chips, extracted from simple-icons (CC0) at author
 * time rather than imported at runtime — the package ships every one of its
 * ~3450 icons in a single 5MB module, which is not worth bundling for 30 logos.
 *
 * Regenerate with scripts/gen-tech-marks.cjs after adding a slug to ALIASES.
 * Each entry is { t: title, h: brand hex, p: 24x24 path }.
 */
`;

const body =
  'export const MARKS = ' +
  JSON.stringify(marks, null, 4).replace(/"([a-z0-9]+)":/g, '$1:') +
  ';\n\n' +
  'export const ALIASES = ' +
  JSON.stringify(MAP, null, 4).replace(/"([a-z0-9]+)":/g, '$1:') +
  ';\n';

fs.writeFileSync(process.argv[2], header + body);
console.log(`wrote ${slugs.length} marks, ${Object.keys(MAP).length} aliases`);
