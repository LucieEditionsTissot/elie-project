import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';

const socket = io('localhost:3000');

function ShowTeams({ teamSelected, onTeamSelected }) {
    const [teams, setTeams] = useState([]);
    const colors = ["purple", "cyan", "yellow", "red", "green", "orange", "pink", "midnightblue"];
    const cardRefs = useRef([]);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, teams.length);
    }, [teams]);

    function handleClickOnTeam(index) {
        if (teamSelected === null) {
            const cards = cardRefs.current;
            const selectedCard = cards[index];
            cards.forEach(card => card.classList.remove("selected"));
            selectedCard.classList.add("selected");
        }
    }

    function handleClickOnValidateButton() {
        if (teamSelected === null) {
            const selectedCard = cardRefs.current.find(card => card.classList.contains("selected"));
            if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
                const teamIndex = selectedCard.id;
                console.log(teamIndex)
                onTeamSelected(teamIndex);
            }
        }
    }

    socket.on("teamChosen", function (index) {
        const selectedCard = cardRefs.current.find(card => card.id === index);
        if (selectedCard && !selectedCard.classList.contains("selectedByOtherTeam")) {
            cardRefs.current.forEach(card => card.classList.remove("selectedByOtherTeam"));
            selectedCard.classList.add("selectedByOtherTeam");
        }
    });

    useEffect(() => {
        socket.on('startExperience', (teams) => {
            setTeams(teams);
        });
    }, []);

    useEffect(() => {
        if (teamSelected !== null) {
            socket.emit("teamChosen", teamSelected, { excludeSelf: true });
        }
    }, [teamSelected]);

    return (
        <section id="teams">
            <h1>Choisissez votre équipe</h1>
            <div className="teamsWrapper">
                {Object.keys(teams).map((teamColor, index) => (
                    <div
                        ref={ref => (cardRefs.current[index] = ref)}
                        key={index}
                        id={index}
                        className="card"
                        style={{ background: colors[index] }}
                        onClick={() => handleClickOnTeam(index)}
                    >
                        <h2 className="teamName">{teamColor}</h2>
                        <ul>
                            {teams[teamColor].map((member, index) => (
                                <li key={index}>{member}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="validateButton" onClick={handleClickOnValidateButton}>
                <p>Valider</p>
            </div>
        </section>
    );
}

export default ShowTeams;


