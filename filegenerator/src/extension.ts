import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension is activated.');
    console.log('Congratulations, your extension "filegenerator" is now active!');

    let disposable = vscode.commands.registerCommand('filegenerator.generateFiles', () => {
        vscode.window.showInputBox({ prompt: 'Enter a name for the files' }).then((name) => {
            if (name) {
                generateFiles(name);
            }
        });
    });

    context.subscriptions.push(disposable);
}

function generateFiles(namesInput: string) {
    console.log('Generating files...');

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]; // Get the first workspace folder

    if (workspaceFolder) {
        const scssFolderPath = path.join(workspaceFolder.uri.fsPath, 'assets', 'scss');
        const mainFolderPath = workspaceFolder.uri.fsPath;

        // Split the input string into an array of names (assuming names are separated by a comma)
        const names = namesInput.split(',');

        // Check if the files already exist for any name
        for (const name of names) {
            const trimmedName = name.trim();
            const isModule = trimmedName.startsWith('m-');
            const isSingle = trimmedName.startsWith('s-');
            let filename = isModule
                ? trimmedName.substring(2)
                : isSingle
                ? `single-${trimmedName.substring(2)}`
                : trimmedName;

            const scssFilePath = path.join(scssFolderPath, 'pages', `${filename}.scss`);
            let phpFileName = isModule
                ? `m-${filename}.php`
                : isSingle
                ? `single-${filename}.php`
                : `template-${filename}.php`;
            const phpFilePath = path.join(mainFolderPath, phpFileName);

            // Check if the files already exist
            if (fs.existsSync(scssFilePath) || fs.existsSync(phpFilePath)) {
                console.log(`Sorry, a file with the name "${filename}" already exists.`);
                return; // Exit the function if the name already exists
            }
        }

        // Initialize arrays for _pages and _modules import statements
        const pagesImports: string[] = [];
        const modulesImports: string[] = [];

        names.forEach((name) => {
            const trimmedName = name.trim();
            const isModule = trimmedName.startsWith('m-');
            const isSingle = trimmedName.startsWith('s-');
            let folder = isModule ? '_modules' : isSingle ? '_pages' : '_pages';
            let filename = isModule
                ? trimmedName.substring(2)
                : isSingle
                ? `single-${trimmedName.substring(2)}`
                : trimmedName;
            let phpFileName = isModule
                ? `m-${filename}.php`
                : isSingle
                ? `${filename}.php`
                : `template-${filename}.php`;

            const scssFilePath = path.join(scssFolderPath, folder, `${filename}.scss`);
            const phpFilePath = path.join(mainFolderPath, phpFileName);

            // Create the SCSS and PHP files
            const scssContent = `//  Table of Contents:\n//\n//\t 1. ${filename}\n`;
            fs.mkdirSync(path.join(scssFolderPath, folder), { recursive: true });
            fs.writeFileSync(scssFilePath, scssContent);
            console.log(`Created file: ${scssFilePath}`);

            let phpContent = isModule || isSingle
                ? `<?php /* Template Name: ${filename.charAt(0).toUpperCase() + filename.slice(1)} */ ?>`
                : `<?php /* Template Name: ${filename.charAt(0).toUpperCase() + filename.slice(1)} */ ?>\n\n<?php get_header(); ?>\n\n<?php $fields = get_fields($post->ID); ?>\n\n<main role="main">\n\n</main>\n\n<?php get_footer(); ?>`;

            fs.writeFileSync(phpFilePath, phpContent);
            console.log(`Created file: ${phpFilePath}`);

            if (isModule) {
                modulesImports.push(filename);
            } else if (isSingle) {
                pagesImports.push(filename);
            } else {
                pagesImports.push(filename);
            }
        });

        // Get the content of style.scss
        const styleFilePath = path.join(scssFolderPath, 'style.scss');
        const existingContent = fs.readFileSync(styleFilePath, 'utf8');

        // Find the last @import statement under // pages or // modules
        const pagesImportMatch = existingContent.match(/@import "_pages\/([^\s"]+)";/g);
        const modulesImportMatch = existingContent.match(/@import "_modules\/([^\s"]+)";/g);
        const lastPagesImportStatement = pagesImportMatch ? pagesImportMatch[pagesImportMatch.length - 1] : '';
        const lastModulesImportStatement = modulesImportMatch ? modulesImportMatch[modulesImportMatch.length - 1] : '';

        // Add the new @import statements under the last one for each section
        const pagesImportStatements = pagesImports.map(name => `@import "_pages/${name}";`).join('\n');
        const modulesImportStatements = modulesImports.map(name => `@import "_modules/${name}";`).join('\n');

        const updatedContent = existingContent
            .replace(lastPagesImportStatement, `${lastPagesImportStatement}\n${pagesImportStatements}`)
            .replace(lastModulesImportStatement, `${lastModulesImportStatement}\n${modulesImportStatements}`);

        fs.writeFileSync(styleFilePath, updatedContent);
        console.log(`Updated style.scss for ${names.join(', ')}`);

        vscode.window.showInformationMessage(`Files created for: ${names.join(', ')}`);
    }
}

























export function deactivate() {}
