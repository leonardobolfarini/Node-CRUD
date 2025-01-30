import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const db = new Database()

export const routes = [
    {
        method: 'GET',
        path:  buildRoutePath('/task'),
        handler: (req, res) => {
            const tasks = db.select('tasks')
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(400).end("Title or Description is missing.")
            }

            const tasks = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date(),
                completed_at: null,
                updated_at: null
            }

            db.insert('tasks', tasks)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(400).end("Title or Description is missing.")
            }

            const idIsCorrect = db.itemExists('tasks', id)

            if (!idIsCorrect) {
                return res.writeHead(404).end(`ID ${id} not found on database.`)
            }

            db.update('tasks', id, {
                title,
                description
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const idIsCorrect = db.itemExists('tasks', id)

            if (!idIsCorrect) {
                return res.writeHead(404).end(`ID ${id} not found on database.`)
            }

            db.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/task/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const idIsCorrect = db.itemExists('tasks', id)

            if (!idIsCorrect) {
                return res.writeHead(404).end(`ID ${id} not found on database.`)
            }

            db.setComplete('tasks', id)

            return res.writeHead(204).end()
        }
    }
] 