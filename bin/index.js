#! /usr/bin/env node
import { URL } from 'url';
import { program } from 'commander';
import promptCreateSetup from '../generator/modules/prompt.js';

// adds jwt auth to the template
// const handleAuth = (db) => {
//     switch (db) {
//         case 'mongoose':
//             shell.cd(options.targetPath);
//             shell.exec(
//                 options.package === 'yarn' ? 'yarn add mongoose' : 'npm install mongoose'
//             );
//             break;
//         case 'postgres':
//             break;
//     }
// };

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

//current directory
export const CURR_DIR = process.cwd();

//Handles __dirname in ES modules node
export const __dirname = new URL('.', import.meta.url).pathname;
