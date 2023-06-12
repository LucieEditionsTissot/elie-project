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


    io.emit("startExperience", teams);
// Séquence 1: Ambiance
    socket.on('startAmbiance', () => {
        io.to('client3').emit('loadMap', { id: 1, url: 'video/Anim_indice_01_003.mp4' });
        io.to('client3').emit('loadAudio', { id: 1, url: 'audio/Corbeau.mov' });
    });

// Séquence 2: Rules
    socket.on('startRules', () => {
        io.to('client3').emit('pauseAudio', { id: 1 });
        io.to('client3').emit('loadAudio', { id: 2, url: 'audio/Corbeau.mov'  });
        io.to('client3').emit('loadMap', { id: 2, url: 'video/Anim_indice_01_003.mp4' });
    });

// Séquence 3: Theme chosen
    socket.on('startThemeChosen', () => {
        io.to('client3').emit('pauseAudio', { id: 2 });
        io.to('client3').emit('loadAudio', { id: 3, url: 'audio3.mp3' });
        io.to('client3').emit('loadMap', { id: 3, url: 'video/Anim_indice_01_003.mp4' });
    });

// Séquence 4: Theme Explication
    socket.on('startThemeExplanation', () => {
        io.to('client3').emit('loadAudio', { id: 4, url: 'audio4.mp3' });
        io.to('client3').emit('loadMap', { id: 4, url: 'video/Anim_indice_01_003.mp4' });
    });

// Séquence 5: Ambiance
    socket.on('startAmbiance2', () => {
        io.to('client3').emit('pauseAudio', { id: 4 });
        io.to('client3').emit('loadAudio', { id: 1, url: 'audio1.mp3' });
        io.to('client3').emit('loadMap', { id: 1, url: 'video/Anim_indice_01_003.mp4' });
    });

// Séquence 6: Indice 1
    socket.on('startIndice1', () => {
        io.to('client3').emit('loadAudio', { id: 5, url: 'audio5.mp3' });
        io.to('client3').emit('loadVideo', { id: 5, url: 'video/Anim_indice_01_003.mp4' });
        setTimeout(() => {
            io.to('client3').emit('pauseAudio', { id: 5 });
            io.to('client3').emit('pauseVideo', { id: 5 });
        }, 4000);

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                io.to('client3').emit('loadAudio', { id: 6, url: 'audio6.mp3' });
                io.to('client3').emit('loadVideo', { id: 6, url: 'video/Anim_indice_01_003.mp4' });
            }, 4000 + i * 10000);
        }

        setTimeout(() => {
            io.to('client3').emit('loadAudio', { id: 7, url: 'audio7.mp3' });
            io.to('client3').emit('loadVideo', { id: 7, url: 'video/Anim_indice_01_003.mp4' });
            setTimeout(() => {
                io.to('client3').emit('pauseAudio', { id: 7 });
                io.to('client3').emit('pauseVideo', { id: 7 });
            }, 3000);
        }, 4000 + 4 * 10000);
    });

// Séquence 7: Indice 2
    socket.on('startIndice2', () => {
        io.to('client3').emit('loadAudio', { id: 8, url: 'audio8.mp3' });
        io.to('client3').emit('loadVideo', { id: 8, url: 'video/Anim_indice_01_003.mp4' });
        setTimeout(() => {
            io.to('client3').emit('pauseAudio', { id: 8 });
            io.to('client3').emit('pauseVideo', { id: 8 });
        }, 4000);

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                io.to('client3').emit('loadAudio', { id: 9, url: 'audio9.mp3' });
                io.to('client3').emit('loadVideo', { id: 9, url: 'video/Anim_indice_01_003.mp4' });
            }, 4000 + i * 10000);
        }

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                io.to('client1').emit('loadAudio', { id: '9-1', url: 'audio9-1.mp3' });
                io.to('client2').emit('loadAudio', { id: '9-2', url: 'audio9-2.mp3' });
            }, 4000 + i * 10000);
        }

        setTimeout(() => {
            io.to('client3').emit('loadAudio', { id: 10, url: 'audio10.mp3' });
            io.to('client3').emit('loadVideo', { id: 10, url: 'video/Anim_indice_01_003.mp4' });
            setTimeout(() => {
                io.to('client3').emit('pauseAudio', { id: 10 });
                io.to('client3').emit('pauseVideo', { id: 10 });
            }, 3000);
        }, 4000 + 4 * 10000);
    });

