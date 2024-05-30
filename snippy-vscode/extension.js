const vscode = require('vscode');
const { exec } = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('snippy-vscode.runSnippyCommand', async () => {
        const editor = vscode.window.activeTextEditor;
        const command = await vscode.window.showInputBox({
            prompt: 'Enter snippy command',
            placeHolder: 'e.g. clip js animation',
            valueSelection: editor ? [editor.selection.start, editor.selection.end] : undefined
        });

        if (command) {
            const outputChannel = vscode.window.createOutputChannel('Snippy Output');
            outputChannel.show();
            exec(`snippy ${command}`, (error, stdout, stderr) => {
                if (error) {
                    outputChannel.appendLine(`Error: ${stderr}`);
                    vscode.window.showErrorMessage(`Error: ${stderr}`);
                    return;
                }
                outputChannel.appendLine(`Output: ${stdout}`);
                vscode.window.showInformationMessage(`Command executed: snippy ${command}`);
            });
        } else {
            vscode.window.showErrorMessage('No command entered');
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};