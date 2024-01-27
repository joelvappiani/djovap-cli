import removeIfExists from '../utils/removeIfExists.js';
import skipIfExists from '../utils/skipIfExists.js';
import path from 'path';
import fs from 'fs';
import { CURR_DIR } from '../../bin/index.js';

const modifyDirectoryContents = (templatePath, projectName) => {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);

    // loop each file/folder
    filesToCreate.forEach((file) => {
        const origFilePath = path.join(templatePath, file);

        // get stats about the current file to know if it's a file or a directory
        const stats = fs.statSync(origFilePath);
        // Path to create file/folder
        const writePath = path.join(CURR_DIR, projectName, file);
        // Remove before creating if it's not src folder

        if (stats.isFile()) {
            //Remove file if exists
            removeIfExists(writePath);

            // read file and wright it at the right path
            let contents = fs.readFileSync(origFilePath, 'utf8');
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder if the folder doesn't exist
            if (!skipIfExists(writePath)) {
                fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            }
            // copy files/folder inside current folder recursively
            modifyDirectoryContents(
                path.join(templatePath, file),
                path.join(projectName, file)
            );
        }
    });
};

export default modifyDirectoryContents;
