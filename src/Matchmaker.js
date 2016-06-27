export class Connection {
  constructor (bearer) {
    this.player = null
    this.bearer = bearer
  }

  send (action, data) {
    return this.bearer.send(action, data)
  }
}

export default class Matchmaker {
  constructor (db) {
    this.db = db
    this.connections = new Map()

    this.actions = {
      join: ({ player }, d) => this.join(player, d.room),
      leave: ({ player }) => this.leave(player),
      name: (connection, d) => this.name(connection, d.name)
    }
  }

  get players () {
    return this.db.players
  }

  get rooms () {
    return this.db.rooms
  }

  async join (player, roomId) {
    if (!player) {
      throw new Exception('You need to be authenticated to join a game.')
    }
    await this.leave(player)
    const room = await this.rooms.find(roomId)
    room.join(player.id)
    await this.rooms.save(room)
  }

  async leave (player) {
    const room = await this.rooms.findByPlayer(player.id)
    if (room) {
      room.leave(player.id)
      await this.rooms.save(room)
    }
  }

  async name (connection, name) {
    if (connection.player) {
      connection.player.name = name
      await this.players.save(connection.player)
    } else {
      connection.player = await this.players.create({ name })
    }
  }

  connect (bearer) {
    this.connections.set(bearer, new Connection(bearer))
  }

  async disconnect (bearer) {
    if (!this.connections.has(bearer)) {
      return
    }
    const connection = this.connections.get(bearer)
    if (connection.player) {
      await this.matchmaker.leave(connection.player)
      await this.db.players.delete(connection.player)
    }
    this.connections.delete(bearer)
  }

  async message (bearer, data) {
    const action = this.actions[data.action]
    if (action) {
      const connection = this.connections.get(bearer)
      await action(connection, data)
    }
  }
}
