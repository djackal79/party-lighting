# Party Lighting Site

This repository contains the source code for the {{LIGHTING_DOMAIN}} website, built with Astro and Cloudflare Pages.

## Infrastructure Setup

To make this site fully operational on Cloudflare, Carl needs to perform the following steps in the Cloudflare dashboard:

### 1. Cloudflare Pages & Custom Domain
- Connect this repository to a new Cloudflare Pages project.
- In the Pages project settings, add `{{LIGHTING_DOMAIN}}` as a Custom Domain. 
- Cloudflare will automatically provision the SSL certificates and the necessary CNAME/A records in the DNS settings.
- **Environment Variables**: In the Pages project settings, under `Settings > Environment variables`, add the following variable for Production (and Preview if needed):
  - `SUPABASE_SERVICE_KEY`: Set to the Supabase Service Role key (do **not** commit this to the repository).

### 2. Cloudflare Email Routing
Before publishing a contact address, you must set up email forwarding:
- In the Cloudflare dashboard for `{{LIGHTING_DOMAIN}}`, navigate to **Email > Email Routing**.
- Click "Get Started" to generate the required MX and TXT records (Cloudflare will add them to your DNS automatically).
- Set up a custom address: `hello@{{LIGHTING_DOMAIN}}`.
- Set the destination to your personal/business inbox.
- Verify the destination email address through the link Cloudflare sends.

### 3. Cloudflare Web Analytics (Cookieless)
Use Cloudflare's built-in, cookieless analytics to avoid needing a consent banner:
- In the Cloudflare dashboard, go to **Web Analytics**.
- Click **Add a site**.
- Select the `{{LIGHTING_DOMAIN}}` property.
- Note: Cloudflare Pages automatically injects the analytics snippet when connected via a custom domain. Ensure this is enabled in the Pages settings (`Settings > Web Analytics`).

## Development

Install dependencies:
```bash
npm install
```

Start the local server (static only):
```bash
npm run dev
```

To test the Pages Function locally, use Wrangler:
```bash
npm install -g wrangler
wrangler pages dev ./dist
```
