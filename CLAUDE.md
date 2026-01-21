# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ActivaGas is a React Native mobile application (v0.76.5) for managing gas station operations. It's a cross-platform app (iOS and Android) with NFC/HCE support for device validation.

## Build & Development Commands

```bash
# Install dependencies (uses Bun)
bun install

# Start Metro bundler
npm start

# Run on platforms
npm run android
npm run ios

# Code quality
npm run lint     # ESLint
npm test         # Jest tests
```

**Prerequisites**: Complete React Native environment setup before running. Node >= 18 required.

## Architecture

### Tech Stack
- **State**: Redux Toolkit with 19 slices (`src/Redux/`)
- **Server State**: TanStack React Query
- **API**: GraphQL via graphql-request (`https://api.activagas.com/graphql/`)
- **Navigation**: React Navigation (bottom tabs + stacks)
- **Forms**: Formik + Yup with JSON-based dynamic form configurations
- **UI**: React Native Paper (Material Design)

### Source Structure (`src/`)

- **App.tsx / HandlerApp.tsx** - Entry points; loading screen and main router with device validation
- **Screens/** - UI screens organized by feature (Accounting, Activation, Client, Dashboard, Login, Stock, etc.)
- **Components/** - Reusable components in 18 subdirectories
- **Services/** - GraphQL query/mutation hooks organized by domain (Login, Activation, Stock, etc.)
- **Redux/** - Store configuration, slices in `states/`, interfaces in `interfaces/`
- **Routes/** - Role-based routing (RoutesAccounting, RoutesClient, RoutesGasera, RoutesMaintenance, etc.)
- **Hooks/** - Custom hooks including `useGraphQlQuery`, `useGraphQlMutation`, `useNfcValidation`
- **DataForms/** - JSON form schema definitions for dynamic form rendering
- **Config/** - GraphQL client initialization
- **Catalogs/** - Constants including role IDs (IDACCOUNTING, IDACTIVATORS, IDCLIENT, IDGASERA, IDMAINTENANCE, IDSERIAL, IDVERIFICATIONUNIT)
- **Utils/** - Router validation logic, error handling, image utilities

### Key Patterns

- **Role-Based Access Control**: Multiple user roles with role-specific screens and routing
- **JWT Authentication**: Token refresh mechanism with automatic expiration handling in `routerValidation.tsx`
- **NFC/HCE**: Device validation via NFC before showing main UI
- **Dynamic Forms**: Form configurations in `DataForms/` rendered by components in `Components/DynamicForms/`
- **GraphQL Hooks**: Custom hooks wrapping React Query for API calls

### External Services
- GraphQL API: `https://api.activagas.com/graphql/`
- Assets: `https://activagas-files.s3.amazonaws.com/`

## Platform-Specific

- **iOS**: CocoaPods (`ios/Podfile`), run `pod install` in `ios/` after adding native dependencies
- **Android**: Gradle build system in `android/`

## React Compiler

This project uses the experimental React Compiler via `babel-plugin-react-compiler` for automatic optimizations.
