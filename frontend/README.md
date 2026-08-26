# Portfolio — Frontend

React 19 + Vite + Tailwind 4, animated with [Motion](https://motion.dev).

## Run

```bash
npm install
npm run dev     # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:8000` (see `vite.config.js`), so start the
backend first. To point at a deployed API instead, set `VITE_API_URL`:

```bash
VITE_API_URL=https://api.example.com/api/v1 npm run build
```

## Structure

```
src/
  lib/api.js            axios instance + publicApi / adminApi
  context/AuthContext   admin session (token in localStorage)
  components/
    motion/             Reveal, TextReveal, Magnetic, Tilt, Marquee,
                        Counter, Parallax, Aurora, Cursor, ScrollProgress
    ui/                 SectionHeader, GlowButton, Loader, EmptyState, BrandIcons
    layout/             Navbar, Footer
    sections/           Hero, About, Skills, Projects, Experience,
                        Clients, Testimonials, Contact
    admin/              ResourceManager (generic CRUD), SingletonForm, Field, Toast
  pages/                Home, ProjectDetail, NotFound
  pages/admin/          Login, AdminLayout, Dashboard + one screen per resource
```

## Admin

`/admin/login` — signs in with the seeded admin, then every section of the public
site is editable at `/admin/*`. Content the admin has not filled in falls back to
sensible defaults, so the site never renders empty.

## Notes

- The backend sets `secure: true` cookies, which browsers drop on `http://localhost`.
  The frontend therefore stores the access token from the login response and sends it
  as `Authorization: Bearer`, which `auth.middleware.js` already accepts.
- All motion respects `prefers-reduced-motion`.
- Brand icons (GitHub, LinkedIn, …) are local inline SVGs in `ui/BrandIcons.jsx` —
  lucide-react v1 removed brand marks.
