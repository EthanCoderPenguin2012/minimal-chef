# Project Structure

This document outlines the structure of the Minimal Chef project, explaining the purpose of key directories and files.

## Root Directory

```
minimal-chef/
├── .github/                # GitHub-specific files (workflows, templates)
├── .husky/                 # Git hooks for pre-commit, etc.
├── .kiro/                  # Kiro AI assistant configuration
├── .vscode/                # VS Code editor settings
├── api/                    # Backend API endpoints
├── build/                  # Production build output (generated)
├── docs/                   # Documentation files
├── node_modules/           # Dependencies (generated)
├── public/                 # Static assets served as-is
└── src/                    # Source code
```

## Source Code Structure

```
src/
├── assets/                 # Static assets (images, fonts, etc.)
├── components/             # Reusable React components
│   ├── common/             # Shared UI components
│   ├── layout/             # Layout components
│   └── recipe/             # Recipe-specific components
├── context/                # React context providers
├── data/                   # Static data files
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
├── services/               # API service integrations
├── styles/                 # Global styles and themes
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── App.tsx                 # Root application component
```

## API Structure

```
api/
├── auth/                   # Authentication endpoints
├── __tests__/              # API tests
└── import-recipe.js        # Recipe import endpoint
```

## Configuration Files

- `.babelrc` - Babel configuration for JavaScript transpilation
- `.editorconfig` - Editor settings for consistent coding style
- `.env` - Environment variables (not committed to Git)
- `.env.example` - Example environment variables
- `.eslintrc.js` - ESLint configuration for code linting
- `.gitattributes` - Git file attributes
- `.gitconfig` - Git configuration
- `.gitignore` - Files and directories ignored by Git
- `.gitmessage` - Git commit message template
- `.gitmodules` - Git submodules configuration
- `.npmrc` - NPM configuration
- `.prettierrc` - Prettier code formatter configuration
- `jest.config.js` - Jest test framework configuration
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Vercel deployment configuration

## GitHub Workflows

```
.github/
├── ISSUE_TEMPLATE/         # Templates for GitHub issues
├── workflows/              # CI/CD workflows
│   ├── ci.yml              # Continuous Integration workflow
│   └── release.yml         # Release workflow
├── CODEOWNERS              # Code ownership definitions
└── pull_request_template.md # PR template
```

## Documentation

```
docs/
├── api.md                  # API documentation
├── contributing.md         # Contribution guidelines
├── features.md             # Feature documentation
├── getting-started.md      # Getting started guide
└── index.md                # Documentation home page
```

## Build Output

```
build/
├── static/                 # Static assets (JS, CSS, media)
│   ├── css/                # Compiled CSS
│   ├── js/                 # Compiled JavaScript
│   └── media/              # Media files
└── index.html              # Main HTML file
```
