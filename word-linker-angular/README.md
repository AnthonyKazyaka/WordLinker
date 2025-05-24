# WordLinkerAngular

WordLinker is a word chain game where players create a chain of word pairs by connecting phrases where the second word of each phrase becomes the first word of the next phrase.

For example:
- Dog **House**
- **House** Key
- Key **Chain**
- **Chain** Link

The goal is to create as long a chain as possible, with bonuses for completing the full chain!

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Game Features

- Extensive dictionary of word pairs to create chains
- Visually appealing interface with animated feedback
- Score tracking with bonuses for completing chains
- Play from beginning to end with proper game-over detection

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## GitHub Pages Deployment

This project is configured for deployment to GitHub Pages. To build the application for GitHub Pages:

```bash
npm run build:gh-pages
```

The project can be deployed to GitHub Pages in two ways:

1. **Automated Deployment**: Push to the main branch and the GitHub Actions workflow will automatically build and deploy the application.

2. **Manual Deployment**: Build the project using the command above and then use the GitHub Pages settings in the repository to deploy from the `/docs` folder or the `gh-pages` branch.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
