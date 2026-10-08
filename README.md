# Phoneme Activity Builder

Phoneme Activity Builder is a full stack, data driven web application for creating, managing, monitoring, and generating phoneme based classroom activities for Speech Pathology learning.

The application allows teachers to maintain phoneme word data and reusable activity configurations through PostgreSQL, preview interactive Wordle and Word Search activities, generate standalone HTML files, and monitor application usage through an operational dashboard.

The project has been developed across multiple assessment stages.

Assessment 1 focused on frontend design, usability, accessibility, responsive behaviour, themes, and interactive activity generation.

Assessment 2 introduced PostgreSQL persistence, Prisma ORM, CRUD APIs, frontend data management, stored activity configurations, backend validation, health monitoring, and Docker deployment.

Assessment 3 extends this foundation with application instrumentation, usage tracking, reporting views, operational metrics, end to end testing, load testing, and accessibility evaluation.

## Features

### Home

The Home page provides a dedicated landing interface for the complete application.

It gives direct access to:

1. Wordle Builder
2. Word Search Builder
3. Manage Data
4. Dashboard

The Home page provides an overview of the application rather than duplicating one of the activity builders.

### Wordle Builder

Teachers can load stored Wordle activity configurations from PostgreSQL and customise the phoneme answer, English equivalent, and number of guesses.

The Wordle activity includes:

1. Database backed saved configurations
2. Phoneme sound hints
3. Wordle style feedback
4. Remaining guess tracking
5. A playable preview
6. Keyboard accessible controls
7. Standalone HTML generation
8. Generation attempt, success, and failure monitoring

### Word Search Builder

Teachers can load stored Word Search configurations containing multiple phoneme words and their English equivalents.

The Word Search activity includes:

1. Database backed saved configurations
2. Dynamically generated phoneme grids
3. Interactive word selection
4. Progress feedback
5. Keyboard accessible controls
6. Standalone HTML generation
7. Generation attempt, success, and failure monitoring

### Data Management

The Manage page provides a frontend CRUD interface for maintaining the stored data used by the activity builders.

Teachers can create, read, update, and delete:

1. Word lists
2. Phoneme words
3. Wordle activity configurations
4. Word Search activity configurations

Activity configurations reference stored word lists and individual word entries.

Wordle activities support a selected answer word and configurable maximum guesses.

Word Search activities support multiple selected words and configurable grid sizes.

Successful activity create, update, and delete operations are also recorded as operational usage events.

### Dashboard

The Dashboard provides database backed operational reporting for the application.

It displays:

1. Total stored activities
2. Total Wordle activities
3. Total Word Search activities
4. Total word lists
5. Total phoneme words
6. Generation attempt count
7. Successful generation count
8. Failed generation count
9. Generation success rate
10. Average time on page
11. Most viewed page
12. Most used activity type
13. Recent application events
14. Current database health status

The Dashboard retrieves its information through the reporting API rather than using hardcoded statistics.

### Observability and Usage Tracking

The application records operational activity using a dedicated `UsageEvent` database model.

Tracked event types include:

```text
PAGE_VIEW
PAGE_DURATION
ACTIVITY_CREATED
ACTIVITY_UPDATED
ACTIVITY_DELETED
GENERATION_ATTEMPTED
GENERATION_SUCCEEDED
GENERATION_FAILED
```

Usage events can store:

```text
Activity type
Activity ID
Page path
Page duration
Success state
Additional metadata
Creation timestamp
```

A shared page tracking component records page views and page duration automatically.

Activity CRUD operations and standalone HTML generation also produce operational events.

This information supports reporting, monitoring, and evaluation of application behaviour over time.

## Database Integration

Application data is stored in PostgreSQL and accessed using Prisma ORM.

The database supports:

