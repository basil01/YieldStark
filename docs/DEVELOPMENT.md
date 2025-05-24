# YieldStark Development Guide

This document provides a step-by-step guide for setting up your development environment, running the project, and following best practices for contributing to YieldStark.

---

## 1. Prerequisites

- **Node.js**: v18 or higher
- **Yarn**: v1.22 or higher (recommended over npm)
- **Git**: For version control
- **A Starknet wallet**: (e.g., Argent X) for interacting with the app
- **(Optional) Cairo**: For smart contract development

---

## 2. Project Setup

### 2.1 Clone the Repository

```bash
git clone https://github.com/yourusername/YieldStark.git
cd YieldStark/packages/nextjs
```

### 2.2 Install Dependencies

```bash
yarn install
```

### 2.3 Environment Variables

Copy the example environment file and edit as needed:

```bash
cp .env.example .env
```

Edit `.env` to set your API keys, endpoints, and other secrets.

---

## 3. Running the Project

### 3.1 Start the Development Server

```bash
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 3.2 Building for Production

```bash
yarn build
yarn start
```

---

## 4. Project Structure

See [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) for a full breakdown.

---

## 5. Code Style & Linting

- **Linting**: Run `yarn lint` to check for code style issues.
- **Formatting**: Use Prettier for consistent formatting. Run `yarn format` to auto-format code.
- **Type Checking**: Run `yarn check-types` to ensure TypeScript correctness.

**Editor Recommendation:**  
Use VSCode with the Prettier and ESLint extensions enabled.

---

## 6. Git Workflow

- **Branching**: Create a new branch for each feature or bugfix:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- **Commits**: Write clear, descriptive commit messages.
- **Pull Requests**: Open a PR to `main` when your feature is ready. Reference issues if applicable.

---

## 7. Testing

- **Unit & Integration Tests**: Run with:
  ```bash
  yarn test
  ```
- **Coverage**: To check test coverage:
  ```bash
  yarn coverage
  ```
- **Adding Tests**: Place new tests in the appropriate `__tests__` or `*.test.ts(x)` files.

---

## 8. Smart Contract Development

- **Location**: Place Cairo contracts in the `contracts/` directory.
- **Tooling**: Use the Cairo toolchain and Starknet CLI for compiling and deploying contracts.
- **Testing**: Write contract tests using Cairo's testing framework or Starknet.js.

---

## 9. Environment & Secrets

- **Never commit secrets** (API keys, private keys, etc.) to the repository.
- Use `.env` for local development secrets.
- For production, use environment variables or a secrets manager.

---

## 10. Contribution Guidelines

- **Issues**: Use GitHub Issues to report bugs or request features.
- **Discussions**: Use GitHub Discussions or the project Discord for questions and ideas.
- **Code Reviews**: All PRs require at least one review before merging.
- **Documentation**: Update documentation for any user-facing or developer-facing changes.

---

## 11. Useful Commands

| Command            | Description                        |
|--------------------|------------------------------------|
| `yarn dev`         | Start development server           |
| `yarn build`       | Build for production               |
| `yarn start`       | Start production server            |
| `yarn lint`        | Run ESLint                         |
| `yarn format`      | Run Prettier                       |
| `yarn test`        | Run tests                          |
| `yarn coverage`    | Run tests with coverage            |
| `yarn check-types` | TypeScript type checking           |

---

## 12. Additional Resources

- [Starknet Documentation](https://docs.starknet.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cairo Language](https://www.cairo-lang.org/docs/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

---

**Happy building with YieldStark!**
