To use custom copilot instructions(to force copilot to follow coding standards and patterns, and convetions), enable custom instructions in vscode

1. Set the [ github.copilot.chat.codeGeneration.useInstructionFiles ](https://code.visualstudio.com/docs/copilot/copilot-customization)setting to `true` to instruct Copilot in VS Code to use the custom instructions file.
2. Create a `.github/copilot-instructions.md` file at the root of your workspace. If needed, create a `.github` directory first.
3. Add natural language instructions to the file. You can use the Markdown format.Whitespace between instructions is ignored, so the instructions can be written as a single paragraph, each on a new line, or separated by blank lines for legibility.
