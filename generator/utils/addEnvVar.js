import fs from 'fs';
import path from 'path';
// Modify env variables and add the right variables depending on the options
const addEnvVar = (targetPath, options) => {
    const envPath = path.join(targetPath, '/env');
    if (options.socket === 'yes') {
        fs.appendFile(
            `${envPath}/.env.development`,
            '\nSOCKET_PORT=3100',
            'utf8',
            (err) => {
                if (err) {
                    console.log(chalk.red('Impossible to add environment variable'));
                }
            }
        );
        fs.appendFile(
            `${envPath}/.env.production`,
            '\nSOCKET_PORT=4100',
            'utf8',
            (err) => {
                if (err) {
                    console.log(chalk.red('Impossible to add environment variable'));
                }
            }
        );
        fs.appendFile(`${envPath}/.env.staging`, '\nSOCKET_PORT=5100', 'utf8', (err) => {
            if (err) {
                console.log(chalk.red('Impossible to add environment variable'));
            }
        });
    }
    if (options.db === 'mongoDB') {
        fs.appendFile(
            `${envPath}/.env.development`,
            '\nDB_CONNECTION_STRING=mongodb+srv://.../template',
            'utf8',
            (err) => {
                if (err) {
                    console.log(chalk.red('Impossible to add environment variable'));
                }
            }
        );
        fs.appendFile(
            `${envPath}/.env.production`,
            '\nDB_CONNECTION_STRING=mongodb+srv://.../template',
            'utf8',
            (err) => {
                if (err) {
                    console.log(chalk.red('Impossible to add environment variable'));
                }
            }
        );
        fs.appendFile(
            `${envPath}/.env.staging`,
            '\nDB_CONNECTION_STRING=mongodb+srv://.../template',
            'utf8',
            (err) => {
                if (err) {
                    console.log(chalk.red('Impossible to add environment variable'));
                }
            }
        );
    }
};

export default addEnvVar;
