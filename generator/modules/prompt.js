import inquirer from 'inquirer';
import createProject from './create.js';

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
        choices: ['jwt', 'no'],
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

export default promptCreateSetup;
