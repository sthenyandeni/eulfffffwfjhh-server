const express = require('express')
const app = express()
const cors = require('cors')
const util = require('util')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// const GAME_LIST = [
//     "Game 1",
//     "Game 2",
//     "Game 3",
//     "Game 4",
//     "Game 5"
// ]

// const TEAM_LIST = [
//     "team1",
//     "team2",
//     "team3",
//     "team4",
//     "team5"
// ]

// let data = {}
// for (game_item in GAME_LIST) {
//     let game = {}
//     game.name = GAME_LIST[game_item]
//     game.teams = []

//     for (team_item in TEAM_LIST) {
//         let team = {}
//         team.name = TEAM_LIST[team_item]
//         team.score = 0
//         game.teams.push(team)
//     }
//     data[game.name.toLowerCase().replace(/ /g, '')] = game
// }

const log = (_data) => {
    console.log(util.inspect(_data, {showHidden: false, depth: null, colors: true}))
}

let data = {}

app.get('/:game', (req, res) => {
    let game = req.params.game
    if (Object.keys(data).includes(game)) {
        let response = Object.keys(data[game]).map((value) => {
            return {title: value, score: data[game][value].score}
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
    if (!Object.keys(data).includes(game))
        data[game] = {}
    if (!Object.keys(data[game]).includes(team))
        data[game][team] = {score: 0}
    data[game][team].score = score
    // data[game].teams[team].score = score
    log(data)
    res.sendStatus(200)
})

app.post('/test', (req, res) => {
    log(req.body)
    res.sendStatus(200)
});

app.listen(process.env.PORT || 3000)
