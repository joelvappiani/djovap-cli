import app from './app';
import { envConfig } from './config';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { registerChatHandlers, ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './socket';

const { NODE_ENV, PORT, SOCKET_PORT } = envConfig
const socketServer = createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(socketServer, {})

const onConnection = (socket: Socket) => {
    socket.emit('connected', '⚡️ Socket connected')
    console.log('⚡️ Socket connected')
    registerChatHandlers(socket);
}

io.on("connection", onConnection)


app.listen(PORT, () => {
    console.log(`NODE_ENV=${NODE_ENV}`)
    console.log(`Server connected on port ${PORT}`)
})

socketServer.listen(SOCKET_PORT)
