const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

////////////////////////////////////////

let interval;
let clientsChoixFaits = 0;
let reponsesCorrectes;
let themeChoisi;

const indicesInterval = 15000;
let currentIndex = 0;

const themesIndices = {
    ocean: ["*bruit de l'océan pour groupe 1*", "Indice 2", "Indice 3"],
    foret: ["Indice 4", "Indice 5", "Indice 6"],
    montagne: ["Indice 7", "Indice 8", "Indice 9"],
    prairie: ["Indice 10", "Indice 11", "Indice 12"],
    jardin: ["Indice 13", "Indice 14", "Indice 15"],
    mutualisme: ["Indice 16", "Indice 17", "Indice 18"],
};
const clients = io.sockets.adapter.rooms;

const obtenirQuestionsPourTheme = (theme) => {
    const questions = {
        Mutualisme: [
            {
                question: "Qui agit en symbiose dans l'océan ? (Mutualisme)",
                reponses: [
                    {animal: "La tortue", isCorrect: false},
                    {animal: "La loutre", isCorrect: false},
                    {animal: "Le poisson clown", isCorrect: true},
                    {animal: "Le crocodile", isCorrect: false},
                    {animal: "La baleine", isCorrect: false},
                    {animal: "Le crabe nageur", isCorrect: false},
                    {animal: "L'anémone", isCorrect: true},
                    {animal: "L'étoile de mer", isCorrect: false},
                ],
                animation: "Le mutualisme entre le poisson clown et l'anémone dans l'océan est une relation symbiotique où les deux espèces bénéficient mutuellement. Le poisson clown trouve refuge dans les tentacules venimeux de l'anémone, qui le protège des prédateurs. En retour, le poisson clown chasse les parasites de l'anémone et apporte de la nourriture grâce à ses déplacements, ce qui permet à l'anémone de se nourrir et de rester en bonne santé. C'est un exemple parfait de coopération et d'interdépendance dans la nature."
            },
        ],
        Predation: [
            {
                question: "Qui agit en symbiose dans la prairie ? (Prédation)",
                reponses: [
                    {animal: "Le chien de prairie", isCorrect: false},
                    {animal: "La vache", isCorrect: true},
                    {animal: "L'antilope", isCorrect: false},
                    {animal: "Le putois", isCorrect: false},
                    {animal: "Le renard", isCorrect: false},
                    {animal: "Le héron", isCorrect: true},
                    {animal: "La buse", isCorrect: false},
                    {animal: "Le mormon", isCorrect: false},
                ],
                animation: "Le mutualisme entre la vache et le héron en prairie est une relation bénéfique pour les deux espèces. La vache, en broutant l'herbe, crée une zone dégagée propice à la recherche de proies pour le héron. En retour, le héron se nourrit des insectes et des parasites qui dérangent la vache, contribuant ainsi à la santé de l'animal. Cette coopération entre la vache et le héron favorise un équilibre écologique dans les prairies, où les deux espèces tirent profit des activités de l'autre."
            },
        ],
        Commensalisme: [
            {
                question: "Qui agit en symbiose dans le jardin ? (Commensalisme)",
                reponses: [
                    {animal: "Les abeilles", isCorrect: false},
                    {animal: "Les coccinelles", isCorrect: true},
                    {animal: "Les papillons", isCorrect: false},
                    {animal: "Les vers de terre", isCorrect: false},
                    {animal: "Les rouge-gorges", isCorrect: false},
                    {animal: "Les pucerons", isCorrect: true},
                    {animal: "Les chenilles", isCorrect: false},
                    {animal: "Le mormon", isCorrect: false},
                ],
                animation: "Les coccinelles et les pucerons ont une relation de mutualisme dans le jardin. Les coccinelles se nourrissent des pucerons, qui sont des parasites qui attaquent les plantes, tandis que les pucerons fournissent aux coccinelles une source de nourriture abondante. Les coccinelles aident ainsi à maintenir les populations de pucerons sous contrôle, ce qui contribue à protéger les plantes du jardin des infestations nuisibles."
            },
        ],
    };
    return questions[theme][0] || []
};

const obtenirReponsesCorrectesPourTheme = (theme, bonnesReponses) => {
    const questions = obtenirQuestionsPourTheme(theme);
    const reponses = questions.reponses;
    return reponses.filter(reponse => {
        return bonnesReponses.includes(reponse.animal) && reponse.isCorrect === true;
    });
};
const getApiAndEmit = (socket) => {
    const response = new Date();
    socket.emit("FromAPI", response);
};

//////////////////////////// New //////////////////////////////

let teamGroupOne = null
let teamGroupTwo = null
let numberOfTeamSelected = 0

const rulesTimer = 5000

let randomTheme = ""
const themeTimer = 5000

