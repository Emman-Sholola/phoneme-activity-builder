# Phoneme Activity Builder

Phoneme Activity Builder is a full stack web application for creating phoneme based classroom activities for Speech Pathology learning.

The application allows teachers to manage phoneme word data and activity configurations through a PostgreSQL database, preview interactive Wordle and Word Search activities, and generate standalone HTML files that can run directly in a normal web browser.

The project was originally developed as a frontend activity builder and has since been extended with database persistence, CRUD functionality, API routes, Prisma ORM, Docker support, and database driven activity generation.

## Features:

### Wordle Builder:

Teachers can load stored Wordle activity configurations from the database and customise the phoneme answer, English equivalent, and number of guesses.

The activity includes phoneme sound hints, Wordle style feedback, remaining guess tracking, a playable preview, keyboard accessible controls, and standalone HTML generation.

### Word Search Builder:

Teachers can load stored Word Search configurations containing multiple phoneme words and their English equivalents.

The activity includes a dynamically generated phoneme grid, interactive word selection, progress feedback, keyboard accessible controls, and standalone HTML generation.

### Activity Management:

The Manage page provides a frontend interface for maintaining the data used by the activity builders.

Teachers can create, read, update, and delete:

1. Word lists
2. Phoneme words
3. Wordle activity configurations
4. Word Search activity configurations

Activity configurations can reference stored word lists and individual word entries.

Wordle activities support a selected answer word and configurable maximum guesses.

Word Search activities support multiple selected words and configurable grid sizes.

### Database Integration:

Application data is stored in PostgreSQL and accessed using Prisma ORM.

The database supports:

1. Multiple word lists
2. Phoneme words and multi character phoneme symbols
3. English equivalents
4. Optional phoneme hints
5. Multiple activity configurations
6. Wordle and Word Search activity types
7. Difficulty levels
8. Activity specific settings
9. Word relationships and answer selection

### API:

The application contains backend API routes for managing stored data.

Available API groups include:

```text
/api/word-lists
/api/word-lists/[id]

/api/words
/api/words/[id]

/api/activities
/api/activities/[id]

/api/health
```

The CRUD APIs provide validation and error handling for creating, reading, updating, and deleting application data.

The health endpoint checks that the application can communicate with PostgreSQL and returns a successful response when the database is available.

Example:

```json
{
  "status": "ok",
  "database": "connected"
}
```

### Standalone HTML Generation:

Wordle and Word Search activities can be downloaded as individual HTML files.

Generated files contain their own HTML, CSS, and JavaScript and do not require the Next.js application or database after generation.

The generated activity also captures the currently resolved application theme so a file generated while the builder is using Dark mode opens using the dark colour scheme, while a file generated using Light mode uses the light colour scheme.

### Theme System:

The application supports:

1. System theme
2. Light theme
3. Dark theme

The selected preference is stored using a browser cookie.

System mode follows the current device or browser colour preference, while Light and Dark modes can be selected manually.

Theme state is shared through a React context so appearance behaviour remains consistent throughout the application.

### Accessibility:

Accessibility improvements include semantic form labels, keyboard navigation, visible focus states, live status feedback, accessible navigation controls, responsive layouts, and phoneme hints that can be accessed using both mouse hover and keyboard focus.

Interactive generated activities also include accessibility support such as ARIA labels, live feedback regions, keyboard focus states, and textual feedback so activity results are not communicated through colour alone.

### Responsive Interface:

The application adapts to desktop, tablet, and mobile screen sizes.

Desktop navigation is replaced with a compact navigation menu on smaller screens.

## Pages:

### Home:

Introduces the Phoneme Activity Builder and provides access to the main activity features.

### Wordle:

Loads stored Wordle configurations, provides a playable preview, allows local configuration changes, and generates a standalone Wordle HTML activity.

### Word Search:

Loads stored Word Search configurations, provides an interactive grid preview, and generates a standalone Word Search HTML activity.

### Manage:

Provides frontend CRUD controls for word lists, phoneme words, and activity configurations stored in PostgreSQL.

### About:

Provides information about the project, student details, and the application demonstration video.

