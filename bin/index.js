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
        name: 'template',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: ['express'],
    },
    {
        name: 'name',
        type: 'input',
        message: 'Project name:',
    },
    {
        name: 'isTypescript',
        type: 'list',
        message: 'Would you like to use typescript in your project?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
    // {
    //     name: 'database',
    //     type: 'list',
    //     message: 'What kind of database/ORM would you like to use?',
    //     choices: ['mongoose', 'postgres', 'prisma'],
    //     default: 'mongoose',
    // },
    // {
    //     name: 'auth',
    //     type: 'list',
    //     message: 'Would you like to enable jwt auth?',
    //     choices: ['yes', 'no'],
    //     default: 'yes',
    // },
    // {
    //     name: 'socket',
    //     type: 'list',
    //     message: 'Would you like to add a socket.io server?',
    //     choices: ['yes', 'no'],
    //     default: 'yes',
    // },
    {
        name: 'isYarn',
        type: 'list',
        message: 'Do yo prefer to use yarn or npm to initialize the project?',
        choices: ['yarn', 'npm'],
        default: 'yarn',
    },
    {
        name: 'docker',
        type: 'list',
        message: 'Do yo want to use docker with this project?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
    {
        name: 'git',
        type: 'list',
        message: 'Would you like to create a initialize git in this project?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
];

// Generate prompt to ask the user what application he would like to create.
const promptCreateSetup = () => {
    inquirer
        .prompt(questions)
        .then((answers) => {
            gatherProjectInformations(answers);
        })
        .catch((error) => {
            throw new Error(error);
        });
};

// Gets all the templates infos and paths
const gatherProjectInformations = (answers) => {
    const { template, name, isTypescript } = answers;

    if (template !== 'express')
        throw new Error('Djovap generate can only generate express application for now');

    const templatePath = path.join(
        __dirname,
        `../generator/templates/nodejs-express/express-${
            isTypescript ? 'ts' : 'js'
        }/express-core`
    );
    const targetPath = path.join(CURR_DIR, name);

    const options = {
        templatePath,
        targetPath,
        ...answers,
    };
    console.log('Options :', options);

    if (!createDirectory(targetPath)) {
        return;
    }
    createDirectoryContents(templatePath, name);
    postProcess(options);
};

//Create the project in the right directory
const createDirectory = (projectPath) => {
    if (fs.existsSync(projectPath)) {
        console.log(
            chalk.red(
                `Folder ${projectPath} exists already. Delete it or use another name.`
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
    const SKIP_FILES = ['node_modules', '.template.json'];
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    console.log('files to create : ', filesToCreate);
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

//Commands to execute once the structured is copied
const postProcess = (options) => {
    console.log('Post process options', options);
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        // cd to project directory
        shell.cd(options.targetPath);
        //install with yarn or npm
        if (options.isYarn === 'yarn') {
            const result = shell.exec('yarn install');
            if (result.code !== 0) {
                chalk.red("Couldn't install node dependencies please run npm install");
                return false;
            }
        } else if (options.isYarn === 'npm') {
            const result = shell.exec('npm install');
            if (result.code !== 0) {
                chalk.red("Couldn't install node dependencies please run yarn install");
                return false;
            }
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

// Execute the command on 'generate'
program
    .command('generate')
    .description('Generates an application setup')
    // .option('-e', '--express', 'Create an express application')
    // .option('--ts', 'Initialize the project in typescript')
    // .option(
    //     '--db <name>',
    //     'Initialize with a database/orm : mongoose | postgres | prisma'
    // )
    // .option('-a', '--auth', 'Add JWT auth')
    // .option('-s', '--socket', 'Create a socket.io server')
    // .option('-d', '--docker', 'Add a dockerfile')
    // .option('--git', 'Initialize a git repository')
    .action((options) => {
        promptCreateSetup();
    })
    .parse(process.argv);
