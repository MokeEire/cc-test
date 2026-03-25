# Political Representatives Lookup

A SvelteKit web app that lets users find their elected political officials and local government representatives by entering a US address.

## Features

- Address-based lookup of federal, state, county, and city officials
- Representative cards with photo, party affiliation, contact info, and social links
- Grouped by government level (Federal → State → County → Local)
- Quick-jump navigation between levels
- Responsive design with Tailwind CSS

## Setup

### 1. Get a Google Civic Information API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the **Civic Information API**
3. Generate an API key

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your key:

```
GOOGLE_CIVIC_API_KEY=your_api_key_here
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) — full-stack framework
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Google Civic Information API](https://developers.google.com/civic-information) — representative data

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── RepCard.svelte     # Individual representative card
│   │   └── RepGroup.svelte    # Group of cards by government level
│   └── types.ts               # TypeScript type definitions
└── routes/
    ├── +layout.svelte
    ├── +page.svelte            # Main search page
    ├── layout.css
    └── api/
        └── representatives/
            └── +server.ts      # API proxy endpoint
```

## Building for Production

```bash
npm run build
npm run preview
```
