# Resources

## Tailwind

### Animations

1. https://snippets.alexandru.so/
   This is a collection of beautiful tailwind snippets especially for animated buttons.

---

## VSCode Extensions

Check out recommended extensions for this project in the `.vscode/extensions.json` file.

- You can install all the recommended extensions by running the following command in the terminal:
  ```sh
  code --install-extension $(cat .vscode/extensions.json | jq -r '.recommendations[]')
  ```
- You can also install the recommended extensions by going to the extensions view in VSCode and clicking on the "Install All" button from the "Workspace Recommendations" section.
