# KnowForge

**A scalable, architecture-first resource management platform designed for developer velocity.**

![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> **KnowForge** solves the problem of fragmented learning resources by providing a centralized, persistent dashboard for engineering teams. It transforms scattered links into a structured knowledge base, leveraging a decoupled architecture that prioritizes maintainability, type safety, and a premium user experience.

---

## Engineering Philosophy: App Architecture & Design Patterns

The codebase is structured around **Clean Architecture** principles, enforcing a strict separation of concerns between the Presentation, Domain, and Data layers.

### The Repository Pattern
To decouple the application logic from the underlying storage mechanism, we implemented the **Repository Pattern** in the Service Layer (`src/services/storage.ts`).
*   **Abstraction**: The React components and Hooks remain agnostic to *how* data is persisted. They interact with a high-level interface (`addResource`, `getResources`), not `localStorage` directly.
*   **Scalability**: This architectural decision allows for a seamless migration to a REST API, GraphQL, or Supabase backend in the future without refactoring a single UI component. The "Repository" simply swaps its implementation details.

### Component Composition
The UI is strictly separated into **Atoms** (buttons, inputs, modals) and **Features** (ResourceCard, ResourceList).
*   **Atomic Design**: Low-level UI components (`src/components/ui`) are built to be stateless and highly reusable, accepting variant props for styling flexibility.
*   **Composition**: Feature components compose these atoms to build complex interfaces, ensuring consistency across the application.

## 📂 Project Structure

```text
src/
├── components/          # 🎨 Presentation Layer
│   ├── ui/              # Atomic primitives (Button, Modal, Input)
│   ├── ResourceCard.tsx # Feature-specific visualization
│   └── FilterSidebar.tsx# Navigation and Filtering logic
├── services/            # 💾 Data Layer (Repository)
│   └── storage.ts       # Abstracted persistence logic
├── hooks/               # ⚡ Application Layer
│   └── useResources.ts  # Service composition & state management
├── types/               # 📐 Domain Layer
│   └── resource.ts      # TypeScript interfaces and unions
└── App.tsx              # 🚀 Application Entry & Layout
```

---

## 🎨 UX & Design System

KnowForge implements a **Glassmorphism** design language to create a sense of depth and hierarchy.
*   **Visual Hierarchy**: Semi-transparent layers (`backdrop-blur-xl`) and subtle border gradients are used to distinguish content without overwhelming the user.
*   **Optimistic UI**: The interface employs optimistic updates via **Sonner** toasts, providing immediate feedback for Create, Update, and Delete actions before the data creates a round-trip (conceptually), making the app feel instant.
*   **Micro-interactions**: **Framer Motion** is utilized for staggered list entries and hover states, reducing perceived load times and cognitive load through fluid continuity.

---

## 🛠️ Tech Stack

| Category | Technology | Why? |
| :--- | :--- | :--- |
| **Core** | **React 19** | For its declarative component model and robust ecosystem. |
| **Language** | **TypeScript** | For strict type safety, facilitating refactors and reducing runtime errors. |
| **Build Tool** | **Vite** | For instant HMR and optimized production bundling. |
| **Styling** | **Tailwind CSS 4** | For a constraint-based utility methodology that speeds up UI development. |
| **State/Forms** | **React Hook Form** | For performant, uncontrolled form validation without unnecessary re-renders. |
| **Motion** | **Framer Motion** | For declarative, physics-based animations that handle layout shifts gracefully. |
| **Icons** | **Lucide React** | For lightweight, consistent SVG iconography. |
| **Notifications** | **Sonner** | For stacking, highly customizable toast notifications. |
| **Utils** | **clsx / tailwind-merge** | To robustly handle conditional class name concatenation. |

---

## � Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Xenos-24/KnowForge.git
    cd knowforge
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Build for production:
    ```bash
    npm run build
    ```

---

## 🔮 Roadmap & Scalability

As we look toward V2, the architecture is primed for the following enhancements:

*   **Real-time Synchronization**: Migrating the repository layer to **Supabase** to enable real-time collaboration and multi-device sync.
*   **Comprehensive Testing Strategy**: Implementing Unit Tests with **Vitest** for business logic and E2E tests with **Playwright** for critical user flows.
*   **Role-Based Access Control (RBAC)**: Introducing user authentication to allow for team workspaces and granular permission levels (Admin vs. Viewer).
