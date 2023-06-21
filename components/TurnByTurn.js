import React, { useEffect, useState } from "react";
import teams from '../config';

function TurnByTurn({ socket, props }) {
    const [stateOfTheGame, setStateOfTheGame] = useState(null);
    const [teamIndex, setTeamIndex] = useState(null);
    const [actualTeamName, setActualTeamName] = useState("");
    const [actualTeamMembers, setActualTeamMembers] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (teamIndex !== null) {
            setActualTeamName(Object.keys(teams.teams)[teamIndex]);
            setActualTeamMembers(Object.values(teams.teams)[teamIndex]);
            setStateOfTheGame(0);
        }
    }, [teamIndex]);

    useEffect(() => {
        if (animals) {
            const animalArray = Object.values(animals);
            setAnimals(animalArray);
        }
    }, [animals]);

    const handleAnimalClick = (animalId) => {
        const selectedAnimal = animals.find((animal) => animal.id === animalId);
        console.log(selectedAnimal.name);
        if (selectedAnimals.length < 3 && !selectedAnimals.includes(selectedAnimal)) {
            setSelectedAnimals((prevSelectedAnimals) => [...prevSelectedAnimals, selectedAnimal]);
        }
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex === actualTeamMembers.length - 1) {
            console.log(actualTeamMembers);
            setCurrentPlayerIndex(0);
        } else {
            setCurrentPlayerIndex((prevPlayerIndex) => prevPlayerIndex + 1);
        }
        setSelectedAnimals([]);
    };

    return (
        <div>
            <h1>Turn By Turn Game</h1>
            <h2>{actualTeamMembers[currentPlayerIndex]}</h2>
            <p>{message}</p>
            <div className="animal-container">
                {Array.isArray(animals) && animals.map((animal, index) => (
                    <div
                        key={index}
                        className={`animal-card ${selectedAnimals.includes(animal) ? "selected" : ""}`}
                    >
                        <button onClick={() => handleAnimalClick(animal.id)}>
                            {animal.name}
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleNextPlayer}>
                Passer au joueur suivant
            </button>
        </div>
    );
}

export default TurnByTurn;
