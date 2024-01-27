import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
//Commands to execute once the structured is copied
const postProcess = (options) => {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        // cd to project directory
        shell.cd(options.targetPath);
        //install with yarn or npm
        if (options.package === 'yarn') {
            console.log(
                chalk.yellow(`
                
Installing node dependencies...

                `)
            );
            const result = shell.exec('yarn install');
            if (result.code !== 0) {
                console.log(
                    chalk.orange(`
                    
⚠ Couldn't install node dependencies please run yarn install

                    `)
                );
                return false;
            }
            options.socket === 'yes' && shell.exec('yarn add socket.io');
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
            options.socket === 'yes' && shell.exec('npm install socket.io');
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

export default postProcess;
