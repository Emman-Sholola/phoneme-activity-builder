# Phoneme Activity Builder

A frontend web application for creating phoneme based classroom activities for Speech Pathology learning.

The application allows teachers to configure, preview, and generate playable Wordle and Word Search activities as standalone HTML files.

## Features

Wordle Builder: Configure a phoneme answer, English equivalent, and number of guesses. Includes sound hints, Wordle style feedback, and a playable preview.

Word Search Builder: Configure five phoneme words and their English equivalents. Includes an interactive word search preview with selection feedback.

HTML Generation: Both activities can be downloaded as standalone HTML files that run directly in a normal web browser.

Responsive Interface: The layout adapts for desktop, tablet, and mobile screen sizes.

Navigation: Includes desktop navigation and a compact hamburger menu for smaller displays.

Themes: Light and dark themes with the selected preference stored using cookies.

Accessibility: Includes keyboard navigation, focus states, semantic form labels, live feedback, and phoneme hints accessible through mouse hover and keyboard focus.

## Pages

Home: Introduces the application and provides access to both activity builders.

Wordle: Configures, previews, and generates the phoneme Wordle activity.

Word Search: Configures, previews, and generates the phoneme Word Search activity.

About: Provides the project overview, student details, and instructional video.

Settings: Provides persistent light and dark theme controls.

## Technology

Next.js

React

TypeScript

CSS

HTML

JavaScript

## Project Structure

```text
src
  app
    about
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
    Footer.tsx
    Header.tsx
    Navbar.tsx
```

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

Create a production build:

```bash
npm run build
```

Run code quality checks:

```bash
npm run lint
```

## Current Scope

This version focuses on frontend design, usability, accessibility, responsive behaviour, and standalone activity generation.

Database integration, authentication, dynamic word management, and additional full stack functionality are intended for later stages of the project.

## Author

Emmanuel Sholola

Student ID: 22338567