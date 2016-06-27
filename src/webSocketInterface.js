import { Server as WebSocketServer } from 'ws'

class SocketWrapper {
  constructor (socket) {
    this.socket = socket
  }
  send (action, data) {
    const packet = Object.assign({ action }, data)
    this.socket.send(JSON.stringify(packet))
  }
}

export default function webSocketInterface (matchmaker, server) {
  const ws = new WebSocketServer({ server })
  ws.on('connection', (socket) => {
    const wrap = new SocketWrapper(socket)
    matchmaker.connect(wrap)
    socket.on('message', (str) => {
      const data = JSON.parse(str)
      matchmaker.message(wrap, data).catch((error) =>
        wrap.send('error', {
          message: error.message
        })
      )
    })
    socket.on('close', () => {
      matchmaker.disconnect(wrap)
    })
  })
  return ws
}
