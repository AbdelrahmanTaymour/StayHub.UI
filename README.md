# StayHub.UI

**A modern apartment booking platform built with Next.js and TypeScript.**

[Backend Repository](https://github.com/AbdelrahmanTaymour/StayHub.Backend) · [Frontend Repository](https://github.com/AbdelrahmanTaymour/StayHub.UI) · [Docker Image](https://hub.docker.com/r/ataymour/stayhub-backend)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-State_Management-FF4154?logo=reactquery&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-Real--time-512BD4?logo=dotnet&logoColor=white)

---

## Overview

StayHub.UI is the frontend application for StayHub, an apartment booking platform that enables guests to discover apartments, manage reservations, and communicate with apartment owners.

Built with Next.js App Router and TypeScript, the application features authenticated workflows, real-time messaging, bilingual English and Arabic interfaces, RTL/LTR layouts, and light and dark themes.

The frontend communicates with the dedicated [StayHub.Backend](https://github.com/AbdelrahmanTaymour/StayHub.Backend) API for business operations and persistent data.

## Screenshots

<details>
<summary><b>🔍 Discovery & Apartment Details</b></summary>

<br />

|                 Search Page                  |
| :------------------------------------------: |
| ![StayHub home page](docs/images/search.png) |

|                    Apartment Details                    |
| :-----------------------------------------------------: |
| ![Apartment details](docs/images/apartment-details.png) |

|                    Images Previewer                    |
| :----------------------------------------------------: |
| ![Apartment details](docs/images/images-previewer.png) |

</details>

<details>
<summary><b>📅 Guest Bookings & Localization</b></summary>

<br />

|                   Booking Details                   |            Bookings List (Arabic)             |
| :-------------------------------------------------: | :-------------------------------------------: |
| ![Booking Details](docs/images/booking-details.png) | ![Bookings List](docs/images/bookings-ar.png) |

</details>

<details>
<summary><b>💬 Real-time Messaging</b></summary>

<br />

|                Real-time Messaging                 |
| :------------------------------------------------: |
| ![StayHub conversations](docs/images/messages.png) |

</details>

<details>
<summary><b>🏢 Apartment Management</b></summary>

<br />

|                   Apartment List                   |
| :------------------------------------------------: |
| ![Apartment List](docs/images/apartments-list.png) |

|                   Manage Apartment (Details)                    |
| :-------------------------------------------------------------: |
| ![Manage apartment - Details](docs/images/manage-apartment.png) |

|                       Manage Apartment (Photos)                       |
| :-------------------------------------------------------------------: |
| ![Manage apartment - Photos](docs/images/manage-apartment-photos.png) |

|                        Manage Apartment (Amenities)                         |
| :-------------------------------------------------------------------------: |
| ![Manage apartment - Amenities](docs/images/manage-apartment-amenities.png) |

</details>

<details>
<summary><b>⏸️ Apartment Availability Blockes</b></summary>

<br />

|                           Manage Apartment Availability Blockes                           |
| :---------------------------------------------------------------------------------------: |
| ![Manage apartment - Availability Blockes](docs/images/manage-apartment-availability.png) |

</details>

<details>
<summary><b>👨‍💼 Apartment Staff</b></summary>

<br />

|                       Manage Apartment Staff                        |
| :-----------------------------------------------------------------: |
| ![Manage apartment - Staff](docs/images/manage-apartment-staff.png) |

</details>

<details>
<summary><b>✈️ Upcoming Bookings & Reviews</b></summary>

<br />

|                         Manage Apartment Upcoming Bookings                         |
| :--------------------------------------------------------------------------------: |
| ![Manage apartment - Upcoming Bookings](docs/images/manage-apartment-bookings.png) |

|                        Manage Apartment Reviews                         |
| :---------------------------------------------------------------------: |
| ![Manage apartment - Reviews](docs/images/manage-apartment-reviews.png) |

</details>

<details>
<summary><b>🛠️ Apartment Maintenance & Tickets</b></summary>

<br />

|                          Manage Apartment Maintenance                           |
| :-----------------------------------------------------------------------------: |
| ![Manage apartment - Maintenance](docs/images/manage-apartment-maintenance.png) |

|                          Manage Ticket                           |
| :--------------------------------------------------------------: |
| ![Manage apartment - Ticket](docs/images/maintenance-ticket.png) |

</details>

<details>
<summary><b>🔔 Notifications & Dark Mood</b></summary>

<br />

|                       Notifications & Dark Mood                       |
| :-------------------------------------------------------------------: |
| ![Manage apartment - Maintenance](docs/images/notifications-dark.png) |

</details>

## Features

| Area            | Capabilities                                                          |
| --------------- | --------------------------------------------------------------------- |
| Discovery       | Browse apartments, search listings, and view apartment details        |
| Bookings        | View bookings and access booking-related workflows                    |
| Authentication  | Credentials-based login, session management, and access-token refresh |
| Guest account   | Manage profile information, favorites, bookings, and conversations    |
| Owner dashboard | Manage apartments and assigned staff                                  |
| Messaging       | Real-time conversations using SignalR                                 |
| Payments        | Stripe payment integration                                            |
| Localization    | Arabic and English with right-to-left layout support                  |
| Appearance      | Light and dark themes                                                 |
| Data fetching   | Typed API requests and server-state management with TanStack Query    |

## Architecture

The frontend uses Next.js App Router and organizes application code by feature, with shared infrastructure kept separate from UI components.

## Project Structure

```text
StayHub.UI/
├── app/             # App Router pages, layouts, and API routes
├── components/      # Shared UI components
├── features/        # Feature-specific UI, hooks, and API operations
├── hooks/           # Shared React hooks
├── i18n/            # Locale and internationalization configuration
├── lib/             # API clients, authentication, and shared utilities
├── messages/        # Arabic and English translations
├── providers/       # Application-level providers
├── public/          # Static assets
├── types/           # Shared TypeScript definitions
├── docs/
│   └── images/      # Architecture diagram and screenshots
└── README.md
```

### Key design decisions

- **Feature-based organization:** Domain-specific UI, hooks, and API operations live under `features/`.
- **Typed API integration:** `openapi-fetch` and generated TypeScript API definitions provide typed requests and responses.
- **Centralized API access:** Browser requests go through `/api/proxy`, while server-side requests use the internal backend URL.
- **Authentication handling:** Auth.js manages JWT-based sessions and refresh-token rotation. Access tokens are attached to backend requests server-side rather than exposed through browser-facing API responses.
- **Shared UI infrastructure:** Reusable components, hooks, providers, and localization resources are separated from individual features.

## Tech Stack

| Area                     | Technologies                       |
| ------------------------ | ---------------------------------- |
| Framework                | Next.js 16, React 19               |
| Language                 | TypeScript                         |
| Routing and localization | Next.js App Router, next-intl      |
| Authentication           | Auth.js v5, JWT sessions           |
| API integration          | openapi-fetch, openapi-typescript  |
| Server-state management  | TanStack Query                     |
| Forms and validation     | React Hook Form, Zod               |
| UI                       | Base UI, shadcn/ui, Tailwind CSS 4 |
| Themes                   | next-themes                        |
| Payments                 | Stripe                             |
| Real-time communication  | SignalR                            |
| Package manager          | pnpm                               |

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- pnpm
- A running instance of [StayHub.Backend](https://github.com/AbdelrahmanTaymour/StayHub.Backend)

### 1. Clone the repository

```bash
git clone https://github.com/AbdelrahmanTaymour/StayHub.UI.git
cd StayHub.UI
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the repository root:

```dotenv
AUTH_SECRET=your-generated-secret
AUTH_URL=http://localhost:3000
INTERNAL_API_URL=http://localhost:5236
```

Generate a secret for local development:

```bash
openssl rand -base64 32
```

- `AUTH_SECRET` is used to protect Auth.js session data.
- `AUTH_URL` defines the application's canonical URL for authentication.
- `INTERNAL_API_URL` is the backend base URL reachable by the Next.js server.

The example above assumes the backend is running through its Docker Compose configuration and is exposed on port `5236`. If you run the backend on a different address, update `INTERNAL_API_URL` accordingly.

Keep `.env.local` out of version control. Use development-only secrets for local testing.

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `pnpm dev`           | Start the development server                      |
| `pnpm build`         | Create a production build                         |
| `pnpm start`         | Run the production server                         |
| `pnpm lint`          | Run ESLint                                        |
| `pnpm typecheck`     | Check TypeScript types                            |
| `pnpm format`        | Format TypeScript and TSX files                   |
| `pnpm gen:api-types` | Generate API types from the OpenAPI specification |

The API type-generation command requires the specification at `openapi/stayhub.json`.

## Related Repository

- [StayHub.Backend](https://github.com/AbdelrahmanTaymour/StayHub.Backend) — ASP.NET Core API, application services, persistence, authentication integration, and backend infrastructure.
