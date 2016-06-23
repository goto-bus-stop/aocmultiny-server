import { Router } from 'express'

export default () => Router()
  .get('/', (req, res, next) => {
    req.db.rooms.all()
      .then((rooms) => res.json({ data: rooms }))
      .catch(next)
  })
  .get('/:id', (req, res, next) => {
    req.db.rooms.find(req.params.id)
      .then((room) => res.json({ data: room }))
      .catch(next)
  })
  .post('/', (req, res, next) => {
    req.db.rooms.create({
      name: req.body.name
    }).then((room) => res.json({ data: room }))
      .catch(next)
  })
