// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "unityprofiler" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let packageCode = function (content: string, name?: string): vscode.SnippetString {
		let snippet = new vscode.SnippetString();
		if (content.includes("//") || content.trim().length == 0) {
			snippet.appendText(content);
			return snippet;
		}
		let quotationMark = '"';
		let newLine = "\n";
		snippet.appendText("HcProfiler.BeginSample(");
		snippet.appendText(quotationMark);
		if (name)
			snippet.appendText(name);
		else
			snippet.appendPlaceholder("名字");
		snippet.appendText(quotationMark + ");");
		snippet.appendText(newLine);
		snippet.appendText(content.replace("\n", ""));
		snippet.appendText(newLine);
		snippet.appendText('HcProfiler.EndSample();\n');
		return snippet;
	}

	let guidCreator = function (): string {
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}

	let disposablePackage = vscode.commands.registerCommand('unityprofiler.package', () => {
		console.log('unityprofiler.package');
		let activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor != undefined) {
			let section = activeTextEditor.selection;
			let range = new vscode.Range(section.start, section.end);
			let content = activeTextEditor.document.getText(range);
			let snippet = packageCode(content);
			activeTextEditor.insertSnippet(snippet, range);
		}
	});

	let disposableLines = vscode.commands.registerCommand("unityprofiler.lines", () => {
		console.log("unityprofiler.lines");
		let activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor != undefined) {
			let section = activeTextEditor.selection;
			let range = new vscode.Range(section.start, section.end);
			let content = activeTextEditor.document.getText(range);
			let lines = content.split("\n");
			let snippet = new vscode.SnippetString();
			for (let index = 0; index < lines.length; index++) {
				const line = lines[index];
				let name = guidCreator();
				snippet.appendText(packageCode(line, name).value);
			}
			activeTextEditor.insertSnippet(snippet, range);
		}
	})

	let disposableClear = vscode.commands.registerCommand("unityprofiler.clear", () => {
		console.log("unityprofiler.clear");
		let activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor != undefined) {
			let section = activeTextEditor.selection;
			let range = new vscode.Range(section.start, section.end);
			let content = activeTextEditor.document.getText(range);
			let lines = content.split("\n");
			let snippet = new vscode.SnippetString();
			for (let index = 0; index < lines.length; index++) {
				let line = lines[index];
				if (!line.includes("HcProfiler"))
					snippet.appendText(line);
			}
			activeTextEditor.insertSnippet(snippet, range);
		}
	})

	context.subscriptions.push(disposablePackage);
	context.subscriptions.push(disposableLines);
	context.subscriptions.push(disposableClear);
}

// this method is called when your extension is deactivated
export function deactivate() { }
