# WordLinkerAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

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

## Testing Before Merging

When working on a feature branch, you can test your changes before merging to the main branch:

### Local Development Testing

1. Make your changes in your feature branch
2. Run the development server to test the application:

```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200/` to see your changes

### Headless Unit Testing

To run unit tests with the [Karma](https://karma-runner.github.io) test runner without opening a browser window:

```bash
npm run test:ci
```

Or with the longer command:

```bash
npm test -- --no-watch --browsers=ChromeHeadless
```

For interactive testing with browser window:

```bash
npm test
```

### Building for Testing

To build the application and verify it works correctly:

```bash
npm run build
```

You can then serve the built application locally using a static file server:

```bash
# Install a simple HTTP server if you don't have one
npm install -g http-server

# Serve the built application
http-server dist/word-linker-angular/browser -p 8080
```

Or use the convenience script that will build and serve in one command:

```bash
npm run test-build
```

Then open your browser and navigate to `http://localhost:8080/` to test the built application.

### Web Testing on GitHub Pages

To test your feature branch on the web similar to the production environment:

1. Push your feature branch to GitHub:
   ```bash
   git push origin your-feature-branch
   ```

2. GitHub Actions will automatically build and deploy your branch to GitHub Pages in a branch-specific directory

3. Access your deployed feature branch at:
   ```
   https://anthonykazyaka.github.io/WordLinker/branches/your-feature-branch/
   ```
   Note: Special characters in branch names are replaced with hyphens

4. You can also manually trigger a deployment:
   - Go to the GitHub repository
   - Click on the "Actions" tab
   - Select "Deploy Feature Branch to GitHub Pages" workflow
   - Click "Run workflow"
   - Select your branch and click "Run workflow"

5. To build locally with the same base href that will be used on GitHub Pages:
   ```bash
   npm run build:branch
   ```
   This will output the URL where your branch will be deployed.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
