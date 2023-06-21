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
const config = require('./config');

const getApiAndEmit = (socket) => {
    const response = new Date();
    socket.emit("FromAPI", response);
};

//////////////////////////// New //////////////////////////////

let teamGroupOne = null
let teamGroupTwo = null
let numberOfTeamSelected = 0
let numberOfTeamWhoWantsToContinue = 0
let numberOfRulesUnderstood = 0

const themeTimer = 5000
let randomTheme = null;
let numberOfChosenAnimals = 0
let numberOfButtonClicked = 0;
let numberOfAnimationQuestionAnswered = 0
let IdOfAnimationQuestionAnswered = []
let numberOfCardsView = 0;
let isFinalQuestionIsCorrect = true
let isInformationUnderstood = 0
let animalChosenValue = null;

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
            "animals": [
                {
                    "name": "Biche",
                    "explanation": "Explication sur la biche...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Truite",
                    "explanation": "Explication sur la truite...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Renard",
                    "explanation": "Explication sur le renard...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Salamandre",
                    "explanation": "Explication sur la salamandre...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Marmotte",
                    "explanation": "Explication sur la marmotte...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Cerf",
                    "explanation": "Explication sur le cerf...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Crapaud",
                    "explanation": "Explication sur le crapaud...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Loup",
                    "explanation": "Le loup est un chasseur capable d'attraper la plupart des proies.Il sagit d'un animal principalement carnivore, raison pour laquelle il est courant de le voir se nourrir d'autres animaux plus petits ou certains animaux de plus grandes tailles.Ils ont un incroyable sens de l'odorat et de l'audition. Ce sont leurs organes les plus développés, ce qui leur permet de débusquer facilement leurs proies et communiquer",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Lapin",
                    "explanation": "Explication sur le lapin...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Aigle",
                    "explanation": "Explication sur l'aigle...",
                    "image": "",
                    "icon": ""
                }
            ],
            "answer": 7
        },
        "teamGroupTwo": {
            "animals": [
                {
                    "name": "Lézard",
                    "explanation": "Explication sur le lézard...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Biche",
                    "explanation": "Explication sur la biche...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Hibou",
                    "explanation": "Explication sur le hibou...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Papillon",
                    "explanation": "Explication sur le papillon...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Corbeau",
                    "explanation": "Explication sur l'écureuil...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Coccinelle",
                    "explanation": "Explication sur la coccinelle...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Faucon",
                    "explanation": "Explication sur le faucon...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Chouette",
                    "explanation": "Explication sur la chouette...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Rat",
                    "explanation": "Explication sur le rat...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Loup",
                    "explanation": "Le loup est un chasseur capable d'attraper la plupart des proies.Il sagit d'un animal principalement carnivore, raison pour laquelle il est courant de le voir se nourrir d'autres animaux plus petits ou certains animaux de plus grandes tailles.Ils ont un incroyable sens de l'odorat et de l'audition. Ce sont leurs organes les plus développés, ce qui leur permet de débusquer facilement leurs proies et communiquer",

                    "image": "",
                    "icon": ""
                }
            ],
            "answer": 4
        }
    },
    "Predation": {
        "teamGroupOne": {
            "animals": [
                {
                    "name": "Biche",
                    "explanation": "Explication sur la biche...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Truite",
                    "explanation": "Explication sur la truite...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Renard",
                    "explanation": "Explication sur le renard...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Salamandre",
                    "explanation": "Explication sur la salamandre...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Marmotte",
                    "explanation": "Explication sur la marmotte...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Cerf",
                    "explanation": "Explication sur le cerf...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Crapaud",
                    "explanation": "Explication sur le crapaud...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Loup",
                    "explanation": "Le loup est un chasseur capable d'attraper la plupart des proies.Il sagit d'un animal principalement carnivore, raison pour laquelle il est courant de le voir se nourrir d'autres animaux plus petits ou certains animaux de plus grandes tailles.Ils ont un incroyable sens de l'odorat et de l'audition. Ce sont leurs organes les plus développés, ce qui leur permet de débusquer facilement leurs proies et communiquer",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Lapin",
                    "explanation": "Explication sur le lapin...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Aigle",
                    "explanation": "Explication sur l'aigle...",
                    "image": "",
                    "icon": ""
                }
            ],
            "answer": 9
        },
        "teamGroupTwo": {
            "animals": [
                {
                    "name": "Lézard",
                    "explanation": "Explication sur le lézard...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Biche",
                    "explanation": "Explication sur la biche...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Hibou",
                    "explanation": "Explication sur le hibou...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Papillon",
                    "explanation": "Explication sur le papillon...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Ecureuil",
                    "explanation": "Explication sur l'écureuil...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Coccinelle",
                    "explanation": "Explication sur la coccinelle...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Faucon",
                    "explanation": "Explication sur le faucon...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Chouette",
                    "explanation": "Explication sur la chouette...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Rat",
                    "explanation": "Explication sur le rat...",
                    "image": "",
                    "icon": ""
                },
                {
                    "name": "Loup",
                    "explanation": "Le loup est un chasseur capable d'attraper la plupart des proies.Il sagit d'un animal principalement carnivore, raison pour laquelle il est courant de le voir se nourrir d'autres animaux plus petits ou certains animaux de plus grandes tailles.Ils ont un incroyable sens de l'odorat et de l'audition. Ce sont leurs organes les plus développés, ce qui leur permet de débusquer facilement leurs proies et communiquer",
                    "image": "",
                    "icon": ""
                }
            ],
            "answer": 6
        }
    }
};

