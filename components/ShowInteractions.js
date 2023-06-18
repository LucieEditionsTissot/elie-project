import React, { useState } from "react";
import io from 'socket.io-client';


const socket = io('localhost:3000')

function ShowInteractions({ data }) {
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    const handleAnimalClick = (animal) => {
        setSelectedAnimal(animal);
    };

    const handleNextButtonClick = () => {
        socket.emit("undestrandInteraction");
    };

    const getCorrectAnswers = () => {
        const teamOneAnswer = data.teamGroupOne.answer;
        const teamTwoAnswer = data.teamGroupTwo.answer;

        const teamOneAnimal = data.teamGroupOne.animals[teamOneAnswer - 1];
        const teamTwoAnimal = data.teamGroupTwo.animals[teamTwoAnswer - 1];

        const teamOneCorrectAnswer = teamOneAnimal ? teamOneAnimal : null;
        const teamTwoCorrectAnswer = teamTwoAnimal ? teamTwoAnimal : null;

        return [teamOneCorrectAnswer, teamTwoCorrectAnswer];
    };

    const [teamOneCorrectAnswer, teamTwoCorrectAnswer] = getCorrectAnswers();

    return (
        <div>
            <div className="flex gap-4">
                <div
                    className={`animal-wrapper cursor-pointer ${
                        selectedAnimal === teamOneCorrectAnswer ? "border border-blue-500" : "border border-red-500"
                    }`}
                    onClick={() => handleAnimalClick(teamOneCorrectAnswer)}
                >
                    <p>{teamOneCorrectAnswer?.name || "Inconnu"}</p>
                </div>
                <div
                    className={`cursor-pointer ${
                        selectedAnimal === teamTwoCorrectAnswer ? "border border-blue-500" : "border border-red-500"
                    }`}
                    onClick={() => handleAnimalClick(teamTwoCorrectAnswer)}
                >
                    <p>{teamTwoCorrectAnswer?.name || "Inconnu"}</p>
                </div>
            </div>

            {selectedAnimal && (
                <div className="mt-4">
                    <p className="text-lg font-semibold">
                        Nom de l'animal sélectionné : {selectedAnimal.name}
                    </p>
                    <p>{selectedAnimal.explanation}</p>
                    <img
                        src={selectedAnimal.image}
                        alt={selectedAnimal.name}
                        className="mt-4"
                    />
                </div>
            )}

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleNextButtonClick}
            >
                Suivant
            </button>
        </div>
    );
}

export default ShowInteractions;
