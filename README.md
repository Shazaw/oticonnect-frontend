# OmahTI Frontend (Next.js)

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── (auth)/          # Authentication pages
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   └── profile/     # Profile setup page
│   ├── dashboard/       # Dashboard pages
│   ├── divisions/       # Division management pages
│   ├── events/          # Event management pages
│   ├── internal/        # Internal affairs pages
│   ├── oti-bersuara/    # OtiBersuara pages
│   └── rooms/           # Room booking pages
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── division/       # Division management components
│   ├── event/          # Event management components
│   ├── internal/       # Internal affairs components
│   ├── oti-bersuara/   # OtiBersuara components
│   └── room/           # Room booking components
├── lib/                # Utility functions and API clients
│   ├── auth.ts         # Authentication utilities
│   ├── api.ts          # API client
│   └── utils.ts        # General utilities
├── context/            # React context providers
│   ├── AuthContext.tsx
│   ├── DivisionContext.tsx
│   └── EventContext.tsx
├── styles/             # Global styles
│   ├── globals.css
│   └── theme.ts
└── types/              # TypeScript type definitions
    ├── auth.ts
    ├── division.ts
    └── event.ts
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_URL=https://oticonnect.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

3. Start the development server:
```bash
npm run dev
```

## Features

- Authentication with Google OAuth
- Role-based access control
- Division management
- Event management
- Room booking system
- OtiBersuara feedback system
- Internal affairs tracking
- Progress monitoring
- Calendar integration

## Dependencies

- Next.js
- React
- Material-UI
- Axios
- JWT Decode
- React Query
- React Hook Form
- Yup
- React Big Calendar
- React Google Login 