### Settings:

Provides System, Light, and Dark appearance preferences with persistent theme storage.

## Technology:

The application uses:

```text
Next.js
React
TypeScript
PostgreSQL
Prisma ORM
Docker
Docker Compose
CSS
HTML
JavaScript
```

## Project Structure:

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
      word-lists
      words
    about
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

  context
    ThemeContext.tsx

  generated
    prisma

  lib
    wordle
    word-search
    prisma.ts
    validation.ts

  services
    api.ts

  types
    api.ts

Dockerfile
docker-compose.yml
.env.example
package.json
README.md
```

## Environment Configuration:

Create a local `.env` file using `.env.example` as a reference.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/phoneme_builder"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=phoneme_builder
```

The real `.env` file is excluded from Git and should not be committed.

## Running Locally:

Install dependencies:

```bash
npm install
```

Make sure PostgreSQL is running and that the database connection in `.env` is correct.

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

Open the application at:

```text
http://localhost:3000
```

If port 3000 is already being used, Next.js may automatically start the development server on another available port.

## Running with Docker:

The application can also be run using Docker Compose.

The Docker configuration creates two services:

```text
app
postgres
```

The application container runs the production Next.js application.

The PostgreSQL container provides the database service.

Build the application:

```bash
docker compose build
```

Start both containers:

```bash
docker compose up -d
```

Check container status:

```bash
docker compose ps
```

Open the application at:

```text
http://localhost:3000
```

Check the database health endpoint at:

```text
http://localhost:3000/api/health
```

Stop the containers:

```bash
docker compose down
```

PostgreSQL data is stored in a Docker named volume so normal container shutdown and restart does not remove existing database data.

## Seed Data:

The development seed creates an example phoneme word list containing words such as:

```text
/θɪn/ : thin
/kæt/ : cat
/dɒg/ : dog
/fɪʃ/ : fish
/sʌn/ : sun
```

It also creates example Wordle and Word Search activity configurations.

The seed script clears existing application data before recreating the example records, so it should only be run when resetting development data is appropriate.

Docker startup runs database migrations automatically but does not automatically execute the seed script.

## Validation and Error Handling:

Backend validation checks incoming data before database operations are performed.

Validation includes required fields, activity types, difficulty values, selected word relationships, Wordle answer requirements, Word Search word requirements, and duplicate phoneme protection within word lists.

API failures return structured error responses rather than silently failing.

## Health Check:

The application provides:

```text
GET /api/health
```

The endpoint performs a database query and returns HTTP 200 when PostgreSQL is connected successfully.

This provides a simple way to demonstrate that the frontend application, backend environment, Prisma client, and PostgreSQL service are operating together.

## Code Quality:

The project separates major responsibilities into reusable modules.

Frontend pages handle page level state and workflow.

Reusable components handle activity settings, previews, and management interfaces.

Service functions provide typed frontend access to backend APIs.

API routes handle server side CRUD operations.

Validation logic is shared through dedicated utilities.

Prisma provides structured database access.

Standalone activity generation is separated from the React page components.

This structure reduces duplication and keeps frontend presentation, backend behaviour, database access, and HTML generation separated.

## Testing and Quality Checks:

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Check installed packages for known vulnerabilities:

```bash
npm audit
```

The Docker version should also be rebuilt and tested after major application changes to confirm that the production environment remains reproducible.

## Demonstration:

A project demonstration video is included through the About page.

The demonstration covers the application interface, PostgreSQL integration, CRUD management, Wordle and Word Search activity generation, health endpoint, Docker environment, and important implementation decisions.

The final assessment submission also includes the required video walkthrough and verbal justification.

## Current Scope:

The current application provides the full stack functionality required for managing and generating phoneme based Wordle and Word Search classroom activities.

The project currently includes database persistence, CRUD APIs, a frontend management interface, stored activity configurations, downloadable HTML generation, theme persistence, accessibility improvements, responsive design, health monitoring, and Docker deployment.

Authentication and user accounts are outside the current project scope.

## Author:

Emmanuel Sholola

Student ID: 22338567