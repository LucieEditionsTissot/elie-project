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

const themeTimer = 5000
let randomTheme = null;
let numberOfChosenAnimals = 0
let numberOfButtonClicked =0;
let numberOfAnimationQuestionAnswered = 0
let IdOfAnimationQuestionAnswered = []

let isFinalQuestionIsCorrect = true
let isInformationUnderstood = 0
let animalChosenValue = null;
const teams = {
    0: ["Lucie", "Yohan", "Jean"],
    1: ["Sacha", "Léo", "Guilhem"],
    2: ["Léa", "Baptiste", "Timothée"],
    3: ["Raphaël", "Virgile", "Mathieu"],
    4: ["Alma", "Jeanne", "Emma"],
    5: ["Rose", "Gabrielle", "Inès"],
    6: ["Paul", "Léon", "Lucas"],
    7: ["Alice", "Lou", "Théo"]
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
            "animals": [
                {
                    "name": "Biche",
                    "explanation": "Explication sur la biche...",
                    "image": "chemin/vers/image-biche.jpg",
                    "icon": "chemin/vers/icon-biche.svg"
                },
                {
                    "name": "Truite",
                    "explanation": "Explication sur la truite...",
                    "image": "chemin/vers/image-truite.jpg",
                    "icon": "chemin/vers/icon-truite.svg"
                },
                {
                    "name": "Renard",
                    "explanation": "Explication sur le renard...",
                    "image": "chemin/vers/image-renard.jpg",
                    "icon": "chemin/vers/icon-renard.svg"
                },
                {
                    "name": "Salamandre",
                    "explanation": "Explication sur la salamandre...",
                    "image": "chemin/vers/image-salamandre.jpg",
                    "icon": "chemin/vers/icon-salamandre.svg"
                },
                {
                    "name": "Marmotte",
                    "explanation": "Explication sur la marmotte...",
                    "image": "chemin/vers/image-marmotte.jpg",
                    "icon": "chemin/vers/icon-marmotte.svg"
                },
                {
                    "name": "Cerf",
                    "explanation": "Explication sur le cerf...",
                    "image": "chemin/vers/image-cerf.jpg",
                    "icon": "chemin/vers/icon-cerf.svg"
                },
                {
                    "name": "Crapaud",
                    "explanation": "Explication sur le crapaud...",
                    "image": "chemin/vers/image-crapaud.jpg",
                    "icon": "chemin/vers/icon-crapaud.svg"
                },
                {
                    "name": "Loup",
                    "explanation": "Explication sur le loup...",
                    "image": "chemin/vers/image-loup.jpg",
                    "icon": "chemin/vers/icon-loup.svg"
                },
                {
                    "name": "Lapin",
                    "explanation": "Explication sur le lapin...",
                    "image": "chemin/vers/image-lapin.jpg",
                    "icon": "chemin/vers/icon-lapin.svg"
                },
                {
                    "name": "Aigle",
                    "explanation": "Explication sur l'aigle...",
                    "image": "chemin/vers/image-aigle.jpg",
                    "icon": "chemin/vers/icon-aigle.svg"
                }
            ],
            "answer": 7
        },
        "teamGroupTwo": {
            "animals": [
                {
                    "name": "Lézard",
                    "explanation": "Explication sur le lézard...",
                    "image": "chemin/vers/image-lezard.jpg",
                    "icon": "chemin/vers/icon-lezard.svg"
                },
                {
                    "name": "Biche",
                    "explanation": "Explication sur la biche...",
                    "image": "chemin/vers/image-biche.jpg",
                    "icon": "chemin/vers/icon-biche.svg"
                },
                {
                    "name": "Hibou",
                    "explanation": "Explication sur le hibou...",
                    "image": "chemin/vers/image-hibou.jpg",
                    "icon": "chemin/vers/icon-hibou.svg"
                },
                {
                    "name": "Papillon",
                    "explanation": "Explication sur le papillon...",
                    "image": "chemin/vers/image-papillon.jpg",
                    "icon": "chemin/vers/icon-papillon.svg"
                },
                {
                    "name": "Ecureuil",
                    "explanation": "Explication sur l'écureuil...",
                    "image": "chemin/vers/image-ecureuil.jpg",
                    "icon": "chemin/vers/icon-ecureuil.svg"
                },
                {
                    "name": "Coccinelle",
                    "explanation": "Explication sur la coccinelle...",
                    "image": "chemin/vers/image-coccinelle.jpg",
                    "icon": "chemin/vers/icon-coccinelle.svg"
                },
                {
                    "name": "Faucon",
                    "explanation": "Explication sur le faucon...",
                    "image": "chemin/vers/image-faucon.jpg",
                    "icon": "chemin/vers/icon-faucon.svg"
                },
                {
                    "name": "Chouette",
                    "explanation": "Explication sur la chouette...",
                    "image": "chemin/vers/image-chouette.jpg",
                    "icon": "chemin/vers/icon-chouette.svg"
                },
                {
                    "name": "Rat",
                    "explanation": "Explication sur le rat...",
                    "image": "chemin/vers/image-rat.jpg",
                    "icon": "chemin/vers/icon-rat.svg"
                },
                {
                    "name": "Loup",
                    "explanation": "Explication sur le loup...",
                    "image": "chemin/vers/image-loup.jpg",
                    "icon": "chemin/vers/icon-loup.svg"
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
                    "image": "chemin/vers/image-biche.jpg",
                    "icon": "chemin/vers/icon-biche.svg"
                },
                {
                    "name": "Truite",
                    "explanation": "Explication sur la truite...",
                    "image": "chemin/vers/image-truite.jpg",
                    "icon": "chemin/vers/icon-truite.svg"
                },
                {
                    "name": "Renard",
                    "explanation": "Explication sur le renard...",
                    "image": "chemin/vers/image-renard.jpg",
                    "icon": "chemin/vers/icon-renard.svg"
                },
                {
                    "name": "Salamandre",
                    "explanation": "Explication sur la salamandre...",
                    "image": "chemin/vers/image-salamandre.jpg",
                    "icon": "chemin/vers/icon-salamandre.svg"
                },
                {
                    "name": "Marmotte",
                    "explanation": "Explication sur la marmotte...",
                    "image": "chemin/vers/image-marmotte.jpg",
                    "icon": "chemin/vers/icon-marmotte.svg"
                },
                {
                    "name": "Cerf",
                    "explanation": "Explication sur le cerf...",
                    "image": "chemin/vers/image-cerf.jpg",
                    "icon": "chemin/vers/icon-cerf.svg"
                },
                {
                    "name": "Crapaud",
                    "explanation": "Explication sur le crapaud...",
                    "image": "chemin/vers/image-crapaud.jpg",
                    "icon": "chemin/vers/icon-crapaud.svg"
                },
                {
                    "name": "Loup",
                    "explanation": "Explication sur le loup...",
                    "image": "chemin/vers/image-loup.jpg",
                    "icon": "chemin/vers/icon-loup.svg"
                },
                {
                    "name": "Lapin",
                    "explanation": "Explication sur le lapin...",
                    "image": "chemin/vers/image-lapin.jpg",
                    "icon": "chemin/vers/icon-lapin.svg"
                },
                {
                    "name": "Aigle",
                    "explanation": "Explication sur l'aigle...",
                    "image": "chemin/vers/image-aigle.jpg",
                    "icon": "chemin/vers/icon-aigle.svg"
                }
            ],
            "answer": 9
        },
        "teamGroupTwo": {
            "animals": [
                {
                    "name": "Lézard",
                    "explanation": "Explication sur le lézard...",
                    "image": "chemin/vers/image-lezard.jpg",
                    "icon": "chemin/vers/icon-lezard.svg"
                },
                {
                    "name": "Biche",
                    "explanation": "Explication sur la biche...",
                    "image": "chemin/vers/image-biche.jpg",
                    "icon": "chemin/vers/icon-biche.svg"
                },
                {
                    "name": "Hibou",
                    "explanation": "Explication sur le hibou...",
                    "image": "chemin/vers/image-hibou.jpg",
                    "icon": "chemin/vers/icon-hibou.svg"
                },
                {
                    "name": "Papillon",
                    "explanation": "Explication sur le papillon...",
                    "image": "chemin/vers/image-papillon.jpg",
                    "icon": "chemin/vers/icon-papillon.svg"
                },
                {
                    "name": "Ecureuil",
                    "explanation": "Explication sur l'écureuil...",
                    "image": "chemin/vers/image-ecureuil.jpg",
                    "icon": "chemin/vers/icon-ecureuil.svg"
                },
                {
                    "name": "Coccinelle",
                    "explanation": "Explication sur la coccinelle...",
                    "image": "chemin/vers/image-coccinelle.jpg",
                    "icon": "chemin/vers/icon-coccinelle.svg"
                },
                {
                    "name": "Faucon",
                    "explanation": "Explication sur le faucon...",
                    "image": "chemin/vers/image-faucon.jpg",
                    "icon": "chemin/vers/icon-faucon.svg"
                },
                {
                    "name": "Chouette",
                    "explanation": "Explication sur la chouette...",
                    "image": "chemin/vers/image-chouette.jpg",
                    "icon": "chemin/vers/icon-chouette.svg"
                },
                {
                    "name": "Rat",
                    "explanation": "Explication sur le rat...",
                    "image": "chemin/vers/image-rat.jpg",
                    "icon": "chemin/vers/icon-rat.svg"
                },
                {
                    "name": "Loup",
                    "explanation": "Explication sur le loup...",
                    "image": "chemin/vers/image-loup.jpg",
                    "icon": "chemin/vers/icon-loup.svg"
                }
            ],
            "answer": 6
        }
    }
};


