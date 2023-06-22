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
const teams = require('./config');
const { StateManager } = require('./StateManager');

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




let currentState = {}
let clientConnected = { client : false, client2 : false };

const stateManager = new StateManager();
const themes = ['Mutualisme', 'Predation', 'Commensalisme'];
let clientInformation = {};

const startExperience = (socket) => {
    if (clientConnected.client && clientConnected.client2) {
        console.log("Tous les clients sont connectés");
        socket.emit("startExperience", clientInformation);
    }
};

let client1SocketId;
let client2SocketId;
let client1State;
let client2State;
io.on("connection", (socket) => {
    stateManager.updateClientState(socket.id, "connected");
    let userId;

    socket.on("registerStudent1", () => {
        socket.join("client1");
        userId = socket.id;
        client1SocketId = socket.id;
        console.log("Client 1 enregistré : ", client1SocketId);
        clientConnected.client = true;
        startExperience(socket);
    });

    socket.on("registerStudent2", () => {
        socket.join("client2");
        client2SocketId = socket.id;
        console.log("Client 2 enregistré : ", client2SocketId);
        clientConnected.client2 = true;
        startExperience(socket);
    });

    socket.on("registerAnimationClient", () => {
        socket.join("client3");
        console.log("Animation client registered : ", socket.id);
    });

    socket.on("wantsToStartExperience", () => {
        stateManager.updateClientState(socket.id, "wantsToStartExperience");

        client1State = stateManager.getClientState(client1SocketId);
        client2State = stateManager.getClientState(client2SocketId);
        if (client1State === "wantsToStartExperience" && client2State === "wantsToStartExperience") {
            io.emit("confirmIntroductionStart");
        }
    });

    socket.on("wantsToContinueIntroduction", () => {
        stateManager.updateClientState(socket.id, "wantsToContinueIntroduction");
        client1State = stateManager.getClientState(client1SocketId);
        client2State = stateManager.getClientState(client2SocketId);
        if (client1State === "wantsToContinueIntroduction" && client2State === "wantsToContinueIntroduction") {
            io.emit("showTeams", stateManager.teams);
            stateManager.updateClientState(client1SocketId, "teams");
            stateManager.updateClientState(client2SocketId, "teams");
        }
    });

    socket.on("addTeam", (teamName) => {
        stateManager.addTeam(teamName);

        client1State = stateManager.getClientState(client1SocketId);
        client2State = stateManager.getClientState(client2SocketId);
        stateManager.updateClientState(client1SocketId, "teamAdded");
        stateManager.updateClientState(client2SocketId, "teamAdded");
        io.emit("teamAdded", teamName);
        if (client1State === "teamAdded" && client2State === "teamAdded") {
            teamsAreDoneShowRules();
        }

    });
    socket.on("selectTeam", (teamIndex) => {
        const teamChosen = stateManager.getTeamByIndex(teamIndex);
        if (teamChosen) {
            io.emit("teamChosen", teamIndex);
        }
    });
    // RULES /////////////////////////////////////////
    function teamsAreDoneShowRules() {
        stateManager.set("rules", rules);
        io.emit("teamsAreDoneShowRules");
    }

    socket.on("rulesAreUnderstood", () => {
        const rules = stateManager.get("rules");
        client1State = stateManager.getClientState(client1SocketId);
        client2State = stateManager.getClientState(client2SocketId);
        stateManager.updateClientState(client1SocketId, "rulesAreDoneSelectThemeRandomly");
        stateManager.updateClientState(client2SocketId, "rulesAreDoneSelectThemeRandomly");
            io.emit("rulesAreDoneSelectThemeRandomly", rules);
    });
    socket.on("teamReady", () => {
        client1State = stateManager.getClientState(client1SocketId);
        client2State = stateManager.getClientState(client2SocketId);
        stateManager.set("teamReady", true);
        stateManager.updateClientState(client1SocketId, "rulesAreDoneSelectThemeRandomly");
        stateManager.updateClientState(client2SocketId, "rulesAreDoneSelectThemeRandomly");
        
        io.emit("teamIsReady");
    });
    // THEME /////////////////////////////////////////



    function chooseRandomTheme() {
        const randomIndex = Math.floor(Math.random() * themes.length);
        return themes[randomIndex];
        //return themes[0];
    }

    socket.on("chooseTheme", () => {
        randomTheme = chooseRandomTheme();
        console.log(randomTheme);
        client1State = stateManager.getClientState(client1SocketId);
        client2State = stateManager.getClientState(client2SocketId);
        console.log(stateManager);
        stateManager.set("randomTheme", randomTheme);
        stateManager.updateClientState(client1SocketId, "randomTheme");
        stateManager.updateClientState(client2SocketId, "randomTheme");
        console.log(stateManager)
        if (client1State === "teamAdded" && client2State === "randomTheme") {
            io.emit("themeSelected", randomTheme);
        }
    });

    socket.on("themeIsRandomlyChosen", (theme) => {
        //theme = randomTheme;
        //console.log(io.emit('themeIsSelectedShowThemeExplanation', randomTheme) + "jbjsbdl<is")
        console.log(theme + " ici")
        //setTimeout(() => {
            console.log(io.to(client1SocketId).emit('themeIsSelectedShowThemeExplanation',randomTheme))
           // socket.to(client1SocketId).emit('themeIsSelectedShowThemeExplanation', randomTheme);
           // socket.to(client2SocketId).emit('themeIsSelectedShowThemeExplanation', randomTheme);
            //setTimeout(() => {
                //randomTheme = theme
                //const dataTurnByTurn = [teams.teams, teamGroupOne, teamGroupTwo, randomTheme, animals[randomTheme]]
               // io.to(client1SocketId).emit('startTurnByTurn', dataTurnByTurn);
               // io.to(client2SocketId).emit('startTurnByTurn', dataTurnByTurn);

            //}, 10000);
        //}, 30000);
    });



    // ANIMAL CHOSEN  ////////////////////////////////
    socket.on("animalChosen", (animalChosen) => {
        animalChosenValue = animalChosen;
        numberOfChosenAnimals++;
        if (numberOfChosenAnimals >= 2) {
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
        io.emit('askQuestion', data)
    })

    // ANIMATION IS ANSWERED  ////////////////////////
    socket.on("animationQuestionIsAnswered", (answerId) => {
        numberOfAnimationQuestionAnswered++;
        if(numberOfAnimationQuestionAnswered >=2) {
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
        stateManager.updateClientState(socket.id, "disconnected");
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