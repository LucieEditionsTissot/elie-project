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

    //// Créer des types à partager entre le front et le back, les events, liste des clients et liste des events

    //// Clients : Student1, Student2, CentralAnimation
    //// Types : Audio, Vidéos
    //// Composant bas niveau : AudioPlayer, VideoPlayer
    //// Events :
    // Start : Démarrage de la map sur client central, chargement de l'audio1 et de la map1,
    // Rules : Audio1 pause, chargement de l'audio 2 et map 2 pour l'explication des règles
    // Theme chosen : Audio 2 pause, redémarrage de l'audio 1 et de la vidéo 1
    // Indice 1 : Pause de la vidéo 1, Démarrage de la vidéo 3, possibilité de restart
    // Fin de l'indice : Pause de la vidéo 3 démarrage de la vidéo 1
    // Indice numéro 2 : Lancement de l'audio 2-1 Student1, lancement de l'audio 2-2 Student2, possibilité de restart
    // Fin de l'indice : Pause des audios 2-1 & 2-2
    // Indice numéro 3 : Lancement des audios 3-1 pour Student1 & 3-2 pour Student2, pause de la vidéo 1 et lancement de la vidéo 4,
    // Fin de l'indice : Pause des audios 3-1 & 3-2, pause de la vidéo 4, lancement de la vidéo 1
    // Réponse : Fin de la vidéo 1, lancement de la vidéo 5, lancement de l'audio 4 (indices communs & vidéo interaction),
    // Solution : Fin vidéo 5 et audio 4, lancement de la vidéo 6 et audio 5,
    // Animation final : Fin de l'audio 5 et boucle sur la vidéo 6.

    io.emit("startExperience", teams);

    numberOfTeamSelected = 0
    numberOfRulesUnderstood = 0
    numberOfChosenAnimals = 0
    numberOfAnimationQuestionAnswered = 0
    IdOfAnimationQuestionAnswered = []
    isFinalQuestionIsCorrect = true
    // Démarrage vidéo 1 & audio 1
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
            // Fin audio 1 & Vidéo 1, lancement audio 2 & vidéo 2
        }
    }

    socket.on("rulesAreUnderstood", () => {
        numberOfRulesUnderstood++
        if (numberOfRulesUnderstood >= 2) {
            io.emit('rulesAreDoneSelectThemeRandomly');
            // Fin audio 2 & Vidéo 2, lancement audio 1 & vidéo 1
        }
    })

    // THEME /////////////////////////////////////////

    socket.on("themeIsRandomlyChosen", (data) => {
        randomTheme = data[0]
        setTimeout(() => {
            io.emit('themeIsSelectedShowThemeExplanation', themeExplanation[randomTheme])
            // Fin audio 1 & Vidéo 1, lancement audio 3 & vidéo 3
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