const answersAnimation = {
    "Mutualisme": {
        "animation": "video-1.mp4",
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 1
    },
    "Predation": {
        "animation": "video-1.mp4",
        "time": 5,
        "question": "Qu'avez vous compris ?",
        "answers": ["Les animaux se mangent entre eux", "Les animaux se nourrissent les uns des autres", "Les animaux se protègent les uns des autres", "Les animaux se reproduisent entre eux"],
        "correctAnswer": 2
    },
    "Commensalisme": {
        "animation": "video-1.mp4",
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


    io.emit("startExperience", teams);
    socket.on('registerAnimationClient', () => {
        console.log('Animation client registered');

        const ambiance = {
            id: 1,
            audios: ['audio/Corbeau.mov'],
            videos: ['video/Ambience.mp4'],
        };
        socket.emit('scenario', ambiance);

        setTimeout(() => {
            const scenario2 = {
                id: 2,
                audios: ['audio/loup.mov'],
                videos: ['video/indices/indice1/LC_A_intro_indice_01.mp4'],
            };
            socket.emit('scenario', scenario2);
        }, 10000);

        setTimeout(() => {
            const scenario3 = {
                id: 3,
                audios: ['audio/Corbeau.mov'],
                videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
            };
            socket.emit('scenario', scenario3);
        }, 20000);

        setTimeout(() => {
            const scenario4 = {
                id: 4,
                audios: ['audio/loup.mov'],
                videos: ['video/indices/indice1/LC_C_outro_indice_01.mp4'],
            };
            socket.emit('scenario', scenario4);
        }, 30000);
    });

    numberOfTeamSelected = 0
    numberOfRulesUnderstood = 0
    numberOfChosenAnimals = 0
    numberOfAnimationQuestionAnswered = 0
    IdOfAnimationQuestionAnswered = []
    isFinalQuestionIsCorrect = true
    numberOfButtonClicked =0;


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

        setTimeout(() => {
            io.emit('themeIsSelectedShowThemeExplanation', theme);
            setTimeout(() => {
               randomTheme = theme
                console.log(teamGroupOne);
                console.log(teamGroupTwo);
                const dataAnimals = [teams, teamGroupOne, teamGroupTwo, randomTheme, animals[randomTheme]]
                console.log(randomTheme);
                console.log(io.emit('showAnimals', teamGroupOne, teamGroupTwo, animals[randomTheme]))
                io.emit('showAnimals', dataAnimals);

            }, themeTimer);
        }, themeTimer);
    });
    socket.on("startGame", (randomTheme) => {
        const dataTurnByTurn = [teams, teamGroupOne, teamGroupTwo, randomTheme, animals[randomTheme]]
        io.emit('startTurnByTurn', dataTurnByTurn);
    })
    // ANIMAL CHOSEN  ////////////////////////////////

    socket.on("animalChosen", (animalChosen) => {
        animalChosenValue = animalChosen;
        console.log("ici");
        numberOfChosenAnimals++;
        console.log(numberOfChosenAnimals)
        if (numberOfChosenAnimals >= 2) {
            console.log(animals[randomTheme]);
            console.log( io.emit("showInteractions", animals[randomTheme]));
            io.emit("showInteractions", animals[randomTheme]);
        }
    });

    socket.on("showInteractions", () => {
        numberOfButtonClicked++;
        console.log(numberOfButtonClicked);
        if(numberOfButtonClicked >= 2) {
            io.emit("interactionExplained", randomTheme);
            setTimeout(() => {
                io.emit('animationIsDoneAskQuestion', answersAnimation[randomTheme])
            }, themeTimer);
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