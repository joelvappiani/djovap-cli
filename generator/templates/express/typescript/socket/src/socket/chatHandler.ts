import { Socket } from "socket.io"


export const registerChatHandlers = (socket: Socket) => {
    const handleNewMessage = (message: string) => {
        socket.emit('response', `Message recieved : "${message}"`)
    }

    socket.on('message', handleNewMessage)
}