const teams = [
    { Violette: ["Lucie", "Yohan", "Jean"]},
    {Cyan: ["Sacha", "Léo", "Guilhem"]},
    {Jaune: ["Léa", "Baptiste", "Timothée"]},
    {Rouge: ["Raphaël", "Virgile", "Mathieu"]},
    {Verte: ["Alma", "Jeanne", "Emma"]},
    {Orange: ["Rose", "Gabrielle", "Inès"]},
    {Rose: ["Paul", "Léon", "Lucas"]},
    {Minuit: ["Alice", "Lou", "Théo"]}
]
const teamNames = teams.map((team) => Object.keys(team)[0]);
const rules = {
    0: "blablabla",
    1: "c'est vraiment des superbes règles",
    2: "Et pas des équerres",
    3: "Reprend toi Yohan..."
}

const themeExplanation = {
    "Mutualisme": "Explication brève du mutualisme",
    "Predation": "Explication brève de la prédation",
    "Commensalisme": "Explication brève du commensalisme"
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
    numberOfTeamSelected = 0;

    socket.on("teamChosen", (index) => {
        socket.broadcast.emit("teamChosen", index);
    })

    teamNames.forEach((teamName) => {
    socket.on("teamChosenGroupeOne", (teamChosen) => {
        teamGroupOne = teamChosen;
        console.log(teamChosen);
        console.log(teamGroupOne);
        console.log(teams);
        console.log(teamNames);

        console.log(teamName);
        const team = teams.find((teamObj) => Object.keys(teamObj)[0] === teamName);

        if (team) {
            const members = Object.values(team)[0];
            console.log(members);
            }
        numberOfTeamSelected++
        if (numberOfTeamSelected >= 2) {
            teamsAreDoneShowRules()
        }
    });
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
        io.emit('teamsAreDoneShowRules', rules);
        setTimeout(() => {
            io.emit('rulesAreDoneSelectThemeRandomly');
        }, rulesTimer)
    }

    // THEME /////////////////////////////////////////

    socket.on("themeIsRandomlyChosen", (theme) => {
        randomTheme = theme
        const questions = obtenirQuestionsPourTheme(theme);
        const reponses = obtenirQuestionsPourTheme(theme).reponses;
        const reponsesGroupe1 = reponses.slice(0, reponses.length / 2);
        const reponsesGroupe2 = reponses.slice(reponses.length / 2);
        console.log(reponsesGroupe1)
        console.log(reponsesGroupe2)
        console.log(questions)
        setTimeout(() => {
           // io.emit('themeIsSelectedShowThemeExplanation', themeExplanation[randomTheme])
            io.emit('questions', questions);

            io.to("client1").emit('reponses', reponsesGroupe1);
            io.to("client2").emit('reponses', reponsesGroupe2);
        }, themeTimer)
    })

    socket.on('themeChoisi', (selectedTheme) => {
        const questions = obtenirQuestionsPourTheme(selectedTheme);
        const reponses = obtenirQuestionsPourTheme(selectedTheme).reponses;
        const reponsesGroupe1 = reponses.slice(0, reponses.length / 2);
        const reponsesGroupe2 = reponses.slice(reponses.length / 2);
        console.log(reponsesGroupe1)
        console.log(reponsesGroupe2)
        setInterval(() => {
            if (selectedTheme) {
                const indices = themesIndices[selectedTheme];
                const indice = indices.shift();
                console.log(io.emit("indices", indice))
                io.emit("indices", indice);
                console.log(`Envoi des indices pour le thème ${selectedTheme}`);
            }
        }, indicesInterval);

        const bonnesReponses = reponses.filter(reponse => reponse.isCorrect).map(reponse => reponse.animal);
        reponsesCorrectes = obtenirReponsesCorrectesPourTheme(selectedTheme, bonnesReponses);
        themeChoisi = selectedTheme;
        io.emit('reponsesCorrectes', reponsesCorrectes);
        io.emit('questions', questions);

        io.to("client1").emit('reponses', reponsesGroupe1);
        io.to("client2").emit('reponses', reponsesGroupe2);
    });

    socket.on("reponseQuestion", ({reponseId, isCorrect}) => {
        if (clients.get("client1") && clients.get("client2")) {
            const clientId = socket.id;
            socket.broadcast.emit("choixFaits", {clientId});
        }
    });

    socket.on("choixFaits", ({clientId}) => {
        clientId = socket.id;
        clientsChoixFaits++;
        if (clientsChoixFaits === 2) {
            const animation = obtenirQuestionsPourTheme(themeChoisi).animation;
            io.emit("choicesBothDone", themeChoisi, animation);
            clientsChoixFaits = 0;
            io.emit("choixFaits", {});
            setTimeout(() => {
                io.emit("reloadClient");
            }, 2000);
        }
    });

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
        console.log(`> Ready on https://localhost:${port}`);
    });
});