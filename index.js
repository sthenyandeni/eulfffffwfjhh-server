const express = require('express')
const app = express()
const cors = require('cors')
const util = require('util')
const fs = require('fs')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const log = (_data) => {
    log(util.inspect(_data, {showHidden: false, depth: null, colors: true}))
}

let teams = {}

let data = {}

let games = [
    'hotPotato',
    'theBiggerTheyAre',
    'floatingPointException',
    'thisBlows',
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

// const init = () => {
//     let rawText = fs.readFileSync('teams.json')
//     teams = JSON.parse(rawText)
// }

const getTeamNameByTableNumber = (tableNumber) => {
    let teamKeys = Object.keys(teams)
    for (let i = 0; i < teamKeys.length; i++) {
        let team = teams[teamKeys[i]]
        if (team.number == tableNumber)
            return team.email
    }
}

const getTeamNameByEmail = (email) => {
    let teamKeys = Object.keys(teams)
    for (let i = 0; i < teamKeys.length; i++) {
        let team = teams[teamKeys[i]]
        if (team.email == email)
            return team.name
    }
}

app.post('/register', (req, res) => {
    // console.log('Registering team body')
    // log(req.body)

    let teamList = req.body;

    for (let i = 0; i < teamList.length; i++) {
        let {email, number, name} = teamList[i];
        if (!email || !number || !name) {
            res.sendStatus(400).
            return
        }
        teams[email] = {email, number, name}
    }

    fs.writeFileSync('teams.json', JSON.stringify(teams))

    // console.log('Teams structure')
    // log(teams)

    res.sendStatus(200)
})

app.get('/leaderboard', (req, res) => {
    // let rawText = fs.readFileSync('games.json')
    // let data = JSON.parse(rawText)
    let gameKeys = Object.keys(data);
    let objectResponse = {}
    for (let i = 0; i < gameKeys.length; i++) {
        let game = data[gameKeys[i]];
        let gameTeamKeys = Object.keys(game)
        for (let j = 0; j < gameTeamKeys.length; j++) {
            let team = gameTeamKeys[j]
            if (!Object.keys(objectResponse).includes(team)) {
                objectResponse[team] = 0
            }
            objectResponse[team] += parseInt(game[team].score)
        }
    }

    let response = [];
    let teamKeys = Object.keys(objectResponse)
    for (let i = 0; i < teamKeys.length; i++)
        response.push({name: getTeamNameByEmail(teamKeys[i]), score: objectResponse[teamKeys[i]]})

    response.sort((a, b) => b.score - a.score)
    // console.log('Leaderboard')
    // log(response);
    res.json(response);
})

app.get('/teams', (req, res) => {
    res.json(teams)
})

app.get('/team_names', (req, res) => {
    let names = Object.keys(teams).map((value) => ({name: teams[value].name, number: teams[value].number}))
    if (names.length == 0) {
        res.sendStatus(404)
        return
    }
    res.json(names)
})

app.post('/test', (req, res) => {
    // log(req.body)
    res.sendStatus(200)
});

app.post('/', (req, res) => {
    // console.log('Request body')
    // log(req.body)

    let {game, scores} = req.body;
    if (games.includes(game)) {
        data[game] = {}
        for (let i = 0; i < scores.length; i++) {
            let {score, team} = scores[i];
            if (!Object.keys(data[game]).includes(team)) {
                data[game][team] = {score: 0}
            }
            data[game][team].score = parseInt(score)
        }
        // console.log('Output data')
        // log(data)
        res.sendStatus(200)
    }
})

app.get('/json/teams', (req, res) => {
    res.json(teams)
})

app.post('/json/teams', (req, res) => {
    teams = req.body
    fs.writeFileSync('teams.json', JSON.stringify(teams))
    res.sendStatus(200)
})

app.get('/json/games', (req, res) => {
    res.json(data)
})

app.post('/json/games', (req, res) => {
    data = req.body
    fs.writeFileSync('games.json', JSON.stringify(data))
    res.sendStatus(200)
})

app.post('/reset/all', (req, res) => {
    data = {}
    fs.writeFileSync('games.json', JSON.stringify(data))

    teams = {}
    fs.writeFileSync('teams.json', JSON.stringify(teams))

    res.sendStatus(200)
})

app.post('/reset/:game', (req, res) => {
    let game = req.params.game
    if (Object.keys(data).includes(game)) {
        data[game] = {}
        fs.writeFileSync('games.json', JSON.stringify(data))
        res.sendStatus(200)
    }
    else {
        res.sendStatus(404)
    }
})

app.post('/mummyWrap', (req, res) => {
    // console.log('Mummy wrap')
    // log(req.body)

    let {game, scores} = req.body;
    if (games.includes(game)) {
        data[game] = {}
        let mappedScores = scores.map((value) => ({
            score: value.score,
            team: getTeamNameByTableNumber(value.team)
        })).filter((value) => value.team)
        // console.log('Mapped Scores')
        // log(mappedScores)
        for (let i = 0; i < mappedScores.length; i++) {
            let {score, team} = mappedScores[i];
            if (!Object.keys(data[game]).includes(team)) {
                data[game][team] = {score: 0}
            }
            data[game][team].score = parseInt(score)
        }
        // console.log('Output data')
        // log(data)
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
        res.json(response)
    }
    else {
        res.sendStatus(404)
    }
})

// init()

app.listen(process.env.PORT || 8090, () => console.log('Listening'))
