import { v4 as uuid } from 'uuid'

export class Player {
  constructor (name) {
    this.id = uuid()
    this.name = name
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name
    }
  }
}

export default class Players {
  constructor () {
    this.players = {}
  }

  find (id) {
    return Promise.resolve(this.players[id])
  }

  all () {
    return Promise.resolve(
      Object.keys(this.players).map((id) => this.players[id])
    )
  }

  create ({ name }) {
    const player = new Player(name)
    return this.save(player)
  }

  save (player) {
    if (!(player instanceof Player)) {
      return Promise.reject(new TypeError('Can only save instances of Player'))
    }
    this.players[player.id] = player
    return Promise.resolve(player)
  }

  delete (player) {
    delete this.players[player.id]
    return Promise.resolve({})
  }
}
