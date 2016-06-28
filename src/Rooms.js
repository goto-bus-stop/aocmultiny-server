import { v4 as uuid } from 'uuid'

export class Room {
  constructor (name) {
    this.id = uuid()
    this.name = name
    this.players = []
  }

  join (id) {
    this.players = this.players.concat([ id ])
  }

  leave (id) {
    this.players = this.players.filter((player) => player.id !== id)
  }

  empty () {
    return this.players.length === 0
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      players: this.players
    }
  }
}

export default class Rooms {
  constructor () {
    this.rooms = {}
  }

  find (id) {
    return Promise.resolve(this.rooms[id])
  }

  async findByPlayer (id) {
    const rooms = await this.all()
    return rooms.find((room) => room.players.includes(id))
  }

  all () {
    return Promise.resolve(
      Object.keys(this.rooms).map((id) => this.rooms[id])
    )
  }

  create ({ name }) {
    const room = new Room(name)
    return this.save(room)
  }

  save (room) {
    if (!(room instanceof Room)) {
      return Promise.reject(new TypeError('Can only save instances of Room'))
    }
    this.rooms[room.id] = room
    return Promise.resolve(room)
  }
}
