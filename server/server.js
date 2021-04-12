const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 5000
const path = require('path')

app.use(express.static(path.join(__dirname, '..', 'ui', 'build')))
app.use(express.static('public'))

app.get('/templates', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'ui', 'build', 'index.html'))
})

app.post('/api/addSnippet', (req, res) => {
    const { user, snippet, name, id } = req.body
    const filename = path.join('data', 'snippets', `${user}.json`)
    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error(`There was a problem with the file: ${filename}`)
            res.status(400).send({
                message: `There was an error adding a new snippet to user's data`,
            })
        } else {
            const parsedData = JSON.parse(data)
            const updatedData = [...parsedData, { snippet, name, id }]
            fs.writeFile(
                filename,
                JSON.stringify(updatedData, null, 4),
                (err) => {
                    if (err) console.error(err)
                    console.log(`${filename} has been updated!`)
                }
            )
            res.status(200).send()
        }
    })
})

app.post('/api/deleteSnippet', (req, res) => {
    const { user, id } = req.body
    const filename = path.join('data', 'snippets', `${user}.json`)
    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error(
                `DeleteSnippet: There was a problem with the file: ${filename}`
            )
            res.status(400).send({
                message: `There was an error deleting snippet`,
            })
        } else {
            const parsedData = JSON.parse(data)
            const updatedData = parsedData.filter(
                (snippet) => snippet.id !== id
            )
            fs.writeFile(
                filename,
                JSON.stringify(updatedData, null, 4),
                (err) => {
                    if (err) console.error(err)
                    console.log(`${filename} has been updated!`)
                }
            )
            res.status(200).send()
        }
    })
})

app.get('/api/getSnippets', (req, res) => {
    console.log(`getSnippets: User ${req.query.user} requested data`)
    const filename = path.join(
        'data',
        'snippets',
        String(req.query.user) + '.json'
    )
    fs.access(filename, (err) => {
        if (err) {
            fs.writeFile(filename, JSON.stringify([]), (err) => {
                console.log(err)
            })
        }
    })

    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error(
                `getSnippet:There was a problem with the file: ${filename}`
            )
            res.status(400).send({
                message: `There was an error sending snippets`,
            })
        } else {
            const parsedData = JSON.parse(data)
            console.log('getSnippets: OK')
            res.status(200).send(parsedData)
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