1. Multiple word lists
2. Phoneme words
3. Multi character phoneme symbols
4. English equivalents
5. Optional phoneme hints
6. Multiple activity configurations
7. Wordle and Word Search activity types
8. Difficulty levels
9. Activity specific settings
10. Word relationships and answer selection
11. Usage events
12. Reporting and observability data

The main models are:

```text
Activity
ActivityWord
WordList
WordEntry
UsageEvent
```

## API

The application contains backend API routes for data management, monitoring, and reporting.

Available API groups include:

```text
/api/word-lists
/api/word-lists/[id]

/api/words
/api/words/[id]

/api/activities
/api/activities/[id]

/api/usage-events

/api/reporting

/api/health
```

The CRUD APIs provide validation and structured error handling for application data.

The usage events API records operational events from frontend activity.

The reporting API aggregates stored database information into dashboard metrics.

The health endpoint verifies that the application can communicate with PostgreSQL.

Example health response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Reporting

Reporting logic is separated into a dedicated server side reporting module.

The reporting service aggregates information from PostgreSQL including:

1. Stored activity totals
2. Activity type counts
3. Word list totals
4. Phoneme word totals
5. Generation attempts
6. Successful generations
7. Failed generations
8. Generation success rate
9. Average page duration
10. Most viewed page
11. Most used activity type
12. Recent usage events

The Dashboard requests this information through:

```text
GET /api/reporting
```

## Standalone HTML Generation

Wordle and Word Search activities can be downloaded as individual HTML files.

Generated files contain their own HTML, CSS, and JavaScript and do not require the Next.js application or PostgreSQL database after generation.

Generation attempts are monitored through the usage event system.

Successful generation produces:

```text
GENERATION_ATTEMPTED
GENERATION_SUCCEEDED
```

A generation error produces:

```text
GENERATION_ATTEMPTED
GENERATION_FAILED
```

The generated activity also captures the resolved application theme at generation time.

## Health Monitoring

The application provides:

```text
GET /api/health
```

The endpoint performs a real PostgreSQL query through Prisma.

A successful response returns HTTP 200 and confirms that the database is connected.

The Dashboard displays this result as a visible system health indicator.

## Theme System

The application supports:

1. System theme
2. Light theme
3. Dark theme

The selected preference is stored using a browser cookie.

System mode follows the current browser or device colour preference.

Theme state is shared through React context so appearance remains consistent throughout the application.

## Accessibility

Accessibility support includes:

1. Semantic form labels
2. Keyboard navigation
3. Visible focus states
4. Accessible navigation controls
5. Live status feedback
6. Responsive layouts
7. Keyboard accessible phoneme hints
8. ARIA labels
9. Live feedback regions
10. Textual feedback in addition to colour based feedback
11. Accessible form controls
12. Improved colour contrast

Lighthouse accessibility testing was performed on the main Assessment 3 application pages.

Final accessibility results:

```text
Dashboard: 100
Wordle: 100
Word Search: 100
Manage: 100
```

The Manage page initially scored 96 because the dark theme delete buttons did not provide sufficient foreground and background contrast.

The dark theme danger button colours were adjusted and Lighthouse was rerun.

The final Manage page accessibility score increased from:

```text
96
```

to:

```text
100
```

This demonstrates that Lighthouse results were reviewed and used to influence the final interface design.

## Responsive Interface

The application adapts to desktop, tablet, and mobile screen sizes.

Desktop navigation is replaced with a compact navigation menu on smaller screens.

Dashboard metric cards, management interfaces, activity builders, and reporting views also adapt to smaller viewport sizes.

## Pages

### Home

Provides the main application landing page and navigation to the major application areas.

### Wordle

Loads stored Wordle configurations, provides a playable preview, supports configuration changes, records generation activity, and generates standalone HTML.

### Word Search

Loads stored Word Search configurations, provides an interactive grid preview, records generation activity, and generates standalone HTML.

### Manage

Provides frontend CRUD controls for word lists, phoneme words, and activity configurations stored in PostgreSQL.

### Dashboard

