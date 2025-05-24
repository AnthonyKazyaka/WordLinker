# WordLinker

WordLinker is a word puzzle game where you create chains of word pairs, with the second word of each pair becoming the first word of the next pair.

## Angular Web Version

This repository contains the Angular web version of WordLinker, a migration from the original .NET Framework WPF application.

### Play Online

The game is deployed on GitHub Pages and can be played at:
https://anthonykazyaka.github.io/WordLinker/

### Game Concept

In WordLinker, you'll create chains of word pairs where the second word of each pair becomes the first word of the next pair. For example:

- Dog **House** → **House** Key → Key **Chain** → **Chain** Link

The goal is to create the longest possible chain of connected words, earning points along the way.

### Development

The Angular application is in the `word-linker-angular` directory. See the README in that directory for development instructions.

### Testing from Feature Branches

You can test changes from a feature branch in two ways:

#### Local Testing

1. Clone the repository and checkout your feature branch:
   ```bash
   git clone https://github.com/AnthonyKazyaka/WordLinker.git
   cd WordLinker
   git checkout your-feature-branch
   ```

2. Navigate to the Angular project and install dependencies:
   ```bash
   cd word-linker-angular
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Access the application in your browser at `http://localhost:4200`

5. Run tests to ensure your changes don't break existing functionality:
   ```bash
   npm run test:ci
   ```

6. To build and test the production version locally:
   ```bash
   npm run test-build
   ```

#### Web Testing (GitHub Pages)

Feature branches are automatically deployed to GitHub Pages when pushed to the repository:

1. Push your feature branch to GitHub:
   ```bash
   git push origin your-feature-branch
   ```

2. GitHub Actions will automatically build and deploy your branch
   
3. Access your deployed feature branch at:
   ```
   https://anthonykazyaka.github.io/WordLinker/branches/your-feature-branch/
   ```
   (Special characters in branch names are replaced with hyphens)

4. You can also manually trigger a deployment from the Actions tab in the GitHub repository

For more detailed testing instructions, see the README in the `word-linker-angular` directory.

### Deployment

The game is automatically deployed to GitHub Pages when changes are pushed to the main branch.

For manual deployment:

1. Navigate to the Angular project:
   ```
   cd word-linker-angular
   ```

2. Build for GitHub Pages:
   ```
   npm run build:gh-pages
   ```

3. Deploy the contents of `dist/word-linker-angular` to GitHub Pages.

## Original .NET Application

The original WordLinker was built as a .NET Framework WPF application. The Angular version maintains the same game logic and word database while providing a web-based interface.