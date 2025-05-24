# WordLinker

WordLinker is a word puzzle game where you create chains of word pairs, with the second word of each pair becoming the first word of the next pair.

## Word Dictionary

The game includes an extensive dictionary of word pairs organized into categories, with over 1,500 unique word combinations. The dictionary is continuously expanding with new and related words.

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