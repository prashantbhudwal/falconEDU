# Writing Commit Messages

## Articles

[How to Write a Git Commit Message](https://cbea.ms/git-commit/#why-not-how)

---

## Internal Guidelines

- **Message Template**

  `If applied, this commit will [your subject line here]`

- **No Caps**
  Use lowercase letters for the subject line.

## Extensions

- search: vivaxy.vscode-conventional-commits

## Standards: Conventional Commits [(docs)](https://www.conventionalcommits.org/en/v1.0.0/#summary)

Conventional Commits is a standard for making your commit messages more informative and structured. It works well with Semantic Versioning (SemVer).

- Commits must be prefixed with a type like `fix` or `feat`.
- An optional scope can be included to specify what area of the codebase the commit affects.
- Use `!` after the type/scope to indicate a breaking change.
- A `BREAKING CHANGE` footer can be included to provide details about the breaking change.
- Additional footers can follow a similar format to Git trailer format.
- The body of the commit is optional and provides additional context. It should start one blank line after the description.

### Structure

- `<type>[optional scope]: <description>`
- `[optional body]`
- `[optional footer(s)]`

### Key Types

- `fix`: Bug fixes (correlates with PATCH in SemVer).
- `feat`: New features (correlates with MINOR in SemVer).
- `BREAKING CHANGE`: Major changes (correlates with MAJOR in SemVer).

### Other Types

- `fix`: Bug fixes.
- `feat`: New features.
- `chore`: Routine tasks and maintenance.
- `docs`: Documentation changes.
- `style`: Code styling changes.
- `refactor`: Code refactoring.
- `perf`: Performance improvements.
- `test`: Adding or modifying tests.
- `build`: Build-related changes.
- `ci`: Continuous Integration changes.

### Body

- Should provide additional contextual information about the code changes.
- Must begin one blank line after the short description.
- Is free-form and may consist of any number of newline-separated paragraphs.

  ```md
  fix(Button): correct color scheme

  The previous color scheme caused issues with visibility. This fix improves contrast for better readability.

  Reviewed-by: John Doe
  ```

### Breaking Changes and `!`

- `!`: Use it after the type/scope to signify a breaking change. Example: `feat!(Button): remove onClick prop`.
- `BREAKING CHANGE`: Include this in the footer to detail the breaking change. Example:

  ```md
  feat!(Button): remove onClick prop
  BREAKING CHANGE: Button no longer supports onClick.
  ```

Both `!` and `BREAKING CHANGE` in the footer indicate that the commit introduces a major change, which correlates with a MAJOR bump in Semantic Versioning.

### Why Use It

- Helps in generating changelogs.
- Helps in semantic versioning.
- Eases communication about changes.

### Examples

- `fix: correct typo`
- `feat(api): add new endpoint`
- `BREAKING CHANGE: remove old API`

## In-depth examples

1. **Simple Fix:**

   ```git
   fix: resolve null pointer exception in getUser()
   ```

   _No scope or body. Just a fix._

2. **New Feature with Scope:**

   ```git
   feat(auth): add two-factor authentication
   ```

   _Scope `auth` specifies the area of the codebase affected._

3. **Breaking Change:**

   ```git
   feat!(api): remove deprecated getUserById endpoint

   BREAKING CHANGE: getUserById is removed, use getUser instead.
   ```

   _`!` indicates a breaking change, which is detailed in the footer._

4. **Commit with Body and Footer:**

   ```git
   fix(ui): improve button contrast

   Increased contrast makes the button more accessible.

   Reviewed-by: Jane Doe
   ```

   _Body provides extra context; footer adds metadata._

5. **Chore with Multiple Footers:**

   ```git
   chore: update dependencies

   Update to more secure package versions.

   Reviewed-by: John Smith
   Refs: #123, #124
   ```

   _A chore type commit with a body and multiple footers for additional information._
