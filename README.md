# LinearThemeLab

AI‑powered Shopify & WooCommerce theme generator with a Linear‑style dashboard.

## Tech stack

- Next.js 14 (App Router)
- Node.js + Express backend (`/server`)
- GitHub Copilot SDK (server‑side)
- Stripe (sandbox by default)
- AWS S3 for theme ZIP storage

## Setup

```bash
git clone <your-repo-url> LinearThemeLab
cd LinearThemeLab

# Install root deps (Next + shared)
npm install

# Install server deps
cd server
npm install
cd ..
