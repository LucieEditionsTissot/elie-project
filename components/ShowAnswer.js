import React, { useEffect, useState } from "react";

function ShowAnswer(props) {
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    useEffect(() => {
        const [teams, teamGroupOne, teamGroupTwo, randomTheme, animalChosen] =
            props.data;

        const selectedAnimalData = animalChosen
            ? props.data[4].find((animal) => animal.id === animalChosen)
            : null;

        setSelectedAnimal(selectedAnimalData);
    }, [props.data]);

    if (selectedAnimal) {
        return (
            <div>
                <h1>Selected Animal:</h1>
                <p>Name: {selectedAnimal.name}</p>
                <p>Description: {selectedAnimal.description}</p>

            </div>
        );
    } else {
        return null;
    }
}

export default ShowAnswer;
