import React, {useEffect, useRef, useState} from "react";
import io from 'socket.io-client';
import {type} from "os";

const socket = io('localhost:3000')

function ShowTeams({teamSelected, onTeamSelected}) {
    const [teams, setTeams] = useState([]);
    const colors = ["purple", "cyan", "yellow", "red", "green", "orange", "pink", "midnightblue"];

    function handleClickOnTeam(index) {
        if (teamSelected === null) {
            const card = document.querySelector(`.card[id='${index}']`);
            if (card) {
                const cards = document.querySelectorAll(".card");
                cards.forEach(card => card.classList.remove("selected"))
                card.classList.add("selected");
            }
        }
    }

    function handleClickOnValidateButton() {
        const teamSelectedByClient = document.querySelector(".card.selected");
        if (teamSelected === null && !teamSelectedByClient.classList.contains("selectedByOtherTeam")) {
            const teamIndex = teamSelectedByClient.id;
            onTeamSelected(teamIndex);
            const validateButton = document.querySelector(".validateButton");
            validateButton.style.display = "none";
        }
    }

    socket.on("teamChosen", function (index) {
        const cards = document.querySelectorAll(".card");
        const teamAlreadySelected = document.querySelector(`.card[id='${index}']`);
        if (teamAlreadySelected && !teamAlreadySelected.classList.contains("selectedByOtherTeam")) {
            cards.forEach(card => card.classList.remove("selectedByOtherTeam"));
            teamAlreadySelected.classList.add('selectedByOtherTeam');
        }
    });

    useEffect(() => {
        socket.on('startExperience', (teams) => {
            setTeams(teams);
        });
    }, []);

    useEffect(() => {
        if (teamSelected !== null) {
            socket.emit("teamChosen", teamSelected, {excludeSelf: true});
        }
    }, [teamSelected]);

    return (
        <section id={"teams"}>

            <h1>Choisissez votre équipe</h1>

            <div className={"teamsWrapper"}>
                {Object.keys(teams).map((teamColor, index) => (
                    <div key={index} id={index} className={"card"} style={{background: colors[index]}}
                         onClick={() => handleClickOnTeam(index)}>
                        <h2 className={"teamName"}>{teamColor}</h2>
                        <ul>
                            {teams[teamColor].map((member, index) => (
                                <li key={index}>{member}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={"validateButton"} onClick={handleClickOnValidateButton}>
                <p>Valider</p>
            </div>

        </section>
    )
}

export default ShowTeams;
