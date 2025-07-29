# 🧾 Modern Ticketing System

A modern, developer-friendly ticketing system built with Next.js App Router, featuring a clean black & white design inspired by Cal.com and Radix UI.

> Elegant. Fast. Extendable. Built for teams and developers.

---

## 📦 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 13+ (App Router), TypeScript   |
| Styling    | Tailwind CSS, Custom CSS Variables      |
| UI Components | Radix UI, Lucide React Icons         |
| State Management | React Hooks, useState/useEffect    |
| API Client | Axios with interceptors                |
| Animations | Subtle hover effects (Framer Motion removed) |
| I18n       | Multi-language support (16 locales)    |

---

## ✨ Features

### 🎫 **Core Ticketing System**
- ✅ **Dashboard** - Overview with statistics and recent tickets
- ✅ **Ticket Management** - Create, view, edit, and close tickets
- ✅ **Ticket Details** - Full ticket view with actions and history
- ✅ **All Tickets** - Comprehensive list with search and filtering
- ✅ **Status Tracking** - Open, closed, in-progress statuses
- ✅ **Priority Levels** - Low, medium, high priority support

### 👥 **User Management**
- ✅ **Users List** - View all users with search and filtering
- ✅ **User Profiles** - Detailed user information and statistics
- ✅ **Create User** - Add new users with role assignment
- ✅ **Edit User** - Modify user details and permissions
- ✅ **User Actions** - View profile, edit, and manage users

### 💬 **Messaging System**
- ✅ **Messages List** - View all conversations with search
- ✅ **Message Details** - Full conversation thread view
- ✅ **Compose Message** - Create new messages with recipients
- ✅ **Message Actions** - Reply, archive, delete, forward
- ✅ **Priority & Status** - Message priority and status tracking

### ⚙️ **Settings & Configuration**
- ✅ **Settings Dashboard** - Quick settings and account info
- ✅ **General Settings** - Company info, system preferences
- ✅ **Notifications Settings** - Email, push, in-app, SMS config
- ✅ **Security Settings** - Password, 2FA, sessions management
- ✅ **Theme Support** - Dark mode with high contrast design

### 🔐 **Authentication**
- ✅ **Login Page** - Modern authentication interface
- ✅ **OAuth Support** - Ready for external auth providers
- ✅ **Session Management** - Token-based authentication

### 🎨 **UI/UX Features**
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark Theme** - Elegant black & white design
- ✅ **Smooth Navigation** - Client-side routing with Next.js
- ✅ **Loading States** - Proper loading and error handling
- ✅ **Search & Filter** - Advanced filtering capabilities
- ✅ **Reusable Components** - Button, Card, Badge, Modal components

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mooncakeSG/Ticketing_System-.git
cd Ticketing_System-
```

### 2. Install dependencies

```bash
cd apps/client
npm install --legacy-peer-deps
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
apps/client/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── create/            # Create ticket form
│   ├── messages/          # Messaging system
│   ├── settings/          # Settings & configuration
│   ├── tickets/           # Ticket management
│   └── users/             # User management
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   └── ui/               # Base UI components
├── lib/                  # Utilities and API client
└── styles/               # Global styles
```

---

## 🎯 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Main dashboard with statistics |
| All Tickets | `/tickets` | List all tickets with filters |
| Ticket Detail | `/tickets/[id]` | Individual ticket view |
| Create Ticket | `/create` | New ticket form |
| Users List | `/users` | Manage all users |
| User Detail | `/users/[id]` | Individual user profile |
| Edit User | `/users/[id]/edit` | Edit user information |
| Create User | `/users/create` | Add new user |
| Messages | `/messages` | All conversations |
| Message Detail | `/messages/[id]` | Individual conversation |
| Compose Message | `/messages/compose` | New message form |
| Settings | `/settings` | Main settings dashboard |
| General Settings | `/settings/general` | System configuration |
| Notifications | `/settings/notifications` | Notification preferences |
| Security | `/settings/security` | Security settings |
| Login | `/auth/login` | Authentication page |

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in `apps/client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Peppermint
```

### API Integration

The system is designed to work with a Laravel backend but includes comprehensive mock data for standalone operation. Update `lib/api.ts` to connect to your backend.

---

## 🎨 Design System

### Color Palette
- **Primary**: Black (`#000000`) and White (`#ffffff`)
- **Gray Scale**: Various shades for UI elements
- **Accent**: Purple for highlights and active states

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold)

### Components
- **Button**: Multiple variants (primary, outline, ghost)
- **Card**: Consistent card layout with header, content, footer
- **Badge**: Status indicators with color coding
- **Modal**: Reusable modal components

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing (Open to any suggestions)

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Cal.com** - For UI/UX inspiration
- **Radix UI** - For component design patterns
- **Next.js Team** - For the amazing App Router
- **Tailwind CSS** - For the utility-first CSS framework
- **Peppermint** - Ticketing System
---

