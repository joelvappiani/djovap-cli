import modifyDirectoryContents from './modify.js';
//Creates a websocket server with socket.io
const handleSocket = (options, corePath, projectName) => {
    if (options.socket !== 'yes') return;
    const socketPath = corePath.replace(/core/, 'socket');
    modifyDirectoryContents(socketPath, projectName, 'socket');
};

export default handleSocket;
