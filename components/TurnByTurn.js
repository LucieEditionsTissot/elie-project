import React, { useState } from "react";

function TurnByTurn({ socket, animals }) {
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [message, setMessage] = useState("");

    const handleAnimalClick = (animal) => {
        if (selectedAnimals.length < 3 && !selectedAnimals.includes(animal)) {
            setSelectedAnimals((prevSelectedAnimals) => [
                ...prevSelectedAnimals,
                animal,
            ]);
        }
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex <= 3) {
            setCurrentPlayerIndex(0);
        } else {
            setCurrentPlayerIndex((prevPlayerIndex) => prevPlayerIndex + 1);
        }
        setSelectedAnimals([]);
    };

    return (
        <div>
            <p>{message}</p>
            <div className="animal-container">
                {animals !== undefined && animals.length > 0 ? (
                    animals.map((animal, index) => (
                        <div
                            key={index}
                            className={`animal-card ${
                                selectedAnimals.includes(animal) ? "selected" : ""
                            }`}
                        >
                            <button onClick={() => handleAnimalClick(animal)}>
                                {animal.name}
                            </button>
                        </div>
                ))) : ""}
            </div>
            <button onClick={handleNextPlayer}>Passer au joueur suivant</button>
        </div>
    );
}

export default TurnByTurn;
