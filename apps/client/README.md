# Peppermint - Modern Ticketing System

A modern, elegant ticketing system built with Next.js 13 App Router, Tailwind CSS, and Framer Motion.

## Features

### 🎨 Design
- **Dark, elegant theme** with high contrast black & white design
- **Minimalist UI** inspired by Cal.com and Radix UI
- **Smooth animations** using Framer Motion
- **Responsive design** that works on all devices

### 📱 Pages
- **Dashboard** (`/`) - Overview with stats and recent tickets
- **Ticket List** (`/tickets`) - All tickets with search and filtering
- **Ticket Detail** (`/tickets/[id]`) - Individual ticket view with actions
- **Create Ticket** (`/create`) - Form to create new tickets

### 🧩 Components
- **TicketCard** - Animated ticket cards with hover effects
- **MainLayout** - Shared layout with sidebar and top navigation
- **Button, Card, Badge** - Reusable UI components
- **Sidebar & TopNav** - Navigation components

### 🔧 Technical Features
- **Next.js 13 App Router** for modern routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **TypeScript** for type safety
- **Radix UI** components for enhanced UX

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:5003/api/v1
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The app expects a REST API with the following endpoints:

- `GET /api/v1/tickets` - Get all tickets
- `GET /api/v1/tickets/:id` - Get single ticket
- `POST /api/v1/tickets` - Create new ticket
- `PUT /api/v1/tickets/:id` - Update ticket
- `PATCH /api/v1/tickets/:id/close` - Close ticket
- `PATCH /api/v1/tickets/:id/reopen` - Reopen ticket

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Dashboard
├── globals.css        # Global styles
├── create/
│   └── page.tsx      # Create ticket form
└── tickets/
    ├── page.tsx      # Tickets list
    └── [id]/
        └── page.tsx  # Ticket detail

components/
├── ui/               # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── badge.tsx
├── layout/           # Layout components
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   └── TopNav.tsx
└── TicketCard.tsx    # Ticket card component

lib/
├── api.ts           # API utilities
└── utils.ts         # Utility functions
```

## Customization

### Theme Colors
The app uses CSS custom properties for theming. Modify the variables in `app/globals.css` to change colors.

### API Configuration
Update the API base URL in `lib/api.ts` to point to your backend.

### Adding New Features
- Create new pages in the `app/` directory
- Add new components in the `components/` directory
- Extend the API utilities in `lib/api.ts`

## Technologies Used

- **Next.js 13** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible UI primitives
- **Axios** - HTTP client
- **TypeScript** - Type safety
- **Lucide React** - Icon library

## License

This project is part of the Peppermint ticketing system. 