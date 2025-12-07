# TRAQ - Tree Risk Assessment

A cross-platform Tree Risk Assessment Qualified (TRAQ) application based on ISA standards. Built with Next.js and Capacitor for web, iOS, and Android deployment.

## Features

- Offline-first architecture with IndexedDB storage
- Cloud sync with Supabase backend
- Team collaboration with role-based permissions
- Photo capture and GPS location tagging
- Works as PWA, iOS app, and Android app

## Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Building for Web

```bash
# Standard Next.js build
npm run build

# Static export for hosting
npm run build:native
```

## Building for Mobile

### Android

```bash
# Build static assets
npm run build:native

# Sync to Android project
npx cap sync android

# Open in Android Studio
npx cap open android

# Or run directly (with Android SDK configured)
npx cap run android
```

### iOS (macOS only)

```bash
# Add iOS platform (first time)
npx cap add ios

# Build and sync
npm run build:native
npx cap sync ios

# Open in Xcode
npx cap open ios
```

## Environment Variables

Create `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
  app/             # Next.js App Router pages
  components/      # React components
    form/          # Assessment form components
    layout/        # Layout components (Header, etc.)
    sync/          # Sync status indicators
    team/          # Team management components
    ui/            # Shadcn UI components
  contexts/        # React contexts (Auth, Team, Sync)
  hooks/           # Custom React hooks
  lib/
    db/            # IndexedDB/Dexie setup
    native/        # Capacitor plugin wrappers
    supabase/      # Supabase client
  services/        # Business logic (sync, team)
  types/           # TypeScript type definitions

android/           # Android native project
ios/              # iOS native project (after cap add ios)
resources/        # Source icons for asset generation
```

## Capacitor Plugins

- @capacitor/camera - Photo capture
- @capacitor/filesystem - File storage
- @capacitor/geolocation - GPS location
- @capacitor/preferences - Key-value storage
- @capacitor/splash-screen - App splash screen
- @capacitor/status-bar - Status bar styling

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Production build |
| `build:native` | Static export for Capacitor |
| `lint` | Run ESLint |

## Database Schema

The app uses Supabase with these main tables:
- `profiles` - User profiles
- `teams` - Team organizations
- `team_members` - Team membership with roles
- `team_invites` - Pending invitations
- `assessments` - Tree assessments (header data)
- `assessment_targets` - Target information
- `assessment_tree_health` - Tree health observations
- `assessment_site_factors` - Site conditions
- `assessment_load_factors` - Load analysis
- `assessment_risk_ratings` - Risk calculations
- `photos` - Photo attachments

All tables have Row Level Security (RLS) policies for team-based access control.

## License

Private - All rights reserved
