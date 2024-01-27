//If the folder exists skip the creation of it
const skipIfExists = (writePath) => {
    const SKIP_FOLDERS = ['src', 'config'];
    return SKIP_FOLDERS.includes(writePath.split('/').slice(-1)[0]);
};

export default skipIfExists;