const answersAnimation = {
    "Mutualisme": {
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 1
    },
    "Predation": {
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 2
    },
    "Commensalisme": {
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 3
    }
}

let connectedClient = [false,false, false];

io.on("connection", (socket) => {

    let userId;
    console.log(userId + " " + socket.id); // ojIckSD2jqNzOqIrAGzL

    if (interval) {
        clearInterval(interval);
    }

    socket.on('registerStudent1', () => {
        socket.join('client1');
        console.log('Client 1 enregistré :', socket.id);
        connectedClient[0] = true;

        if (connectedClient[0] === true && connectedClient[1] === true) {
            io.emit("startExperience");
        }

        userId = "client1"
        console.log(userId + " " + socket.id); // ojIckSD2jqNzOqIrAGzL

    });


    socket.on('registerStudent2', () => {
        socket.join('client2');
        console.log('Client 2 enregistré :', socket.id);
        connectedClient[1] = true;

        if (connectedClient[0] === true && connectedClient[1] === true && connectedClient[2]) {
            io.emit("startExperience");
        }
        connectedClient[1] = true;

        if (connectedClient[0] === true && connectedClient[1] === true && connectedClient[2]) {
            io.emit("startExperience");
        }

        userId = "client2"
        console.log(userId + " " + socket.id); // ojIckSD2jqNzOqIrAGzL

        console.log(userId);

    });

    socket.on('registerAnimationClient', () => {
        socket.join('client3');
        console.log('Client 3 enregistré :', socket.id);

        userId = "client3"
        console.log(userId + " " + socket.id); // ojIckSD2jqNzOqIrAGzL
    });

    socket.on('registerAnimationClient', () => {
        console.log('Animation client registered');
        connectedClient[2] = true;
    });

    numberOfTeamWhoWantsToContinue = 0
    numberOfTeamSelected = 0
    numberOfRulesUnderstood = 0
    numberOfChosenAnimals = 0
    numberOfAnimationQuestionAnswered = 0
    IdOfAnimationQuestionAnswered = []
    isFinalQuestionIsCorrect = true
    numberOfButtonClicked = 0
    numberOfCardsView = 0

    socket.on("wantsToStartExperience", () => {
        console.log("Ici")
        console.log(numberOfTeamWhoWantsToContinue++);
        numberOfTeamWhoWantsToContinue++
        socket.broadcast.emit("otherTeamWantsToContinue")
        if (numberOfTeamWhoWantsToContinue >= 2) {
            io.emit("launchIntroduction");
            numberOfTeamWhoWantsToContinue = 0
        }
    })

    socket.on("wantsToContinueIntroduction", () => {
        numberOfTeamWhoWantsToContinue++
        socket.broadcast.emit("otherTeamWantsToContinue")
        if (numberOfTeamWhoWantsToContinue >= 2) {
            io.emit("showTeams", config.teams);
            numberOfTeamWhoWantsToContinue = 0
        }
    })

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
            io.to('client3').emit(regles);
        }
    }

    socket.on("rulesAreUnderstood", () => {
        numberOfRulesUnderstood += 1
        if (numberOfRulesUnderstood >= 2) {
            io.to('client3').emit( chooseTheme);
            io.emit('rulesAreDoneSelectThemeRandomly');
        }
    })

    // THEME /////////////////////////////////////////

    const themes = ['Mutualisme', 'Predation', 'Commensalisme'];

    function chooseRandomTheme() {
        const randomIndex = Math.floor(Math.random() * themes.length);
        return themes[randomIndex];
    }

    socket.on("chooseTheme", () => {
        const theme = chooseRandomTheme();
        randomTheme = theme
        io.to("client1").emit("themeSelected", { theme: theme });
        io.to("client2").emit("themeSelected", { theme: theme });
    });


    socket.on("themeIsRandomlyChosen", (theme) => {
        io.to('client3').emit( themeIsChosen);
        setTimeout(() => {
            io.emit('themeIsSelectedShowThemeExplanation', theme);
            io.to('client3').emit( explanation);
            setTimeout(() => {
                randomTheme = theme
                const dataAnimals = [teams, teamGroupOne, teamGroupTwo, randomTheme, animals[randomTheme]]
                io.emit('showAnimals', dataAnimals);
                io.to('client3').emit( animalsCards);

            }, themeTimer);
        }, themeTimer);
    });
    socket.on("startGame", (randomTheme) => {
        const dataTurnByTurn = [teams, teamGroupOne, teamGroupTwo, randomTheme, animals[randomTheme]]
        numberOfCardsView++;
        if(numberOfCardsView >= 2) {
            io.to('client3').emit(indice1);
            io.emit('startTurnByTurn', dataTurnByTurn);
        }
    });
    socket.on("loop", () => {
        io.to('client3').emit( indice1Loop);
    })
    socket.on("indice2", () => {
        io.to('client1').emit('scenario', indice2Client1);
        io.to('client2').emit('scenario', indice2Client2);
    })


    // ANIMAL CHOSEN  ////////////////////////////////
    socket.on("animalChosen", (animalChosen) => {
        animalChosenValue = animalChosen;
        numberOfChosenAnimals++;
        if (numberOfChosenAnimals >= 2) {
            io.to('client3').emit(scenario9);
            io.emit("showInteractions", animals[randomTheme]);
        }
    });

    socket.on("undestrandInteraction", () => {
        numberOfButtonClicked++;
        if(numberOfButtonClicked >= 2) {
            io.to('client3').emit(interactions);
            io.emit("interactionExplained", randomTheme);
            setTimeout(() => {
                io.emit('askQuestion', answersAnimation[randomTheme])
            }, themeTimer);
        }
    })

    socket.on("animationIsDoneAskQuestion", (data) => {
        io.to('client3').emit(scenario10);
        io.emit('askQuestion', data)
    })

    // ANIMATION IS ANSWERED  ////////////////////////
    socket.on("animationQuestionIsAnswered", (answerId) => {
        numberOfAnimationQuestionAnswered++;
        if(numberOfAnimationQuestionAnswered >=2) {
            io.to('client3').emit( scenario11);
            io.emit("conclusion");
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
        console.log(userId + " disconnected");
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