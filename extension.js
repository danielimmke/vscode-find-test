const vscode = require('vscode');

async function findTest() {
	// get the currently open file
	try {
		let { document } = vscode.window.activeTextEditor;

		let divider = '/'; // TODO: Add windows support

		let fileName = document.fileName.split(divider).pop();
		const ext = fileName.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];

		fileName = fileName.slice(0, ext.length + 1);

		// Find file with same name in workspace but .test before the extension
		const search = await vscode.workspace.findFiles(`**/**/${fileName}.test${ext}`, 1);
		const res = await search[0];
		
		if(res.length === 0) {
			vscode.window.showErrorMessage('Could not find test file.');

			return;
		};

		// Open file if found
		let testFile = await vscode.workspace.openTextDocument(res);
		await vscode.window.showTextDocument(testFile);
	} catch(e) {
		vscode.window.showErrorMessage('No file open.');

		return;
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('extension.findTest', findTest);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate
}
