# University of Ibadan Recruitment Management System

Academic prototype for recruitment operations: vacancy publishing, applicant profiles and applications, screening, interviews, evaluations, final decisions, notifications, activity logs, and reports.

The project is a single Laravel application using the Laravel React Starter Kit, Inertia, React, TypeScript, Tailwind CSS, shadcn/ui, and PostgreSQL. Fortify provides authentication; Spatie Laravel Permission provides roles and permissions.

## Code organization

- `resources/js/pages` contains Inertia route entry points. Keep pages focused on page layout and composing feature components.
- `resources/js/components/dashboard` contains the audience dashboards and shared dashboard cards; keep applicant, HR, and interviewer widgets separate.
- `resources/js/components/applicant`, `admin`, and `interviewer` hold feature UI grouped by domain. Keep related form state and event handlers beside the component that owns that form.
- `app/Http/Requests` validates incoming data, `app/Policies` enforces record-level access, and `app/Services/RecruitmentWorkflowService.php` contains state transitions that span more than one model or table.
- `app/Enums` defines controlled workflow values. Add a comment where a rule depends on a non-obvious security boundary, transaction, or workflow constraint.

## Requirements

- PHP 8.3 or newer with `pdo_pgsql`, `fileinfo`, and the usual Laravel extensions
- Composer
- PostgreSQL and a database/user configured for the application
- Node.js and npm compatible with the Vite Plus version in `package.json`

## Local setup (PowerShell)

From the project directory:

```powershell
composer install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
```

Set the PostgreSQL connection values in `.env` (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, and optionally `DB_SCHEMA`). The `.env.example` file uses the `recruitment_management_system` database and a local `postgres` account as a starting point. Create the database and grant that user access before continuing.

Choose a local demo password before seeding. The checked-in example value is only a placeholder:

```dotenv
RMS_DEMO_PASSWORD=Choose-A-Local-Password
```

Then run:

```powershell
php artisan migrate --seed
npm install
npm run dev
```

In a second PowerShell window, run `php artisan serve` and open `http://127.0.0.1:8000`.

`DatabaseSeeder` always creates the application roles and permissions. Illustrative departments and demonstration users, vacancies, applicants, and applications are seeded only when `APP_ENV=local`. No demonstration administrative account is seeded in other environments. Never use the example password outside a disposable local database.

## Local demonstration accounts

After `php artisan migrate --seed` in the local environment, the following accounts use the value configured in `RMS_DEMO_PASSWORD`:

| Role                | Email                     |
| ------------------- | ------------------------- |
| Super administrator | `superadmin@example.com`  |
| HR administrator    | `hr.admin@example.com`    |
| HR officer          | `hr.officer@example.com`  |
| Interviewer         | `interviewer@example.com` |
| Applicant           | `applicant@example.com`   |

These are development fixtures, not production credentials. Their password is the local `RMS_DEMO_PASSWORD` value; when that variable is absent, the local-only fallback is `ChangeMe123!`. Change the value before reseeding and never use it outside a disposable development database. Registration creates an applicant account. Administrative roles are assigned by authorized administrators only.

## Recruitment workflow

1. HR creates a vacancy, adds requirements, and publishes it.
2. Applicants register, complete their profile, and submit a vacancy application with private supporting documents.
3. HR reviews and screens the application. Qualified applications can be shortlisted.
4. HR schedules an interview and assigns interviewer accounts.
5. Assigned panel members submit one scorecard each. The system calculates the average score and completes the interview after all assigned panel members submit.
6. HR records the selected, rejected, or reserved decision. The applicant receives database notifications at key workflow stages.
7. Authorized HR users view filtered recruitment reports or export a CSV.

Applicant documents and profile photos use the private `local` storage disk. Downloads pass through authenticated, policy-protected routes; do not expose these files using a public storage link.

## Verification commands

```powershell
php artisan test
vendor\bin\pint --test
npm run check
npm run types:check
npm run build
```

PostgreSQL is the configured application database. For isolated automated tests, PHPUnit uses an in-memory SQLite database unless the test configuration is deliberately changed.
