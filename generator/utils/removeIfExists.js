import fs from 'fs';

//If a file or a folder exists : remove it before continuing
const removeIfExists = (writePath) => {
    if (fs.existsSync(writePath)) {
        fs.rmSync(writePath, { recursive: true });
    }
};

export default removeIfExists;
