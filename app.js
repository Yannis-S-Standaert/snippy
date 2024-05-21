#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';

/* CLI logic */

const program = new Command();
// list command
program
    .command('list <language>')
    .description('List all snippets for a given language')
    .action((language) => {
        let snippets = listSnippets(language);
    });

// read command
program
    .command('clip [language] [name]')
    .description('Read a snippet')
    .action((language, name) => {
        readSnippet(language, name, (snippet) => {

                let code = snippet.code;
                let params = snippet.params;
                let prompts = params.map(param => {
                    return {
                        type: 'input',
                        name: param.name,
                        message: `Enter the value for ${param.name}`,
                    };
                });
                if (prompts.length === 0) {
                    clipboardy.writeSync(code);
                    console.log(`copied ${name} to clipboard`);
                    return;
                }
                inquirer.prompt(prompts).then((answers) => {
                    code = replaceParameters(code, answers);
                    clipboardy.writeSync(code);
                    console.log(`copied ${name} to clipboard`);
                });
        });
    });

// create command
program
    .command('create')
    .description('Create a new snippet')
    .action(() => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'language',
                message: 'Enter the language for the snippet',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the snippet',
            },
            {
                type: 'editor',
                name: 'code',
                message: 'Enter the code for the snippet',
            },
        ]).then(({ language, name, code }) => {
            createSnippet(language, code, name, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    updateIndex(language, name, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        });
    });

// git sync command
program
    .command('sync')
    .description('Sync snippets with git')
    .action(() => {
        syncWithGit();
    });

program.parse(process.argv);

/* app logic */

function createSnippet(language, code, name, callback) {
    let folder = language;
    let params = extractParameters(code).map(param => `${param.type}:${param.name}`);
    let content = `
${name}
${language}
${params.map((param) => param).join(',')}
---
${code}
`;

    if (!fs.existsSync('./snippets')) {
        fs.mkdirSync('./snippets');
    }
    if (!fs.existsSync(`./snippets/${folder}`)) {
        fs.mkdirSync(`./snippets/${folder}`);
    }

    fs.writeFile(`./snippets/${folder}/${name}.md`, content, (err) => {
        if (err) {
            callback(err);
        } else {
            console.log('Snippet created');
            callback(null);
        }
    });
}

function listSnippets(language) {
    fs.readdir(`./snippets/${language}`, (err, files) => {
        if (err) {
        } else {
            const snippets = files.map(file => file.replace('.md', ''));
            console.log('\t' + snippets.join('\t\n'));
        }
    });
}


function readSnippet(language, name, callback) {
    fs.readFile(`./snippets/${language}/${name}.md`, 'utf8', (err, data) => {
        if (err) {
            callback(err);
        } else {
            let code = data.split('---')[1].trim();
            let language = data.split('---')[0].split('\n')[2];
            let params = // third line of the file, name:myName,name:MyOtherName,value:0.5,value:hi
                data.split('---')[0].split('\n')[3] !== ''

                ? data.split('---')[0].split('\n')[3].split(',').map(param => {
                    
                    let [type, name] = param.split(':');
                    // remove whitespace, tabs, and newlines
                    name = name.replace(/\s/g, '');
                    return { type, name };
                })
                : [];

            callback({code, params, name, language});
        }
    });
}

const indexFilePath = './snippets/index.json';

function readIndex(callback) {
    fs.readFile(indexFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // If the file does not exist, return an empty array
                return callback(null, []);
            } else {
                console.log(err);
                return callback(err);
            }
        }
        try {
            const index = JSON.parse(data);
            callback(null, index);
        } catch (parseErr) {
            console.log(parseErr);
            callback(parseErr);
        }
    });
}

function writeIndex(index, callback) {
    fs.writeFile(indexFilePath, JSON.stringify(index, null, 2), (err) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('Index file updated');
            callback(null);
        }
    });
}

function updateIndex(language, name, callback) {
    readIndex((err, index) => {
        if (err) {
            return callback(err);
        }

        // Check if the snippet already exists in the index
        const existingSnippet = index.find(snippet => snippet.name === name && snippet.language === language);
        if (!existingSnippet) {
            index.push({ language, name });
        }

        writeIndex(index, callback);
    });
}


/* Git logic */

function syncWithGit() {
    // Sync with git
    const { exec } = require('child_process');
    let commitName = new Date().toISoString() + '-snippy-sync';
    exec(`git add . && git commit -m "${commitName}" && git push`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(stdout);
    });
}

/* Text logic */

const paramRegex = /@:(\w+):(.*?):@/g;

/*
 * Extract unique parameters from the template.
 * Returns an array of objects { type, name }.
 */
function extractParameters(template) {
  const params = new Map();

  let match;
  while ((match = paramRegex.exec(template)) !== null) {
    const type = match[1]; // 'name' or 'value'
    const paramName = match[2][0].toLowerCase() + match[2].slice(1);
    if (!params.has(paramName)) {
      params.set(paramName, { type, name: paramName });
    }
  }

  return Array.from(params.values());
}

/*
 * Replace parameters in the template with provided replacement values.
 * replacementValues should be an object:
 * { paramName: replacementValue }
 */
function replaceParameters(template, replacementValues) {
    return template.replace(paramRegex, (match, type, paramName) => {
        if (type === 'name') {
            // check if the paramName is in pascal or camel case
            let casing = paramName[0].toUpperCase() === paramName[0] ? 'pascal' : 'camel';
            paramName = paramName[0].toLowerCase() + paramName.slice(1);
            console.log(paramName, casing, replacementValues[paramName]);
            let value = replacementValues[paramName[0].toLowerCase() + paramName.slice(1)];
            value = casing === 'pascal' ? value[0].toUpperCase() + value.slice(1) : value[0].toLowerCase() + value.slice(1);
            return value;
        }
        else {
            return replacementValues[paramName];
        }
    });
}