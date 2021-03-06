const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
const app = express()

morgan.token('body', function getId(req) {
    return req.body.data
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':body :method :url :status :res[content-length] - :response-time ms')
)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

let notes2 = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.get('/info', (req, res) => {
    const num = notes2.length
    const curTime = new Date().toISOString()
    console.log(curTime)
    res.send('<div><p>Phonebook hs info for ' + num + ' people</p><p>' + curTime + '</p></div>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/persons', (req, res) => {
    res.json(notes2)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const newNote = request.body
    notes = notes.filter(note => note.id !== id)
    notes = notes.concat(newNote)
    console.log(notes)
})

// ???????????????
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)






