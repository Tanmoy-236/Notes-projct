# LifeFlow

A clean, offline-first productivity app built with **Expo**, **React Native**, and **TypeScript**.

LifeFlow brings tasks, notes, planning, calendar tools, notifications, search, and an AI-style productivity assistant into one workspace.

## Features

- 🏠 Dashboard with a quick overview of your day
- ✅ Task management with priorities, categories, due dates, and subtasks
- 📝 Notes with pinning, favorites, search, and AI-assisted actions
- 🤖 Productivity assistant for planning, summaries, ideas, and task creation
- 📅 Calendar and daily planner views
- 🔎 Universal search
- 🔔 Local notifications and activity state
- 🌙 Light, dark, and system-aware themes
- 💾 Local persistence with AsyncStorage
- 📱 Cross-platform Expo/React Native setup

## Tech Stack

- React 19
- React Native 0.86
- Expo 57
- TypeScript (strict mode)
- React Navigation
- AsyncStorage
- Expo Vector Icons

## Project Structure

```text
.
├── App.tsx                 # Application shell and main navigation
├── index.ts                # Expo entry point
├── src/
│   ├── components/         # Reusable UI components
│   ├── constants/          # Theme and sample data
│   ├── context/            # Global application state
│   ├── screens/            # App screens
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Storage and AI utilities
├── app.json                # Expo configuration
├── eas.json                # EAS build configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Requirements

- Node.js
- npm
- Expo-compatible development environment

### Install

```bash
npm install
```

### Start the development server

```bash
npm start
```

Then choose an available target from the Expo CLI, or use:

```bash
npm run android
npm run ios
npm run web
```

## Code Quality

The project uses strict TypeScript settings. Keep shared logic in `src/context` or `src/utils`, reusable UI in `src/components`, and screen-specific composition in `src/screens`.

When making changes:

1. Keep components focused and reusable.
2. Prefer typed data over `any`.
3. Avoid duplicated UI and state logic.
4. Keep persistent storage behind `StorageService`.
5. Preserve the existing offline-first behavior.

## License

See [LICENSE](./LICENSE).
