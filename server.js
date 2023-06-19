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
let regles = {
    id: 2,
    audios: ['audio/Regles.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};

let chooseTheme = {
    id: 3,
    audios: ['audio/ambiance.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};
let themeIsChosen = {
    id: 4,
    audios: ['audio/ambiance.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};
let explanation = {
    id: 5,
    audios: ['audio/10animaux.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};

let animalsCards = {
    id: 6,
    audios: ['audio/10animaux.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};
let indice1 = {
    id: 7,
    audios: ['audio/Indice_01.mp3'],
    videos: ['video/indices/indice1/LC_A_intro_indice_01.mp4','video/indices/indice1/LC_B_anim_indice_01.mp4', 'video/indices/indice1/LC_C_outro_indice_01.mp4'],
};
let indice1Loop = {
    id: 7,
    audios: ['audio/Indice_01.mp3'],
    videos: ['video/indices/indice1/LC_B_anim_indice_01.mp4'],
};
let indice2Client1 = {
    id: 11,
    audios: ['audio/Corbeau.mov'],
};
let indice2Client2 = {
    id: 12,
    audios: ['audio/loup.mov'],
};
let interactions = {
    id: 8,
    audios: [ 'audio/LeMutualisme.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};

const scenario9 = {
    id: 9,
    audios: ['audio/ambiance.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};
const scenario10 = {
    id: 10,
    audios: ['audio/ambiance.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};
const scenario11 = {
    id: 13,
    audios: ['audio/ambiance.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};
const scenario12 = {
    id: 15,
    audios: ['audio/ambiance.mp3'],
    videos: ['video/Anim_Ambiance_Map01.mp4'],
};


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
            audios: ['audio/ambiance.mp3'],
            videos: ['video/Anim_Ambiance_Map01.mp4'],
        };

        socket.to('client3').emit( ambiance);


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
            console.log(io.to('client3').emit( regles));
            io.to('client3').emit(regles);
        }
    }

    socket.on("rulesAreUnderstood", () => {
        numberOfRulesUnderstood++
        if (numberOfRulesUnderstood >= 2) {
            console.log(io.to('client3').emit( chooseTheme));
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
        console.log(io.to('client3').emit( themeIsChosen));
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
        io.to('client3').emit( indice1);
        io.emit('startTurnByTurn', dataTurnByTurn);
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
        console.log(numberOfButtonClicked);
        if(numberOfButtonClicked >= 2) {
            console.log(io.emit("interactionExplained", randomTheme));
            io.to('client3').emit(interactions);
            io.emit("interactionExplained", randomTheme);
            console.log(answersAnimation[randomTheme])
            setTimeout(() => {
                io.emit('askQuestion', answersAnimation[randomTheme])
            }, themeTimer);
        }
    })

    socket.on("animationIsDoneAskQuestion", (data) => {
        console.log(io.emit("askQuestion", data))
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