# DDispatch — Logistics Driver Mobile App

A premium, high-fidelity React Native driver mobile application built with **Expo SDK 56** and **TypeScript**. The app covers the full driver shipment lifecycle end-to-end: browsing available delivery orders, accepting them, confirming pickups, navigating routes, and completing drop-off handovers.

---

## 🚀 How to Run

### Prerequisites
- **Node.js** v18+ and npm installed
- **Expo Go** app installed on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run start
```

### 3. Open the App
| Method | Instructions |
|--------|-------------|
| **Expo Go (Physical Device)** | Scan the QR code shown in your terminal with Expo Go |
| **iOS Simulator** | Press `i` in the terminal (requires Xcode) |
| **Android Emulator** | Press `a` in the terminal (requires Android Studio) |

---

## 📱 Screens & User Flow

### 1. Job Feed (Available Shipments)
- Lists all available delivery orders as richly detailed cards
- Each card displays: pickup city + address, drop-off city + address, priority badge (Standard / Express / Same-day), estimated distance, duration, and estimated payout
- **"Accept Shipment"** button on each card with a confirmation dialog
- Accepted jobs animate out of the feed and move to "My Jobs"
- A stats header shows the live count of available loads
- **Reset Demo** button allows reloading mock data for testing

### 2. My Jobs (Active Deliveries)
- Segmented tab controller: **Active** vs **Completed**
- Active tab lists jobs in `Accepted` or `Picked Up` status
- Completed tab lists all `Delivered` jobs as shipment history
- Action buttons advance the status with confirmation dialogs:
  - `Accepted` → **"Confirm Pickup"**
  - `Picked Up` → **"Confirm Delivery"**

### 3. Job Detail Screen
- Full order details: cargo description, notes, priority, payout
- **SVG Vector Map** with animated driver marker that moves along the route as status progresses
- Distance and duration metric pills
- **Step Tracker** — a vertical timeline showing delivery progress (Accepted → Picked Up → Delivered) with timestamps
- Route addresses with time windows
- Contact details for pickup and drop-off with call buttons
- Persistent bottom action drawer with context-sensitive status button

### 4. Navigation
- **Bottom Tab Bar** — Job Feed + My Jobs (with active job count badge)
- **Stack Navigator** — Pushes Job Detail screen from either tab
- Smooth slide-from-right transitions

---

## 🏗️ Architecture & Technical Decisions

### Project Structure
```text
ddispatch/
├── App.tsx                     # Root: SafeAreaProvider → NavigationContainer → AppNavigator
├── app.json                    # Expo configuration
├── index.ts                    # Expo entry point registration
├── src/
│   ├── theme/
│   │   └── colors.ts           # Design tokens — neon dark theme palette (19 tokens)
│   ├── data/
│   │   └── mockJobs.ts         # TypeScript interfaces + 5 realistic mock shipments
│   ├── store/
│   │   └── useJobStore.ts      # Zustand store — state + actions for full lifecycle
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Tab + Stack navigators with dynamic badge
│   ├── components/
│   │   ├── PriorityBadge.tsx   # Color-coded urgency badge component
│   │   ├── JobCard.tsx         # Shipment feed card with timeline visual
│   │   ├── MockMap.tsx         # SVG vector map with animated driver marker
│   │   └── StepTracker.tsx     # Vertical delivery progress timeline
│   └── screens/
│       ├── JobFeedScreen.tsx   # Available loads feed with animated exits
│       ├── MyJobsScreen.tsx    # Active + completed tabs with confirmations
│       └── JobDetailScreen.tsx # Rich detail view with map, tracker & contacts
```

### State Management: Zustand
Chose **Zustand** for its minimal API, zero boilerplate, and excellent TypeScript support. The store (`useJobStore.ts`) manages:

| Action | Description |
|--------|-------------|
| `acceptJob(id)` | Moves a job from `Available` → `Accepted`, records timestamp |
| `updateJobStatus(id, status)` | Advances status (`Accepted` → `Picked Up` → `Delivered`), records timestamps |
| `resetMockData()` | Reloads initial mock dataset for demo/testing |

**Data flow**: Components subscribe to slices of the Zustand store via hooks. State updates trigger re-renders only in subscribed components, keeping performance optimal.

### Navigation: React Navigation v7
- **Bottom Tab Navigator** — Two tabs with dynamic badge showing active job count
- **Native Stack Navigator** — Wraps tabs + job detail screen with native transitions
- Typed with `RootStackParamList` and `TabParamList` for full type-safety

### Edge Case Handling
- **Confirmation dialogs** on all status transitions (accept, pickup, delivery) to prevent accidental taps
- **LayoutAnimation** for smooth card removals and UI transitions
- **Safe area insets** applied to bottom action drawer (handles notched devices)
- **Empty states** with contextual messages and actions for both tabs
- **Job not found** error screen with back navigation
- **Guard against re-delivery**: Action buttons hidden for already-delivered jobs

### GPS Route Simulator (SVG)
Instead of requiring API keys that would fail in review, the app features a custom **SVG vector map** (`MockMap.tsx`):
- Mock city grid background with streets and highways
- Pickup → Drop-off route rendered as a gradient bezier curve
- **Animated pulsing driver marker** that moves along the route based on delivery status
- HUD overlay showing GPS status text
- Scale indicator for realism

---

## 🔮 What I Would Improve With More Time

1. **Real-Time GPS Integration** — Replace the SVG mock map with `react-native-maps` and track live driver position using `expo-location`
2. **Offline Persistence** — Add MMKV or SQLite for local caching so drivers can log pickups/deliveries without connectivity, syncing when back online
3. **Push Notifications** — Expo Push Notifications for real-time dispatch alerts when new jobs are posted or assignments change
4. **Backend API** — Build a Node.js/Express REST API with real database (PostgreSQL) to replace mock data, enabling real dispatcher↔driver coordination
5. **Authentication** — Add Firebase Auth or Auth0 for secure driver profiles and session management
6. **Biometric Handover** — Use `expo-camera` for proof-of-delivery photos and signature capture at drop-off
7. **Pull-to-Refresh** — Add pull-to-refresh on the job feed to simulate fetching new available loads from a server
8. **Unit & Integration Tests** — Add Jest tests for the Zustand store transitions and React Native Testing Library tests for screen interactions
9. **Accessibility** — Full VoiceOver/TalkBack support with proper labels and roles
10. **Analytics** — Track delivery completion times and driver performance metrics

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native (Expo SDK 56) |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) |
| State | Zustand v5 |
| Icons | @expo/vector-icons (Ionicons) |
| Graphics | react-native-svg |
| Styling | React Native StyleSheet |

---

## 📝 Tradeoffs

- **Mock data over backend**: Kept the app frontend-only with hardcoded mock data for simplicity and instant review without setup. The Zustand store is structured so swapping in API calls would be straightforward.
- **SVG map over real maps**: Avoids API key requirements and network dependencies during review. The animated SVG provides a visually rich alternative that demonstrates the UX concept.
- **Confirmation alerts over bottom sheets**: Used native `Alert.alert()` for status transitions. A production app would use a custom bottom sheet with richer UI, but alerts ensure reliable cross-platform behavior.
- **No auth**: Omitted per assignment scope. The navigation structure supports wrapping in an auth flow.
