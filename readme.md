[![Theme Redone Gutenberg WordPress Framework](https://raw.githubusercontent.com/webredone/trb-cli/main/trb-cli-logo.svg)](https://webredone.com/theme-redone/gutenberg-blocks-framework/trb-cli/)

# **TRB CLI (Theme Redone Blocks CLI)**

TRB-CLI is a handy Node.js CLI that automates the process of managing blocks in a **[theme-redone WordPress theme framework](https://webredone.com/theme-redone/)**.

Instead of manually creating new blocks, and copying and renaming files, you can do just that with a single simple command.

---

## **Installation**

- Install the trb-cli package globally via the **npm install @webredone/trb-cli -g** command.
- Verify that the package was installed successfully by running the trb command; This command lists all the available trb-cli commands. If that’s the case, you are all set up.

---

## **Usage and Commands**

To be able to use the TRB CLI you should be inside the root of the theme-redone theme from inside the terminal.

Commands will only run if the CLI detects that it’s called from the theme root which it verifies by the presence of the "name": "theme-redone" line inside the theme’s package.json.

---

## **Main Commands**

- **trb add kebab-case-block-name** - Creates a new block with the desired name (must be in kebab-case)
- **trb remove kebab-case-block-name** - Removes the existing block
- **trb rename kebab-case-block-name-original kebab-case-block-name-renamed** - Renames selected block

* **trb copy kebab-case-block-name-copy-from kebab-case-block-name-copy-to** - Copies selected block into a new block with the desired name

---

## Visit https://webredone.com/theme-redone/ to learn more.
