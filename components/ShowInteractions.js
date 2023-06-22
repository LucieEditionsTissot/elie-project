import React, { useState } from "react";
import socket from 'socket.io-client';
import {url} from "../pages/_app";

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
                >
                    <p>{teamOneCorrectAnswer?.name || "Inconnu"}</p>
                    <img src={teamOneCorrectAnswer.image} alt=""/>
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
