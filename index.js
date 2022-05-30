const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = '8912'

const GAME_LIST = [
    "Game 1",
    "Game 2",
    "Game 3",
    "Game 4",
    "Game 5"
]

const TEAM_LIST = [
    "team1",
    "team2",
    "team3",
    "team4",
    "team5"
]

let data = {}
for (game_item in GAME_LIST) {
    let game = {}
    game.name = GAME_LIST[game_item]
    game.teams = []

    for (team_item in TEAM_LIST) {
        let team = {}
        team.name = TEAM_LIST[team_item]
        team.score = 0
        game.teams.push(team)
    }
    data[game.name.toLowerCase().replace(/ /g, '')] = game
}

app.get('/:game', (req, res) => {
    let game = req.params.game
    if (Object.keys(data).includes(game)) {
        res.json(data[game])
    }
    else {
        res.sendStatus(404)
    }
})

app.post('/', (req, res) => {
    let {game, team, score} = req.body
    data[game].teams[team].score = score
    res.sendStatus(200)
})

app.post('/test', (req, res) => {
    console.log(req.body)
    res.sendStatus(200)
});

app.listen(PORT, () => console.log(`Localhost listening on port ${PORT}`))
