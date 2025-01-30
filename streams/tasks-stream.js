import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvTasksPath = new URL('tasks.csv', import.meta.url)

const streamTasks = fs.createReadStream(csvTasksPath)

const csvFormattation = parse({
    delimiter: ',',
    skip_empty_lines: true,
    fromLine: 2
})

async function csvTasksStream() {
    const linesFormatted = streamTasks.pipe(csvFormattation)

    for await (const [title, description] of linesFormatted) {
        fetch('http://localhost:3333/task', {
            method: 'POST',
            headers: {
                'Content-type': 'applications/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        })
    }
}

csvTasksStream()