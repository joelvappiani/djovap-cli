import * as ejs from 'ejs';
import handleDb from './handleDb.js';
import handleSocket from './handleSocket.js';
import addEnvVar from '../utils/addEnvVar.js';
import postProcess from './postProcess.js';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { CURR_DIR, __dirname } from '../../bin/index.js';

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

//Create contents of directory recursively
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
    handleSocket(options, templatePath, name);
    handleDb(options, templatePath, name);
    addEnvVar(targetPath, options);
    const result = postProcess(options);

    if (result) {
        console.log(
            chalk.green(`

    ✅ Generation completed successfully !

            `)
        );
    }
};

export default createProject;
