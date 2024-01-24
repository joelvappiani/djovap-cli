#! /usr/bin/env node
import fs from 'fs';
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { URL } from 'url';
import * as ejs from 'ejs';
import shell from 'shelljs';

//Handles __dirname in ES modules node
const __dirname = new URL('.', import.meta.url).pathname;

//current directory
const CURR_DIR = process.cwd();

//List of questions that can be prompted to the user
const questions = [
    {
        name: 'name',
        type: 'input',
        message: 'Project name:',
    },
    {
        name: 'ts',
        type: 'list',
        message: 'Would you like to use typescript in your project?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
    {
        name: 'db',
        type: 'list',
        message: 'What kind of database would you like to use?',
        choices: ['mongoDB', 'postgreSQL'],
        default: 'mongoose',
    },
    {
        name: 'auth',
        type: 'list',
        message: 'Would you like to enable jwt auth?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
    {
        name: 'socket',
        type: 'list',
        message: 'Would you like to add a socket.io server?',
        choices: ['yes', 'no'],
        default: 'no',
    },
    {
        name: 'package',
        type: 'list',
        message: 'Do yo prefer to use yarn or npm for this project?',
        choices: ['yarn', 'npm'],
        default: 'yarn',
    },
    {
        name: 'docker',
        type: 'list',
        message: 'Do yo want to use docker in this project?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
    {
        name: 'git',
        type: 'list',
        message: 'Would you like to initialize git for this project?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
];

// Generate prompt to ask the user what application he would like to create.
const promptCreateSetup = (options) => {
    //If argument d is passed to command then create the default template without prompt
    if (options.default === true) {
        return createProject({
            template: 'express',
            name: 'server',
            ts: 'yes',
            db: 'mongoDB',
            auth: 'yes',
            socket: 'yes',
            package: 'yarn',
            docker: 'yes',
            git: 'yes',
        });
    }

    //If argument b is passed to command then create a very basic js template without prompt
    if (options.basic === true) {
        return createProject({
            template: 'express',
            name: 'server',
            ts: 'no',
            db: 'mongoDB',
            auth: 'no',
            socket: 'no',
            package: 'yarn',
            docker: 'no',
            git: 'no',
        });
    }

    //Filter all the questions by options already provided in the command
    const questionsToPrompt = questions.filter((question) => {
        //Check if the db name is spelled right in the option
        if (question.name === 'db' && !['mongoDB', 'postgreSQL'].includes(options.db))
            return question;
        //Check if the package manager name is spelled right in the option
        if (question.name === 'package' && !['npm', 'yarn'].includes(options.package))
            return question;
        return !Object.keys(options).includes(question.name);
    });

    //Prompt the questions to the user
    inquirer
        .prompt(questionsToPrompt)
        .then((answers) => {
            createProject(answers);
        })
        .catch((error) => {
            throw new Error(error);
        });
};

// Gets all the templates infos and paths
const createProject = (answers) => {
    const { name, ts } = answers;

    if (!name.length) {
        console.log(
            chalk.red(`

❌ Error : You must provide a name to create the application
            
            `)
        );
        return;
    }
    const templatePath = path.join(
        __dirname,
        `../generator/templates/express/${
            ts === 'yes' ? 'typescript' : 'javascript'
        }/core`
    );
    const targetPath = path.join(CURR_DIR, name);

    const options = {
        templatePath,
        targetPath,
        ...answers,
    };

    if (!createDirectory(targetPath)) {
        return;
    }
    createDirectoryContents(templatePath, name);
    const result = postProcess(options);
    console.log(result);
    if (result) {
        console.log(
            chalk.green(`
        
✅ Generation completed successfully !
        
        `)
        );
    }
};

//Create the project in the right directory
const createDirectory = (projectPath) => {
    if (fs.existsSync(projectPath)) {
        console.log(
            chalk.red(
                `
                
❌ Folder ${projectPath} exists already. Delete it or use another name.
                
                `
            )
        );
        return false;
    }
    fs.mkdirSync(projectPath);
    return true;
};

//
const createDirectoryContents = (templatePath, projectName) => {
    // list of the files we don't want to copy
    const SKIP_FILES = ['node_modules', 'yarn-error.log', 'yarn.lock', '.git'];
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);

    // loop each file/folder
    filesToCreate.forEach((file) => {
        const origFilePath = path.join(templatePath, file);

        // get stats about the current file to know if it's a file or a directory
        const stats = fs.statSync(origFilePath);

        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1) return;

        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            if (file === 'package.json') {
                // Replace project name with an ejs variable to be able to change it for each use
                contents = contents.replace(
                    /"name": "template"/,
                    '"name": "<%= projectName %>"'
                );
            }
            // Rendering by ejs allows to use the projectName variable in package.json
            contents = ejs.render(contents, { projectName });
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(
                path.join(templatePath, file),
                path.join(projectName, file)
            );
        }
    });
};

//Adds connection to a db and basic structure and CRUD
const generateDbConnection = (db) => {
    switch (db) {
        case 'mongoose':
            break;
        case 'postgres':
            break;
    }
};

// adds jwt auth to the template
const generateAuth = (db) => {
    switch (db) {
        case 'mongoose':
            shell.cd(options.targetPath);
            shell.exec(
                options.package === 'yarn' ? 'yarn add mongoose' : 'npm install mongoose'
            );
            break;
        case 'postgres':
            break;
    }
};

//Creates a websocket server with socket.io
const handleSocket = () => {};

//Commands to execute once the structured is copied
const postProcess = (options) => {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        // cd to project directory
        shell.cd(options.targetPath);
        //install with yarn or npm
        if (options.package === 'yarn') {
            const result = shell.exec('yarn install');
            if (result.code !== 0) {
                console.log(
                    chalk.orange(`
                    
⚠ Couldn't install node dependencies please run yarn install

                    `)
                );
                return false;
            }
            options.db === 'mongoDB'
                ? shell.exec('yarn add mongoose')
                : shell.exec('yarn add pg');
        } else if (options.package === 'npm') {
            const result = shell.exec('npm install');
            if (result.code !== 0) {
                console.log(
                    chalk.orange(`
                    
⚠ Couldn't install node dependencies please run npm install

                    `)
                );
                return false;
            }
            options.db === 'mongoDB'
                ? shell.exec('npm install mongoose')
                : shell.exec('npm install pg');
        }
    }
    if (options.git === 'yes') {
        const result = shell.exec('git init');
        if (result.code !== 0) {
            return false;
        }
    }
    if (options.docker === 'no') {
        const result = shell.exec('rm Dockerfile');
        if (result.code !== 0) {
            return false;
        }
    }
    return true;
};

// Execute the generator on 'create-express-app'
program
    .command('create-express-app')
    .description('Generates an express application setup')
    .option('-b, --basic', 'Creates a very basic express application', undefined)
    .option(
        '-d, --default',
        'Creates a default express typescript application',
        undefined
    )
    .option('--ts', 'Initialize the project in typescript', undefined)
    .option('--db <mongoDB | postgreSQL>', 'Initialize with a database', undefined)
    .option('--auth', 'Add JWT auth', undefined)
    .option('--socket', 'Create a socket.io server', undefined)
    .option('--git', 'Initialize a git repository', undefined)
    .option('-d --docker', 'Initialize a dockerfile', undefined)
    .option(
        '-p, --package <yarn | npm>',
        'Initialize the project with npm or yarn',
        undefined
    )
    .action((options) => {
        promptCreateSetup(options);
    })
    .parse(process.argv);
