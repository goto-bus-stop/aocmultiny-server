import express from 'express'
import { json as jsonBodyParser } from 'body-parser'

import Players from './Players'
import Rooms from './Rooms'
import playerRoutes from './routes/players'
import roomRoutes from './routes/rooms'

const app = express()

const db = {
  players: new Players(),
  rooms: new Rooms()
}

app.use(jsonBodyParser())

app.use((req, res, next) => {
  req.db = db
  next()
})

app.use('/players', playerRoutes())
app.use('/rooms', roomRoutes())

app.listen(process.env.PORT || 80)
