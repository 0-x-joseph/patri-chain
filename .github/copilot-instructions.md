# Copilot Instructions for Patrimoine Heritage App

## Project Overview

This is a Next.js 16 application for the Patrimoine Heritage Hackathon. The app is built with TypeScript, shadcn/ui components, and Tailwind CSS, with a custom color palette that supports both light and dark modes.

## Key Setup Details

### Technology Stack

- **Framework**: Next.js 16.2.1 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Component Library**: shadcn/ui
- **Node.js**: 24.x (managed via fnm)

### Color Palette (from guides.md)

**Light Mode:**
- Primary: #166534 (Green)
- Error: #B91C1C (Red)
- Background: #FFFFFF
- Text: #171717

**Dark Mode:**
- Primary: #4ADE80 (Light Green)
- Error: #F87171 (Light Red)
- Background: #1A1A1A
- Text: #F5F5F5

### Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── shared/         # Reusable components (StatusBadge, etc)
│   ├── layouts/        # Layout components (PublicLayout, SidebarLayout)
│   └── providers/      # Context providers (ThemeProvider)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # Constants (colors, layouts, etc)
```

## Development Guidelines

### Setup

Before running any npm/node commands, always set Node.js version:
```bash
fnm use 24
```

### Running Commands

- Development: `npm run dev`
- Build: `npm run build`
- Production: `npm run start`
- Lint: `npm run lint`

### Adding Components

To add new shadcn/ui components:
```bash
npx shadcn@latest add component-name
```

### Theme/Dark Mode

- Users can toggle theme with the `useTheme()` hook
- Theme preference is persisted to localStorage
- System preference is detected on first load
- All Tailwind colors use CSS variables defined in `src/app/globals.css`

### Component Guidelines

Follow the component structure from guides.md:
- **Status Badges**: Green (Verified), Red (Invalid), Yellow (Pending), Blue (Blockchain)
- **Layouts**: PublicLayout for public pages, SidebarLayout for authenticated users
- **Forms**: Use shadcn/ui Form component with React Hook Form
- **Buttons**: Default primary green, with hover states

### Page Structure

When creating new pages:
1. Create route folder in `src/app/`
2. Add `page.tsx` with proper exports
3. Use appropriate layout (PublicLayout or SidebarLayout)
4. Import shadcn/ui components as needed

Example:
```tsx
import { SidebarLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <SidebarLayout sidebar={<Sidebar />} title="Dashboard">
      <div>Content here</div>
    </SidebarLayout>
  );
}
```

## Important Notes

- All metadata should be updated in `src/app/layout.tsx`
- Global styles are in `src/app/globals.css` - don't override color variables
- The ThemeProvider must wrap all content for dark mode to work
- Use TypeScript for all files
- Follow ESLint configuration

## Connected Features

This project integrates with:
- Heritage artisan showcase pages
- Product management
- Admin dashboard
- User authentication (to be implemented)
- Heritage craft verification system

## Next Development Steps

1. Create authentication pages and logic
2. Build artisan dashboard with product management
3. Implement admin verification interface
4. Add API routes for backend integration
5. Create product detail and listing pages
6. Implement file upload for product images

---

Last updated: 2024
Project: Patrimoine Heritage Hackathon - Marrakech
