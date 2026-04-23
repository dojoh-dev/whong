# Contributing

This is a private repository, so only authorized contributors can access and contribute to the codebase. Please refer to the [contributing guide](CONTRIBUTING.md) for detailed instructions.

## Getting Started

1. **Access**: Ensure you have the necessary permissions to access the repository. If you do not have access, please contact the repository owner or administrator.
2. **Create a Branch**: Always create a new branch for your work. This helps keep the main branch clean and allows for easier code reviews.
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**: Implement your changes or new features in the codebase. Ensure that your code follows the project's coding standards and guidelines.
4. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message, following the [convetional commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
   ```bash
   git add .
   git commit -m "feat(Root): add new feature to the bot"
   ```
5. **Push Your Branch**: Push your branch to the remote repository.
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**: Once your branch is pushed, create a pull request to the main branch. Provide a clear description of the changes you made and any relevant information for reviewers.
7. **Code Review**: Your pull request will be reviewed by other contributors. Be open to feedback and make necessary changes based on the review comments.
8. **Merge**: Once your pull request is approved, it can be merged into the main branch. Ensure that all tests pass and that the code is properly documented before the merge.

## Code Style

Please follow the project's coding standards and guidelines. This includes using consistent indentation, naming conventions, and commenting your code where necessary. Adhering to these standards helps maintain code readability and quality across the project.

### Format (prettier)

We use Prettier to maintain consistent code formatting. Please ensure that your code is formatted according to Prettier's rules before committing. You can run Prettier locally using the following command:

```bash
npx prettier --write .
```

Or just let husky handle it for you when you commit your changes.

### Linting (eslint)

We use ESLint to enforce code quality and catch potential issues. Please ensure that your code passes all linting checks before committing. You can run ESLint locally using the following command:

```bash
npx eslint .
```

Or just let husky handle it for you when you commit your changes.

## Testing

Please write tests for any new features or changes you make to the codebase. This helps ensure that your changes do not introduce bugs and that the code remains stable. You can run tests locally using the following command:

```bash
pnpm run test
```
