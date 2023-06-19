import React, { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io('localhost:3000');

function AnimalCards(props) {
    const [data, setData] = useState(props.data);
    const [teams, setTeams] = useState([]);
    const [randomTheme, setRandomTheme] = useState("");
    const [teamIndex, setTeamIndex] = useState(null);
    const [actualTeamName, setActualTeamName] = useState("");
    const [actualTeamMembers, setActualTeamMembers] = useState([]);
    const [animals, setAnimals] = useState({});
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    useEffect(() => {
        setTeams(props.data[0]);
        setRandomTheme(props.data[3]);
        setTeamIndex(props.data[Number(props.client)]);
        const animalData = props.data[4];
        if (animalData) {
            setAnimals(animalData[props.groupName]["animals"]);
        }
    }, [props.data]);

    useEffect(() => {
        if (teams && teamIndex !== null) {
            setActualTeamName(Object.keys(teams)[teamIndex]);
            setActualTeamMembers(Object.values(teams)[teamIndex]);
        }
    }, [teams, teamIndex]);

    function handleClickOnValidateButton() {
        socket.emit("startGame", randomTheme);
    }

    function handleAnimalClick(index) {
        const animal = animals[index];
        setSelectedAnimal(animal);
    }

    function handleCloseOverlay() {
        setSelectedAnimal(null);
    }

    return (
        <section id={"turnByTurn"}>
            <div className="animal-wrapper">
                {animals !== undefined && animals.length > 0 ? (
                    animals.map((animal, index) => (
                        <div
                            key={index}
                            id={index}
                            className="animal cursor-pointer"
                            onClick={() => handleAnimalClick(index)}
                        >
                            <p>{animal.name}</p>
                        </div>
                    ))
                ) : null}
            </div>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => handleClickOnValidateButton()}
            >
                <p>Valider</p>
            </button>

            {selectedAnimal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedAnimal.name}</h2>
                        <p className="mb-4">{selectedAnimal.explanation}</p>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleCloseOverlay}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AnimalCards;
