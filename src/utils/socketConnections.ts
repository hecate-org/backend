interface SocketConnections {
    [key: string]: string
}

export let socketConnections:SocketConnections = {};

export const addSocketConnection = (socketId: string, userId: string) => {
  socketConnections[socketId] = userId
};

export const removeSocketConnection = (socketId: string) => {
    delete socketConnections[socketId]
};