Provides application health information, stored data summaries, usage statistics, generation statistics, and recent operational activity.

### About

Provides information about the project and student details.

### Settings

Provides System, Light, and Dark appearance preferences with persistent theme storage.

## Technology

The application uses:

```text
Next.js
React
TypeScript
PostgreSQL
Prisma ORM
Docker
Docker Compose
Playwright
Apache JMeter
Lighthouse
CSS
HTML
JavaScript
```

## Project Structure

```text
prisma
  migrations
  schema.prisma
  seed.ts

src
  app
    api
      activities
      health
      reporting
      usage-events
      word-lists
      words

    about
      page.tsx

    dashboard
      page.tsx

    manage
      page.tsx

    settings
      page.tsx

    wordle
      page.tsx

    word-search
      page.tsx

    globals.css
    layout.tsx
    page.tsx

  components
    manage
    wordle
    word-search
    Footer.tsx
    Header.tsx
    Navbar.tsx
    PageTracker.tsx

  context
    ThemeContext.tsx

  generated
    prisma

  lib
    wordle
    word-search
    prisma.ts
    reporting.ts
    usage-events.ts
    validation.ts

  services
    api.ts

  types
    api.ts

tests
  word-list-crud.spec.ts
  wordle-generation.spec.ts

Dockerfile
docker-compose.yml
playwright.config.ts
.env.example
package.json
README.md
```

## Environment Configuration

Create a local `.env` file using `.env.example` as a reference.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/phoneme_builder"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=phoneme_builder
```

The real `.env` file is excluded from Git and should not be committed.

The PostgreSQL username, password, and database values shown above are local development defaults only.

Production deployments should replace these values with secure environment supplied credentials.

Real secrets and production connection strings should never be committed to source control.

## Running Locally

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate deploy
```

Optional development seed data can be created using:

