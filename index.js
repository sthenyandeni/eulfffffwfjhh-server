const express = require('express')
const app = express()
const cors = require('cors')
const util = require('util')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const log = (_data) => {
    console.log(util.inspect(_data, {showHidden: false, depth: null, colors: true}))
}

let teams = {}

let games = [
    'hotPotato',
    'theBiggerTheyAre',
    'floatingPointException',
    'thisBlows', //Standard
    'stackOverflow',
    'stackExchange',
    'selectionSort',
    'dontSlip',
    'pinTheBreakpoint',
    'beTheEasel',
    'mummyWrap',
    'suckItUp',
    'faceTheCookie',
    'tryCatch',
    'potatoPass'
]

let data = {}

app.post('/register', (req, res) => {
    console.log('Registering team')
    console.log(req.body)

    let {email, number, name} = req.body;
    if (!email || !number || !name) {
        res.sendStatus(400).
        return
    }
    teams[email] = {email, number, name}

    console.log('Teams')
    console.log(teams)

    res.sendStatus(200)
})

app.get('/teams', (req, res) => {
    res.json(teams)
})

app.get('/team_names', (req, res) => {
    let names = Object.keys(teams).map((value) => teams[value].name)
    if (names.length == 0) {
        res.sendStatus(404)
        return
    }
    res.json(names)
})

app.post('/test', (req, res) => {
    log(req.body)
    res.sendStatus(200)
});

app.post('/floatingPointException', (req, res) => {
    let {game, scores} = req.body;
    if (games.includes(game)) {
        if (!Object.keys(data).includes(game)) {
            data[game] = {}
        }
        for (let i = 0; i < scores.length; i++) {
            let {score, team} = scores[i];
            if (!Object.keys(data[game]).includes(team)) {
                data[game][team] = {score: 0}
            }
            data[game][team].score = score
        }
        res.sendStatus(200)
    }
})

app.get('/:game', (req, res) => {
    let game = req.params.game
    if (Object.keys(data).includes(game)) {
        let response = Object.keys(data[game]).map((email) => {
            return {name: teams[email].name, score: data[game][email].score}
        })
        response.sort((a, b) => b.score - a.score)
        console.log(response)
        res.json(response)
    }
    else {
        res.sendStatus(404)
    }
})

app.post('/', (req, res) => {
    let {game, team, score} = req.body
    if (games.includes(game)) {
        if (!Object.keys(data).includes(game)) {
            data[game] = {}
        }
        if (!Object.keys(data[game]).includes(team)) {
            data[game][team] = {score: 0}
        }
        data[game][team].score = score
        res.sendStatus(200)
    }
})

app.listen(process.env.PORT || 3000, () => console.log('Listening'))
