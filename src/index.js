import express from 'express'
import { json as jsonBodyParser } from 'body-parser'

import Players from './Players'
import Rooms from './Rooms'
import Matchmaker from './Matchmaker'
import playerRoutes from './routes/players'
import roomRoutes from './routes/rooms'

const app = express()
const server = app.listen(process.env.PORT || 80)

const db = {
  players: new Players(),
  rooms: new Rooms()
}

const matchmaker = new Matchmaker(db)

app.use(jsonBodyParser())

app.use((req, res, next) => {
  req.matchmaker = matchmaker
  req.db = db
  next()
})

app.use('/players', playerRoutes())
app.use('/rooms', roomRoutes())