```bash
npx tsx prisma/seed.ts
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Running with Docker

Docker Compose runs the application and PostgreSQL database as separate services.

The services are:

```text
app
postgres
```

Build the application:

```bash
docker compose build
```

Start the services:

```bash
docker compose up -d
```

Check service status:

```bash
docker compose ps
```

Open the application:

```text
http://localhost:3000
```

Check database health:

```text
http://localhost:3000/api/health
```

Check reporting data:

```text
http://localhost:3000/api/reporting
```

Stop the services:

```bash
docker compose down
```

PostgreSQL data is stored using a Docker named volume so normal container restarts do not remove existing application data.

## Seed Data

The development seed creates an example phoneme word list containing values such as:

```text
/θɪn/ : thin
/kæt/ : cat
/dɒg/ : dog
/fɪʃ/ : fish
/sʌn/ : sun
```

It also creates example Wordle and Word Search configurations.

The seed script clears existing application data before recreating the example records, so it should only be used when resetting development data is appropriate.

Docker startup applies database migrations automatically but does not automatically execute the seed script.

## Validation and Error Handling

Backend validation checks incoming data before database operations are performed.

Validation includes:

1. Required fields
2. Activity type values
3. Difficulty values
4. Selected word relationships
5. Wordle answer requirements
6. Word Search word requirements
7. Duplicate phoneme protection within word lists
8. Usage event validation

API failures return structured error responses rather than silently failing.

Generation failures are recorded through the observability system where appropriate.

## Playwright Testing

Playwright is used for end to end browser testing.

The project includes:

```text
tests/word-list-crud.spec.ts
tests/wordle-generation.spec.ts
```

The Word List CRUD test demonstrates a complete builder data workflow:

```text
Create
Update
Delete
```

The Wordle generation test demonstrates:

```text
Loading a stored Wordle configuration from the database
Reading the stored configuration into the builder
Generating a standalone HTML file
Confirming that the file download succeeds
```

Run the Playwright tests using:

```bash
npx playwright test
```

View the Playwright HTML report using:

```bash
npx playwright show-report
```

The required Assessment 3 Playwright tests pass successfully in Chromium.

## JMeter Load Testing

Apache JMeter is used to evaluate application behaviour under increasing HTTP load.

The test plan targets:

```text
GET /api/health
GET /api/reporting
```

Staged load testing was performed using increasing workloads.

The tested stages included:

```text
1 thread
10 threads
100 threads
1000 threads
High volume sustained workload
```

The final high volume test used:

```text
100 threads
10 second ramp up
100 loops
10,000 requests per endpoint
20,000 total HTTP samples
```

Final high volume result:

```text
Samples: 20,000
Average response time: 72 ms
Minimum response time: 2 ms
Maximum response time: 217 ms
Error rate: 0.00%
Throughput: approximately 848 requests per second
```

The application maintained a 0 percent request error rate across all staged tests.

Lower load stages produced average response times in the single digit millisecond range.

Under the highest sustained workload, latency increased as expected while the application continued to respond successfully.

These results demonstrate that the application remained stable while demand increased.

## Lighthouse Testing

Chrome Lighthouse was used to evaluate accessibility.

Pages tested:

```text
/dashboard
/wordle
/word-search
/manage
```

Initial results:

```text
Dashboard: 100
Wordle: 100
Word Search: 100
Manage: 96
```

The Manage page reported insufficient colour contrast for danger controls in Dark mode.

The danger button colour was adjusted and the test was repeated.

Final results:

```text
Dashboard: 100
Wordle: 100
Word Search: 100
Manage: 100
```

Lighthouse automated testing is supplemented by manual consideration of keyboard focus, semantic structure, visible states, and interaction behaviour.

## Testing and Quality Checks

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run Playwright:

```bash
npx playwright test
```

Check installed packages:

```bash
npm audit
```

The Docker environment should also be rebuilt after significant application changes to confirm that the production environment remains reproducible.

## Code Quality

The project separates major responsibilities into reusable modules.

Frontend pages handle page level state and workflow.

Reusable components handle activity settings, previews, management interfaces, and page tracking.

Service functions provide typed frontend access to backend APIs.

API routes handle server side requests.

Validation logic is shared through dedicated utilities.

Prisma provides structured database access.

Reporting aggregation is separated into a dedicated reporting module.

Usage event persistence is separated into a dedicated observability service.

Standalone activity generation remains separate from React page components.

This structure reduces duplication and keeps frontend presentation, backend behaviour, reporting logic, database access, observability, and HTML generation separated.

## Assessment 3 Focus

Assessment 3 extends the previous full stack implementation with:

1. A dedicated operational Dashboard
2. Persistent usage event records
3. Page view monitoring
4. Page duration monitoring
5. Activity creation, update, and deletion monitoring
6. Generation attempt monitoring
7. Successful and failed generation statistics
8. Reporting API aggregation
9. Database health monitoring
10. Playwright end to end testing
11. Apache JMeter load testing
12. Lighthouse accessibility evaluation
13. Accessibility improvements based on measured results

The system therefore provides both functional activity building features and evidence that its operation can be monitored, tested, and evaluated.

## Demonstration

The Assessment 3 video walkthrough demonstrates:

1. The application Home page
2. Stored database data
3. Wordle and Word Search activity generation
4. CRUD management
5. Dashboard reporting
6. Health monitoring
7. Usage and generation statistics
8. Playwright test results
9. JMeter load test results
10. Lighthouse accessibility results
11. GitHub repository history and commits
12. The relationship between the frontend, API routes, Prisma, PostgreSQL, and operational reporting

## Current Scope

The application currently provides a complete data driven phoneme activity builder with persistent storage, CRUD APIs, interactive activity generation, operational metrics, reporting, testing, accessibility evaluation, theme persistence, responsive design, health monitoring, and Docker deployment.

Authentication and user accounts remain outside the current project scope.

## Author

Emmanuel Sholola

Student ID: 22338567
