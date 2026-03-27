# Patrimoine Heritage App

A modern Next.js application for artisans to showcase and manage their heritage crafts. Built with TypeScript, shadcn/ui, and Tailwind CSS with a custom color palette supporting light and dark modes.

## 🎨 Design System

The application follows design guidelines from `guides.md` with:

### Color Palette

**Light Mode:**
- Primary: `#166534` (Green)
- Error: `#B91C1C` (Red)
- Background: `#FFFFFF` (White)
- Text Primary: `#171717` (Black)

**Dark Mode:**
- Primary: `#4ADE80` (Light Green)
- Error: `#F87171` (Light Red)
- Background: `#1A1A1A` (Dark)
- Text Primary: `#F5F5F5` (Light)

### Components

Core components from shadcn/ui:
- Button, Card, Input, Form, Label
- Select, Textarea, Dialog
- Badge, Alert, Tabs
- Table, Avatar, Skeleton
- And more...

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles with Tailwind config
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components (StatusBadge, etc)
│   ├── layouts/          # Layout components
│   └── providers/        # Theme provider and other providers
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 24+ (using fnm)
- npm 10+

### Setup

1. Install Node.js version:
```bash
fnm use 24
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## 🌓 Dark Mode

The application automatically:
- Detects system theme preference
- Remembers user's theme choice in localStorage
- Provides theme context via `useTheme()` hook

To toggle theme in your components:

```tsx
import { useTheme } from '@/components/providers/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle Dark Mode</button>;
}
```

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## 🛠️ Development

### Adding New Components

Use shadcn/ui CLI to add components:

```bash
npx shadcn@latest add component-name
```

### Creating New Pages

Create new files in `src/app/` following Next.js App Router conventions:

```
src/app/
├── page.tsx              # Home page
├── dashboard/
│   └── page.tsx          # /dashboard route
└── profile/
    └── [id]/
        └── page.tsx      # /profile/[id] route
```

### Using Layouts

```tsx
import { SidebarLayout } from '@/components/layouts';

export default function DashboardPage() {
  return (
    <SidebarLayout 
      sidebar={<Sidebar />}
      title="Dashboard"
    >
      <YourContent />
    </SidebarLayout>
  );
}
```

## 📚 Key Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** with custom colors
- **shadcn/ui** component library
- **Light/Dark Mode** support
- **Responsive Design** for all devices
- **ESLint** configuration
- **Optimized Fonts** with next/font

## 🎯 Next Steps

1. Update `src/app/layout.tsx` metadata with your app detailsgit
2. Create feature-specific pages in `src/app/`
3. Build custom components in `src/components/`
4. Add API routes as needed in `src/app/api/`
5. Implement authentication logic
6. Connect to backend APIs

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

This project is part of the Patrimoine Hackathon and follows the project's license terms.
