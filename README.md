# DishNow 🍽️

[![Nuxt](https://img.shields.io/badge/Nuxt-3.6.5-00DC82?style=for-the-badge&logo=nuxt.js)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-0.16.0-FF6B35?style=for-the-badge&logo=pocketbase)](https://pocketbase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![XState](https://img.shields.io/badge/XState-4.38.2-2C3E50?style=for-the-badge&logo=xstate)](https://xstate.js.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0-FBF0DF?style=for-the-badge&logo=bun)](https://bun.sh/)

A sophisticated full-stack recipe and dish sharing platform engineered with cutting-edge web technologies. DishNow empowers culinary enthusiasts to discover, create, and share recipes while fostering a vibrant community through real-time interactions, advanced authentication, and seamless integrations.

## 🚀 Why This Project Matters

DishNow exemplifies modern full-stack development excellence, showcasing proficiency in:

- **Full-Stack Architecture**: Seamless integration of Nuxt 3's server-side rendering with PocketBase's real-time backend
- **Type-Safe Development**: Comprehensive TypeScript implementation ensuring robust, maintainable code
- **State Management**: Advanced XState machines for complex form workflows and application state
- **User Experience**: Intuitive Vue 3 Composition API components with responsive Tailwind CSS styling
- **Data Integration**: Automated recipe scraping from multiple culinary platforms using Cheerio
- **Authentication & Security**: Secure user management with role-based access and middleware protection
- **Performance Optimization**: Nuxt's hybrid rendering for optimal loading speeds and SEO
- **DevOps Ready**: Containerized deployment with Docker and modern build tools

This project demonstrates the ability to architect scalable web applications, handle complex user interactions, and integrate diverse technologies into a cohesive, production-ready solution.

## ✨ Key Features

- **🔐 Secure Authentication**: User registration, login, and profile management with PocketBase
- **📝 Recipe Management**: Create, edit, delete, and share detailed recipes with step-by-step instructions
- **🍽️ Dish Discovery**: Browse and explore dishes with rich media support
- **⭐ Rating System**: Comprehensive rating and review functionality for recipes and dishes
- **❤️ Social Interactions**: Like, comment, and engage with community content
- **🔍 Advanced Search**: Powerful search capabilities across recipes, dishes, and users
- **📱 Responsive Design**: Mobile-first approach with adaptive layouts
- **🌐 Recipe Import**: Automated scraping from popular culinary sites (750g, Marmiton, Journal des Femmes, etc.)
- **⚡ Real-Time Updates**: Live notifications and dynamic content updates
- **🎨 Modern UI**: Sleek interface built with Nuxt UI and DaisyUI components

## 🏗️ Architecture Highlights

### Frontend
- **Nuxt 3**: Leverages server-side rendering, static generation, and API routes for optimal performance
- **Vue 3 Composition API**: Modern reactive programming with TypeScript for type safety
- **Nuxt UI + DaisyUI**: Consistent, accessible component library with Tailwind CSS
- **XState Machines**: Finite state machines for complex recipe creation workflows
- **VueUse**: Collection of essential Vue composition utilities

### Backend
- **PocketBase**: Open-source backend-as-a-service providing real-time database, authentication, and file storage
- **Custom API Routes**: Server-side endpoints for recipe scraping and data processing
- **Type Generation**: Automated TypeScript types from PocketBase schema

### Development & Deployment
- **TypeScript**: End-to-end type safety across the application
- **Bun**: High-performance JavaScript runtime for development and building
- **Docker**: Containerized deployment for consistent environments
- **ESLint/Prettier**: Code quality and formatting standards

## 📁 Project Structure

```
DishNow/
├── components/          # Reusable Vue components (DishCard, RecipeForm, etc.)
├── composables/         # Vue composables for shared logic
├── layouts/             # Nuxt layouts for different page types
├── machines/            # XState state machines
├── middleware/          # Authentication and route guards
├── pages/               # File-based routing (dishes, recipes, users)
├── pb_migrations/       # PocketBase database migrations
├── plugins/             # Nuxt plugins (PocketBase client)
├── public/              # Static assets
├── scripts/             # Database import/export utilities
├── server/              # Nuxt server API routes
│   └── api/            # Recipe scraping endpoints
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PocketBase (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dishnow.git
   cd dishnow
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Set up PocketBase**
   - Download and run PocketBase locally: `pocketbase serve`
   - Run migrations: Copy files from `pb_migrations/` to your PocketBase migrations folder
   - Update `POCKETBASE_URL` in your environment or `nuxt.config.ts`

4. **Generate types**
   ```bash
   bun run typegen
   ```

5. **Start development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Docker Deployment
```bash
# Build the image
docker build -t dishnow .

# Run the container
docker run -p 3000:3000 -e POCKETBASE_URL=your-pocketbase-url dishnow
```


### PocketBase Deployment
Deploy PocketBase separately to services like Railway, Render, or your own server.

## 📚 Learn More

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Guide](https://vuejs.org/guide/introduction.html)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [XState Documentation](https://xstate.js.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
