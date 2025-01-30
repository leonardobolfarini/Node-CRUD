import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, "utf8")
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table) {
        const tasks = this.#database[table] ?? []

        return tasks
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        
        if (rowIndex > -1) {
            const { title, description } = data

            const { created_at, completed_at } = this.#database[table][rowIndex]

            this.#database[table][rowIndex] = {
                id,
                title,
                description,
                created_at,
                updated_at: new Date(),
                completed_at
            }
            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    setComplete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            const data = this.#database[table][rowIndex]

            this.#database[table][rowIndex] = {
                ...data,
                completed_at: new Date()
            }

            this.#persist
        }
    }

    itemExists(table, id) {
        const itemExistsOnDatabase = this.#database[table].findIndex(row => row.id === id)

        if (itemExistsOnDatabase === -1) {
            return false
        } else {
            return true
        }
    }
}