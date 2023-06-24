class StateManager {
    constructor() {
        this.clientStates = {};
        this.teams = [];
        this.state = {};
    }

    updateClientState(socketId, state) {
        this.clientStates[socketId] = state;
    }

    getClientState(socketId) {
        return this.clientStates[socketId];
    }

    addTeam(teamName) {
        const teamExists = this.teams.some((team) => team.name === teamName);
        if (teamExists) {
            console.log(`L'équipe "${teamName}" existe déjà.`);
            return;
        }

        const newTeam = {
            name: teamName,
        };
        this.teams.push(newTeam);

        console.log(`L'équipe "${teamName}" a été ajoutée.`);
    }

    set(key, value) {
        this.state[key] = value;
    }

    get(key) {
        return this.state[key];
    }
}

module.exports  = {
    StateManager
}