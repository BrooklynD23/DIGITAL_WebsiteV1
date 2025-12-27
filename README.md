# DIGITAL @ Cal Poly Pomona Website

Official website for DIGITAL, the engineering club at Cal Poly Pomona. Built with Next.js 14, Tailwind CSS, and TypeScript.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Forms:** Formspree
- **Hosting:** Vercel
- **Icons:** Material Symbols Outlined

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/DIGITAL_WebsiteV1.git
   cd DIGITAL_WebsiteV1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This generates a static export in the `out/` directory.

## Project Structure

```
DIGITAL_WebsiteV1/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, navbar, footer)
│   ├── page.tsx            # Homepage
│   ├── about/              # About/Mission page
│   ├── contact/            # Contact form page
│   ├── team/               # Team members page
│   ├── projects/           # Projects pages
│   │   ├── page.tsx        # Projects showcase
│   │   └── [slug]/         # Dynamic project details
│   └── not-found.tsx       # Custom 404 page
├── components/
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── data/               # Site data (team, projects, config)
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
├── public/
│   └── images/
│       └── placeholders/   # Placeholder images
├── docs/                   # Documentation
└── tailwind.config.ts      # Tailwind configuration
```

## Configuration

### Formspree (Contact Form)

1. Create an account at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form endpoint
4. Update `lib/data/siteConfig.ts`:
   ```typescript
   formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
   ```

### Site Configuration

Edit `lib/data/siteConfig.ts` to update:
- Club name and description
- Contact information
- Social media links
- Meeting times and location

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy (auto-detects Next.js settings)

### Manual Deployment

1. Build the static export:
   ```bash
   npm run build
   ```
2. Deploy the `out/` directory to any static hosting service

## Documentation

See the `/docs` directory for detailed documentation:
- [Routes & Pages](docs/ROUTES.md) - Overview of all pages and routes
- [Maintainer Guide](docs/MAINTAINER_GUIDE.md) - How to update content and maintain the site

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

This project is maintained by DIGITAL @ Cal Poly Pomona.
