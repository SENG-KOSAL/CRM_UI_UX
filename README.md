# CRM Sales Force Automation (SFA) Mobile App

A modern, enterprise-level CRM Sales Force Automation mobile application built with React Native, Expo, and TypeScript. This app focuses on UI/UX workflow design for field sales representatives, featuring a complete daily sales workflow with offline-first mock data storage.

## ✨ Features

- **Complete Daily Workflow**: Login → BU Selection → AWS Selection → Open Stock → Start Session → Dashboard → Route Plan → Outlet Selection → Check-in → Load Programs → Create Sale → Check-out → Settlement → Close Session
- **Green-Themed Enterprise UI**: Inspired by modern logistics and fintech apps with glassmorphism cards, modern typography, soft shadows, and rounded layouts
- **Animated Transitions**: Smooth navigation with micro-interactions, loading states, and progress indicators
- **Offline-First**: WatermelonDB-like local storage using AsyncStorage for realistic mobile data flow simulation
- **Responsive Design**: Optimized for one-hand usability in real-world field environments
- **Reusable Components**: Modular UI components (cards, buttons, loaders, charts, etc.)

## 📁 Folder Structure

```
CRM-SFA/
├── App.tsx                  # Root entry point with splash screen
├── babel.config.js         # Babel config for decorators
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── app.json                # Expo configuration
├── src/
│   ├── theme/              # Design system (colors, typography, spacing)
│   ├── constants/          # Workflow steps and status enums
│   ├── database/           # Schema and AsyncStorage-based database layer
│   ├── mock/               # Seed data for mock API
│   ├── services/           # Mock API services with realistic delays
│   ├── hooks/              # Custom React hooks (auth, workflow)
│   ├── components/         # Reusable UI components
│   │   ├── GlassCard.tsx   # Glassmorphism card with animations
│   │   ├── KPICard.tsx     # Animated KPI with trend indicators
│   │   ├── StatusBadge.tsx # 10 status types with color coding
│   │   ├── SkeletonLoader  # Shimmer skeleton cards
│   │   ├── ProgressBar     # Animated spring progress
│   │   ├── AnimatedButton  # 4 variants with scale animation
│   │   ├── OutletProgress  # Outlet visit progress card
│   │   └── WorkflowIndicator # Step-by-step progress tracker
│   ├── navigation/         # Navigation configuration
│   │   ├── types.ts        # Type-safe navigation params
│   │   └── AppNavigator.tsx# Auth/Main stacks with custom tab bar
│   └── screens/            # 14 screens covering complete workflow
│       ├── LoginScreen.tsx
│       ├── BUSelectionScreen.tsx
│       ├── AWSSelectionScreen.tsx
│       ├── OpenStockScreen.tsx
│       ├── StartSessionScreen.tsx
│       ├── DashboardScreen.tsx
│       ├── RoutePlanScreen.tsx
│       ├── OutletSelectionScreen.tsx
│       ├── CheckInScreen.tsx
│       ├── LoadProgramsScreen.tsx
│       ├── CreateSaleScreen.tsx
│       ├── CheckOutScreen.tsx
│       ├── SettlementScreen.tsx
│       └── CloseSessionScreen.tsx
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd CRM-SFA

# Install dependencies
npm install

# Install expo-cli if not available globally
npm install -g expo-cli
```

### Running the App
```bash
# Start development server
npm start

# Options:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Press 'w' for web browser
# - Scan QR code with Expo Go app on physical device
```

### Web Build
```bash
# Export for web
npx expo export --platform web
# Output will be in /dist directory
```

## 🔑 Login Credentials

Use these demo credentials to access the app:

- **Username**: `sara.wijaya`
- **Password**: `password`

Alternative demo account:
- **Username**: `budi.hartono`
- **Password**: `password`

## 📱 Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Custom hooks + AsyncStorage
- **Navigation**: React Navigation v7 (Stack + Bottom Tabs)
- **UI Components**: Custom built with Reanimated animations
- **Local Storage**: AsyncStorage-based database (WatermelonDB-inspired)
- **Icons**: Text-based emojis for lightweight implementation
- **Animations**: Reanimated 2 + LinearGradient

## 🎯 Workflow Overview

1. **Authentication**: Login with demo credentials
2. **Business Unit**: Select your working area (Jakarta Pusat, Jakarta Selatan, Bandung, Surabaya)
3. **AWS Period**: Choose Active Working Sales period
4. **Open Stock**: Review current inventory levels
5. **Start Session**: Begin your daily work session
6. **Dashboard**: Central hub with KPIs and quick access
7. **Route Plan**: View today's visit schedule
8. **Outlet Selection**: Choose outlet to visit
9. **Check-in**: Record arrival time and location
10. **Load Programs**: Select active promotions for the outlet
11. **Create Sale**: Build cart, apply programs, auto-reduce stock
12. **Check-out**: Complete visit and record departure
13. **Settlement**: Reconcile cash, transfers, and expenses
14. **Close Session**: End your workday

## 💾 Data Model

The app simulates these entities locally:
- **Users**: Sales representatives
- **Business Units**: Geographic sales regions
- **AWS**: Active Working Sales periods
- **Outlets**: Retail stores to visit
- **Routes**: Daily visit plans
- **Sales**: Transaction records
- **Stock**: Inventory levels with auto-reduction
- **Settlements**: Daily financial reconciliation
- **Programs**: Promotions and discounts

## 🎨 Design System

- **Primary Color**: Green (#0F9D58) - enterprise/trust
- **Secondary Color**: Blue (#1A73E8) - information/actions
- **Accent Color**: Orange (#FF6D00) - highlights/calls-to-action
- **Status Colors**: Green (success), Yellow (warning), Red (error), Blue (info)
- **Typography**: Hierarchical system from H1 to caption
- **Layout**: Glassmorphism cards, soft shadows, rounded corners
- **Interactions**: Button scales, spring animations, fade-ins

## 📱 Screens

1. **Login** - Secure authentication
2. **BU Selection** - Choose business unit
3. **AWS Selection** - Select sales period
4. **Open Stock** - Inventory overview
5. **Start Session** - Session initialization
6. **Dashboard** - KPIs and quick actions
7. **Route Plan** - Daily schedule overview
8. **Outlet Selection** - Store selection with status
9. **Check-in** - Visit commencement
10. **Load Programs** - Promotion selection
11. **Create Sale** - Transaction building
12. **Check-out** - Visit completion
13. **Settlement** - Financial reconciliation
14. **Close Session** - Workday conclusion

## 🔧 Development

To modify or extend the app:

1. **Add new screens**: Create in `src/screens/` and register in navigation
2. **Modify theme**: Update colors, typography, or spacing in `src/theme/`
3. **Update workflow**: Modify steps in `src/constants/index.ts`
4. **Enrich mock data**: Edit `src/mock/seed.ts`
5. **Add components**: Create in `src/components/` and export from index
6. **Adjust navigation**: Update types and navigators in `src/navigation/`

## 📱 Supported Platforms

- iOS (via Expo Go or native build)
- Android (via Expo Go or native build)
- Web (responsive design)

## 📄 License

MIT

---

**Note**: This is a UI/UX focused prototype with mock data and simulated backend services. For production use, replace the mock API services with actual backend integrations while maintaining the same UI components and workflow structure.