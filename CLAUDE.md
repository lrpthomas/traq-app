# TRAQ Form App

## Overview
Progressive Web App for Tree Risk Assessment Qualified (TRAQ) form completion based on the ISA Basic Tree Risk Assessment Form (2017). Supports PDF form filling, custom report generation, and offline-first operation.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: IndexedDB via Dexie.js (offline-first)
- **PDF**: pdf-lib (form filling), custom report generation
- **PWA**: Serwist (service worker)
- **Mobile**: Capacitor (iOS/Android wrapper)

## Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home - assessment list
│   ├── layout.tsx                # Root layout with Header
│   ├── assessment/
│   │   ├── new/page.tsx          # New assessment
│   │   └── [id]/page.tsx         # Edit existing
│   └── settings/page.tsx         # App settings
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── form/
│   │   ├── AssessmentForm.tsx    # Main form with stepper
│   │   ├── FormField.tsx         # Field wrapper with tooltips
│   │   └── sections/             # Form section components
│   │       ├── HeaderSection.tsx
│   │       ├── TargetSection.tsx
│   │       ├── SiteFactorsSection.tsx
│   │       ├── TreeHealthSection.tsx
│   │       ├── LoadFactorsSection.tsx
│   │       ├── CrownBranchesSection.tsx
│   │       ├── TrunkSection.tsx
│   │       ├── RootsSection.tsx
│   │       ├── RiskCategorizationSection.tsx
│   │       └── MitigationSection.tsx
│   ├── layout/
│   │   └── Header.tsx            # App header with navigation
│   └── report/                   # Report components
├── lib/
│   ├── db/
│   │   └── index.ts              # Dexie database setup
│   ├── riskMatrix.ts             # Risk calculation matrices
│   ├── fieldHelp.ts              # Tooltip/help content
│   ├── pdfGenerator.ts           # PDF generation
│   └── utils.ts                  # Utility functions
├── types/
│   └── traq.ts                   # TypeScript interfaces (matches 2017 PDF)
├── hooks/
│   ├── useAssessment.ts          # Assessment CRUD operations
│   └── useMemory.ts              # Answer memory system
└── data/
    └── tree-species.csv          # Tree species dropdown data
```

## Form Structure (Matches ISA 2017 Form)

### Page 1 - Field Assessment
1. **Header**: Client, date, location, tree info, assessor
2. **Target Assessment**: Up to 4 targets with zones and occupancy
3. **Site Factors**: History, topography, soil, weather
4. **Tree Health**: Vigor, foliage, pests, species failure profile
5. **Load Factors**: Wind exposure, crown size/density
6. **Crown & Branches**: Defects, pruning history, failure assessment
7. **Trunk**: Defects, cavity, lean, failure assessment
8. **Roots & Root Collar**: Defects, failure assessment

### Page 2 - Risk Analysis
9. **Risk Categorization**: Multiple rows with Matrix 1 & 2 calculations
10. **Mitigation & Summary**: Options, residual risk, inspection interval

## Risk Matrix Logic
- **Matrix 1**: Likelihood of Failure × Likelihood of Impact → Failure & Impact
- **Matrix 2**: Failure & Impact × Consequences → Risk Rating
- **Overall Risk**: Highest individual risk rating from all rows

## Commands
```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Production build
npm run start            # Start production server

# Native Apps (Capacitor)
npm run build:native     # Build for native (static export)
npm run native:ios       # Build and open iOS project
npm run native:android   # Build and open Android project

# Utilities
npm run lint             # ESLint
npm run cap:sync         # Sync web assets to native projects
```

## Key Features
1. **Form Sections**: All ISA TRAQ form fields with tooltips/help from instructions
2. **Risk Matrices**: Auto-calculation with Matrix 1 & 2
3. **PDF Export**: Fill official TRAQ PDF form template
4. **Report Generation**: Custom PDF report
5. **Offline-First**: Full functionality without internet via IndexedDB
6. **Answer Memory**: Toggle to remember values per field
7. **Progressive Navigation**: Step-by-step form with progress indicator

## Database Tables (Dexie/IndexedDB)
- `assessments`: Complete TRAQ assessments
- `media`: Photos/attachments (as blobs)
- `memory`: Remembered field values per field path
- `settings`: App configuration

## Conventions
- Components: PascalCase (e.g., `TreeHealthSection.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAssessment.ts`)
- Types: PascalCase matching ISA form terminology
- Use `cn()` utility for conditional classNames
- All form fields wrapped with `<FormField>` for tooltips
- Offline-first: Always save to IndexedDB

## PDF Template
Place the official ISA TRAQ PDF form at: `public/templates/traq-form.pdf`

The PDF field names need to be mapped in `src/lib/pdfGenerator.ts`. Run the generator
and check console logs to see available field names from the PDF.
