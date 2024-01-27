import modifyDirectoryContents from './modify.js';
//Adds connection to a db and basic structure and CRUD
const handleDb = (options, corePath, projectName) => {
    if (options.db === 'mongoDB') {
        const mongoosePath = corePath.replace(/core/, 'mongoose');
        modifyDirectoryContents(mongoosePath, projectName, 'mongoose');
    } else if (options.db === 'postgreSQL') {
        // complete later
    } else {
        throw new Error('Error in option.db');
    }
};

export default handleDb;
