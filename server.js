const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();
let interval;


const getApiAndEmit = (socket) => {
    const response = new Date();
    socket.emit("FromAPI", response);
};

//////////////////////////// New //////////////////////////////

let teamGroupOne = null
let teamGroupTwo = null
let numberOfTeamSelected = 0

let numberOfRulesUnderstood = 0

let randomTheme = ""
const themeTimer = 5000

let numberOfChosenAnimals = 0

let numberOfAnimationQuestionAnswered = 0
let IdOfAnimationQuestionAnswered = []

let isFinalQuestionIsCorrect = true

const teams = {
    "Violette": ["Lucie", "Yohan", "Jean"],
    "Cyan": ["Sacha", "Léo", "Guilhem"],
    "Jaune": ["Léa", "Baptiste", "Timothée"],
    "Rouge": ["Raphaël", "Virgile", "Mathieu"],
    "Verte": ["Alma", "Jeanne", "Emma"],
    "Orange": ["Rose", "Gabrielle", "Inès"],
    "Rose": ["Paul", "Léon", "Lucas"],
    "Minuit": ["Alice", "Lou", "Théo"]
}

const rules = {
    0: "Règles du jeu :",
    1: "Règle 1",
    2: "Règle 2",
    3: "Règle 3"
}

const themeExplanation = {
    "Mutualisme": "Explication brève du mutualisme",
    "Predation": "Explication brève de la prédation",
    "Commensalisme": "Explication brève du commensalisme"
}

const animals = {
    "Mutualisme": {
        "teamGroupOne": {
            "animals": ["Biche", "Truite", "Renard", "Salamandre", "Marmotte", "Cerf", "Crapaud", "Loup", "Lapin", "Aigle"],
            "answer": 7
        },
        "teamGroupTwo": {
            "animals": ["Lézard", "Biche", "Hibou", "Mouton", "Corbeau", "Chat", "Oie", "Chevreuil", "Canard", "Vache"],
            "answer": 4
        }
    },
    "Predation": {
        "teamGroupOne": {
            "animals": ["Biche", "Truite", "Renard", "Salamandre", "Marmotte", "Cerf", "Crapaud", "Loup", "Lapin", "Aigle"],
            "answer": 7
        },
        "teamGroupTwo": {
            "animals": ["Lézard", "Biche", "Hibou", "Mouton", "Corbeau", "Chat", "Oie", "Chevreuil", "Canard", "Vache"],
            "answer": 4
        }
    },
    "Commensalisme": {
        "teamGroupOne": {
            "animals": ["Biche", "Truite", "Renard", "Salamandre", "Marmotte", "Cerf", "Crapaud", "Loup", "Lapin", "Aigle"],
            "answer": 7
        },
        "teamGroupTwo": {
            "animals": ["Lézard", "Biche", "Hibou", "Mouton", "Corbeau", "Chat", "Oie", "Chevreuil", "Canard", "Vache"],
            "answer": 4
        }
    }
}

const answersAnimation = {
    "Mutualisme": {
        "animation": "video/Anim_indice_01_003.mp4",
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 1
    },
    "Predation": {
        "animation": "video/Anim_indice_01_003.mp4",
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 2
    },
    "Commensalisme": {
        "animation": "video/Anim_indice_01_003.mp4",
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 3
    }
}

io.on("connection", (socket) => {

    if (interval) {
        clearInterval(interval);
    }

    socket.on('registerStudent1', () => {
        socket.join('client1');
        console.log('Client 1 enregistré :', socket.id);
    });

    socket.on('registerStudent2', () => {
        socket.join('client2');
        console.log('Client 2 enregistré :', socket.id);
    });

    socket.on('registerAnimationClient', () => {
        socket.join('client3');
        console.log('Client 3 enregistré :', socket.id);
    });

    // TEAMS /////////////////////////////////////////

    io.emit("startExperience", teams);

    numberOfTeamSelected = 0
    numberOfRulesUnderstood = 0
    numberOfChosenAnimals = 0
    numberOfAnimationQuestionAnswered = 0
    IdOfAnimationQuestionAnswered = []
    isFinalQuestionIsCorrect = true

    socket.on("teamChosen", (index) => {
        socket.broadcast.emit("teamChosen", index);
    })

    socket.on("teamChosenGroupeOne", (teamChosen) => {
        teamGroupOne = teamChosen;
        numberOfTeamSelected++
        if (numberOfTeamSelected >= 2) {
            teamsAreDoneShowRules()
        }
    })

    socket.on("teamChosenGroupeTwo", (teamChosen) => {
        teamGroupTwo = teamChosen;
        numberOfTeamSelected++
        if (numberOfTeamSelected >= 2) {
            teamsAreDoneShowRules()
        }
    })

    // RULES /////////////////////////////////////////

    function teamsAreDoneShowRules() {
        if (numberOfTeamSelected >= 2) {
            io.emit('teamsAreDoneShowRules', rules);
        }
    }

    socket.on("rulesAreUnderstood", () => {
        numberOfRulesUnderstood++
        if (numberOfRulesUnderstood >= 2) {
            io.emit('rulesAreDoneSelectThemeRandomly');
        }
    })

    // THEME /////////////////////////////////////////

    socket.on("themeIsRandomlyChosen", (data) => {
        randomTheme = data[0]
        setTimeout(() => {
            io.emit('themeIsSelectedShowThemeExplanation', themeExplanation[randomTheme])
            setTimeout(() => {
                const themeIndex = data[1]
                const dataTurnByTurn = [teams, teamGroupOne, teamGroupTwo, randomTheme, Object.values(animals)[themeIndex]]
                io.emit('startTurnByTurn', dataTurnByTurn)
            }, themeTimer)
        }, themeTimer)
    })

    // ANIMAL CHOSEN  ////////////////////////////////

    socket.on("animalChosen", () => {
        numberOfChosenAnimals++
        if (numberOfChosenAnimals >= 2) {
            io.emit("animation", answersAnimation[randomTheme])
        }
    })

    // ANIMATION IS DONE  ////////////////////////////

    socket.on("animationIsDoneAskQuestion", (data) => {
        io.emit("askQuestion", data)
    })

    // ANIMATION IS ANSWERED  ////////////////////////

    socket.on("animationQuestionIsAnswered", (answerId) => {
        numberOfAnimationQuestionAnswered++
        IdOfAnimationQuestionAnswered.push(answerId)
        socket.broadcast.emit("animationQuestionIsAnswered", answerId);
        if (numberOfAnimationQuestionAnswered >= 2) {
            checkIfAnimationQuestionIsCorrect()
            const data = [isFinalQuestionIsCorrect, answersAnimation[randomTheme].correctAnswer]
            io.emit("revealAnimationCorrectAnswer", data)
        }
    })

    function checkIfAnimationQuestionIsCorrect() {
        IdOfAnimationQuestionAnswered.map((answerId) => {
            if (answerId !== answersAnimation[randomTheme].correctAnswer) {
                isFinalQuestionIsCorrect = false
            }
        })
    }

    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        clearInterval(interval);
    })

});

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res)
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});