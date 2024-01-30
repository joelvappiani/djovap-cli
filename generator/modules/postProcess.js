import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';

const installingMessage = `
                
Installing node dependencies...

`;
const errorMessage = `
                    
⚠ Couldn't install node dependencies

`;

//Commands to execute once the structured is copied
const postProcess = (options) => {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        // cd to project directory
        shell.cd(options.targetPath);
        //install with yarn or npm
        if (options.package === 'yarn') {
            console.log(chalk.yellow(installingMessage));
            const result = shell.exec('yarn install');
            if (result.code !== 0) {
                console.log(chalk.orange(errorMessage));
                return false;
            }
            //install dependencies depending on options
            options.socket === 'yes' && shell.exec('yarn add socket.io');
            options.db === 'mongoDB'
                ? shell.exec('yarn add mongoose')
                : shell.exec('yarn add pg');
            options.auth === 'jwt' && shell.exec('yarn add jsonwebtoken bcrypt');
        } else if (options.package === 'npm') {
            const result = shell.exec('npm install');
            if (result.code !== 0) {
                console.log(chalk.orange(errorMessage));
                return false;
            }
            //install dependencies depending on options
            options.socket === 'yes' && shell.exec('npm install socket.io');
            options.db === 'mongoDB'
                ? shell.exec('npm install mongoose')
                : shell.exec('npm install pg');
            options.auth === 'jwt' && shell.exec('npm install jsonwebtoken bcrypt');
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

export default postProcess;
