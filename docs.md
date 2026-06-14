# Support Ticket Portal

### A support ticket portal where companies can submit and manage support tickets, and a support team can handle these tickets built with Laravel, React, and Inertia.js.

**Laravel 13 + React 19 + Inertia.js 3 + shadcn/ui + Tailwind CSS 4**

---

## Github repo

Github repo: https://github.com/Y2theK/support_ticket_portal.git

## Frontend Approach

I chose React since I want to give a smooth SPA experience. React has a rich ecosystem and is widely used for building SPA applications in modern web development, making it a good fit for this application. I used Inertia.js as an adapter to connect the frontend and backend.

Since the backend is built with Laravel, Inertia.js is a good fit because it allows me to build a modern single-page application without creating and maintaining a separate API. It keeps development simple and gives a smooth SPA experience.

I also used TypeScript for type safety and shadcn/ui for reusable and accessible UI components.

---

## Architecture & Design Choices

I used monolith SPA approach with inertia, react and laravel. I followed Laravel's MVC structure and tried to keep responsibilities separated.

### Backend

- **Action classes** (`app/Actions/`): Business logic extracted into action classes (e.g., `CreateTicket`, `UpdateTicket`).
- **PHP enums**: `TicketStatus`, `TicketPriority`, `UserRole`, `SlaState`.
- **Json Resource**: For reusable and clean response from controller
- **Policy-based authorization**: Use Laravel's `Policy` system to governs what each role can do. 
- **CheckUserRole middleware**: Routes are gated by `CheckUserRole` middleware for access control.
- **Organization-scoped**: Clients belong to an organization; tickets and comments are scoped to the organization. Agents see all organizations.

### Frontend

- **Pages**: organized by feature and user role.
- **Components**: shared UI components extracted into reusable components.
- **Layouts**: separated for clients and agents.

I chose this structure because it keeps the code easier to understand and maintain as the project grows.

### Folder Structure

```
app/
├── Actions/            # Business logic 
├── Concerns/           # Shared traits 
├── Enums/              # PHP enums 
├── Http/
│   ├── Controllers/    # Controllers folder
│   │   ├── Admin/      # Agent-only controllers
│   │   └── Settings/   # Profile/security settings
│   ├── Middleware/     # CheckUserRole, HandleInertiaRequests
│   ├── Requests/       # Form request validation classes
│   ├── Resources/      # Inertia/API resource classes for response shaping
│   └── Responses/      # Fortify login response customizations
├── Models/             # Eloquent models
├── Policies/           # Authorization policies
└── Providers/          # Service providers

resources/js/
├── pages/              # Inertia page components 
│   ├── admin/          # Agent-facing pages
│   ├── auth/           # Login, register, password reset, 2FA, email verification
│   ├── settings/       # Profile, security, appearance
│   └── tickets/        # Client-facing ticket pages
├── components/         # Shared React components
│   ├── ui/             # shadcn/ui primitives
│   └── ...             # Custom components
├── layouts/            # Layout components 
├── hooks/              # Custom React hooks 
├── types/              # TypeScript type definitions 
├── routes/             # Ziggy-style typed route definition files
├── lib/                # Utility functions
└── wayfinder/          # Auto-generated TypeScript route helpers

routes/
├── web.php             # Client-facing routes
├── admin.php           # Agent routes
├── settings.php        # Profile/security settings routes
└── console.php         # Artisan commands

database/
├── migrations/         # Schema definitions
├── factories/          # Model factories 
└── seeders/            # DatabaseSeeder with realistic data

tests/
├── Unit/               # Unit tests 
└── Feature/            # Feature tests 
```

---

## SLA Rules

Each ticket set an SLA deadline based on its priority when it is created.

| Priority | SLA     |
|----------|---------|
| Low      | 72 hours |
| Normal   | 24 hours |
| High     | 8 hours  |
| Critical | 2 hours  |

The SLA state is calculated dynamically by SLA deadline:

- **On Track** — ticket window is over 25% from the deadline.
- **Due Soon** — ticket window is under 25% its deadline.
- **Overdue** — ticket has passed its deadline.

**SLA deadline is recalculated if ticket's priority is updated.**

### Examples

Ticket created at **10:00 AM** with **Critical** priority (2-hour SLA deadline):

| Time        | State      | Why |
|-------------|------------|-----|
| 10:00 AM    | On Track   | >25% of deadline remaining (>30 min left) |
| 11:31 AM    | Due Soon   | <25% of deadline remaining (<30 min left) |
| 12:00 PM    | Overdue    | Past deadline |

Ticket created at **10:00 AM Monday** with **Low** priority (72-hour SLA deadline):

| Time                  | State      | Why |
|-----------------------|------------|-----|
| Mon 10:00 AM – Wed ~4:00 PM | On Track   | >25% of deadline remaining (>18h left) |
| Wed ~4:00 PM – Thu 10:00 AM | Due Soon   | <25% of deadline remaining (<18h left) |
| Thu 10:00 AM           | Overdue    | Past deadline |

---



## Role & Permission Model

### Roles

The application has two roles:

#### Client and Agent

Clients can:
- Create tickets
- View tickets belonging to their organization
- Add public comments to tickets

Agents can:
- View all tickets
- Assign tickets
- Update ticket status and priority
- Add public or internal comments

Authorization is enforced using Laravel middleware and policies.

## Time Spent & Scope

I spent approximately 8 hours on this project.

Because of the limited time, I focused on building the core ticket management workflow from end to end.

### What was implemented

I prioritized completing the core functionality with clean architecture rather than trying to implement every possible feature.

- Authentication
- Full database schema (organizations, users extension, tickets, comments)
- Client-facing ticket management (create, list, view, comment)
- Agent-facing ticket management (list with search/filter, detail with assign, update status/priority, internal notes)
- Role-based authorization via middleware + policies
- SLA computation with three-state indicator
- Basic dashboards with statistics data and recent tickets
- Seeding data
- Feature tests for SLA calculation, policies, and dashboard visibility

### Deliberately left out

To stay within the time limit, I did not implement:

- **Notifications** — no email or notifications.
- **No API** - no api-first approach with a modern frontend framework. 
- **Reporting / audit trails** — no charts, export CSV, or no audit logs.
---

## Next Steps

### What would be done next

1. **Ticket Lifecycle Improvement**: Updating ticket's title and description, deleting tickets, and make visibility status for ticket (draft, public).
2. **Notifications**: Listen to model events (ticket created, assigned) and send notifications via queues (email, in-app).
3. **File uploads**: Add attachment support to tickets and comments using Laravel's filesystem.
4. **Advanced filtering & charts**: Add date range, status, priority filters to the admin dashboard along with simple charts.
5. **Audit trails**: Track status, priority, and assignment changes for logging.
6. **Organization Management**: Creating organization and client users from the portal.

### Known limitations & shortcuts
- **laravel-react-starter-kit**: I chose the laravel' react starter kit because authentication is not the core problem being evaluated, and it provides a secure, production-ready foundation that allowed me to focus on the ticket management domain, authorization rules, and SLA functionality.
- **No delete on tickets**: There is currently no deletion of tickets and we cannot update tickets' title and description.
- **Offset pagination**: Uses simple `paginate()` — could be slow on very large datasets; cursor pagination would scale better.
- **No frontend tests**: The frontend currently does not include automated tests for pages or components.

### Parts I'm not happy with and how I'd improve

- **More polished ui**: Now the ui design and layout are pretty simple and shadcn alike.
- **No loading states on Inertia visits**: Pages do not show loaders during navigation.