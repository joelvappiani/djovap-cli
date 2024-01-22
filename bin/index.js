#! /usr/bin/env node
import fs from 'fs';
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

program.name('generator').description('CLI application setup generator').version('1.0.0');

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
        name: 'typescript',
        type: 'list',
        message: 'Would you like to use typescript in your project?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
    {
        name: 'database',
        type: 'list',
        message: 'What kind of database/ORM would you like to use?',
        choices: ['mongoose', 'postgres', 'prisma'],
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
        name: 'git',
        type: 'list',
        message: 'Would you like to add a socket.io server?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
    {
        name: 'git',
        type: 'list',
        message: 'Would you like to create a git repository?',
        choices: ['yes', 'no'],
        default: 'yes',
    },
];

const promptCreateSetup = () => {
    inquirer
        .prompt(questions)
        .then((answers) => {
            console.log(answers);
        })
        .catch((error) => {
            throw new Error(error);
        });
};

program
    .command('generate')
    .description('Generates an application setup')
    .option('-e', '--express', 'Create an express application')
    .option('--ts', 'Initialize the project in typescript')
    .option(
        '--db <name>',
        'Initialize with a database/orm : mongoose | postgres | prisma'
    )
    .option('-a', '--auth', 'Add JWT auth')
    .option('-s', '--socket', 'Create a socket.io server')
    .option('-d', '--docker', 'Add a dockerfile')
    .option('--git', 'Initialize a git repository')
    .parse(process.argv);
// .action((options) => {
//     console.log(options);
//     promptCreateSetup();
// })

const options = program.opts();

console.log(options);