// Séquence 8: Indice 3
    socket.on('startIndice3', () => {
        io.to('client3').emit('loadAudio', { id: 11, url: 'audio11.mp3' });
        io.to('client3').emit('loadVideo', { id: 11, url: 'video/Anim_indice_01_003.mp4' });
        setTimeout(() => {
            io.to('client3').emit('pauseAudio', { id: 11 });
            io.to('client3').emit('pauseVideo', { id: 11 });
        }, 4000);

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                io.to('client3').emit('loadAudio', { id: 12, url: 'audio12.mp3' });
                io.to('client3').emit('loadVideo', { id: 12, url: 'video/Anim_indice_01_003.mp4' });
            }, 4000 + i * 10000);
        }

        setTimeout(() => {
            io.to('client3').emit('loadAudio', { id: 13, url: 'audio13.mp3' });
            io.to('client3').emit('loadVideo', { id: 13, url: 'video/Anim_indice_01_003.mp4' });
            setTimeout(() => {
                io.to('client3').emit('pauseAudio', { id: 13 });
                io.to('client3').emit('pauseVideo', { id: 13 });
            }, 3000);
        }, 4000 + 4 * 10000);
    });

// Séquence 9: Ambiance
    socket.on('startAmbiance3', () => {
        io.to('client3').emit('loadAudio', { id: 1, url: 'audio1.mp3' });
        io.to('client3').emit('loadMap', { id: 1, url: 'video/Anim_indice_01_003.mp4' });
    });

// Séquence 10: Intéractions
    socket.on('startInteractions', () => {
        io.to('client3').emit('loadAudio', { id: 14, url: 'audio14.mp3' });
        io.to('client3').emit('loadVideo', { id: 14, url: 'video/Anim_indice_01_003.mp4' });
        setTimeout(() => {
            io.to('client3').emit('pauseAudio', { id: 14 });
            io.to('client3').emit('pauseVideo', { id: 14 });
        }, 4000);

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                io.to('client3').emit('loadAudio', { id: 15, url: 'audio15.mp3' });
                io.to('client3').emit('loadVideo', { id: 15, url: 'video/Anim_indice_01_003.mp4' });
            }, 4000 + i * 10000);
        }

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                io.to('client1').emit('loadAudio', { id: '16-1', url: 'audio16-1.mp3' });
                io.to('client2').emit('loadAudio', { id: '16-2', url: 'audio16-2.mp3' });
            }, 4000 + i * 10000);
        }

        setTimeout(() => {
            io.to('client3').emit('loadAudio', { id: 17, url: 'audio17.mp3' });
            io.to('client3').emit('loadVideo', { id: 17, url: 'video/Anim_indice_01_003.mp4' });
            setTimeout(() => {
                io.to('client3').emit('pauseAudio', { id: 17 });
                io.to('client3').emit('pauseVideo', { id: 17 });
            }, 3000);
        }, 4000 + 4 * 10000);
    });

// Séquence 11: Ambiance
    socket.on('startAmbiance4', () => {
        io.to('client3').emit('loadAudio', { id: 1, url: 'audio1.mp3' });
        io.to('client3').emit('loadMap', { id: 1, url: 'video/Anim_indice_01_003.mp4' });
    });



    numberOfTeamSelected = 0
    numberOfRulesUnderstood = 0
    numberOfChosenAnimals = 0
    numberOfAnimationQuestionAnswered = 0
    IdOfAnimationQuestionAnswered = []
    isFinalQuestionIsCorrect = true

    socket.on("teamChosen", (index) => {
        console.log(index);
        socket.broadcast.emit("teamChosen", index);
    })

    socket.on("teamChosenGroupeOne", (teamChosen) => {
        teamGroupOne = teamChosen;
        numberOfTeamSelected++
        console.log(numberOfTeamSelected + "Groupe 1");
        if (numberOfTeamSelected >= 2) {
            teamsAreDoneShowRules()
        }
    })

    socket.on("teamChosenGroupeTwo", (teamChosen) => {
        teamGroupTwo = teamChosen;
        numberOfTeamSelected++
        console.log(numberOfTeamSelected + "Groupe 2");
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