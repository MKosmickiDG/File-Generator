# File Generator VS Code Extension

## Overview

The File Generator VS Code Extension is a tool that simplifies the process of creating SCSS and PHP files for your project. It allows you to generate files with specific naming conventions and automatically update your project's SCSS import statements.

## Features

- Create SCSS and PHP files with predefined templates.
- Dynamically update SCSS import statements in your project's `style.scss` file.
- Supports naming conventions for different types of files: regular templates, modules, and singles.
- Checks for existing files to prevent overwriting.

## Usage

1. Install the extension in Visual Studio Code.
2. Open your project workspace in Visual Studio Code.
3. To generate files, use the following steps:
   - Open the command palette by pressing `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).
   - Search for "File Generator: Generate Files" and select it.
   - Enter a comma-separated list of names for the files and press `Enter`.
4. The extension will create SCSS and PHP files based on the provided names and update the import statements in your `style.scss` file.

## File Naming Conventions

The extension follows specific naming conventions:
- For regular templates, use the format `name`.
- For modules, use the format `m-name`.
- For singles, use the format `s-name`.

## Example

To create a SCSS file and a template PHP file with the name "home", use the following input:
home

To create a SCSS file and a module PHP file with the name "cta", use the following input:
m-cta

To create a SCSS file and a single PHP file with the name "project", use the following input:
s-project