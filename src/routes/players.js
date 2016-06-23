import { Router } from 'express'

export default () => Router()
  .get('/', (req, res, next) => {
    req.db.players.all()
      .then((players) => res.json({ data: players }))
      .catch(next)
  })
  .get('/:id', (req, res, next) => {
    req.db.players.find(req.params.id)
      .then((player) => res.json({ data: player }))
      .catch(next)
  })
  .post('/', (req, res, next) => {
    req.db.players.create({
      name: req.body.name
    }).then((player) => res.json({ data: player }))
      .catch(next)
  })
