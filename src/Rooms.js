import { v4 as uuid } from 'uuid'

export function Room (name) {
  if (!(this instanceof Room)) {
    return new Room(name)
  }
  this.id = uuid()
  this.name = name
}

Object.assign(Room.prototype, {
  toJSON () {
    return {
      id: this.id,
      name: this.name
    }
  }
})

export default function Rooms () {
  if (!(this instanceof Rooms)) {
    return new Rooms()
  }

  this.rooms = {}
}

Object.assign(Rooms.prototype, {
  find (id) {
    return Promise.resolve(this.rooms[id])
  },
  all () {
    return Promise.resolve(
      Object.keys(this.rooms).map((id) => this.rooms[id])
    )
  },
  create ({ name }) {
    const room = new Room(name)
    return this.save(room)
  },
  save (room) {
    if (!(room instanceof Room)) {
      return Promise.reject(new TypeError('Can only save instances of Room'))
    }
    this.rooms[room.id] = room
    return Promise.resolve(room)
  }
})
