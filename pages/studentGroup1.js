import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Head from "next/head";
import ShowTeams from "./components/ShowTeams";
import ThemeScreen from "./components/ThemeScreen";
import RulesScreen from "./components/RulesScreen";
import ThemeExplanationScreen from "./components/ThemeExplanationScreen";
import TurnByTurn from "./components/TurnByTurn";
import AnimationScreen from "./components/AnimationScreen";

const socket = io("localhost:3000");

export default function StudentTablet1() {
    /*
    const [questions, setQuestions] = useState([]);
    const [reponses, setReponses] = useState([]);
    const [reponseSoumise, setReponseSoumise] = useState(false);
    const [reponseChoisie, setReponseChoisie] = useState(null);
    const [reponseCorrecte, setReponseCorrecte] = useState(false);
    const [attenteReponse, setAttenteReponse] = useState(false);
    const [choixFaits, setChoixFaits] = useState(false);
    const [clientId, setClientId] = useState(null);
     */
    const [selectedTheme, setSelectedTheme] = useState("");
    const [teamSelected, setTeamSelected] = useState(null);
    const [turnByTurnData, setTurnByTurnData] = useState({});

    useEffect(() => {
        console.log("La team choisie est : ", teamSelected)
        socket.emit("teamChosenGroupeOne", teamSelected)
    }, [teamSelected])

    useEffect(() => {
        socket.emit("registerStudent1");

        socket.on('teamsAreDoneShowRules',  () => {
            hideAndShowSection("#teams", "#rulesScreen")
        })

        socket.on('rulesAreDoneSelectThemeRandomly',  () => {
            hideAndShowSection('#rulesScreen', '#themeScreen')
        })

        socket.on('themeIsSelectedShowThemeExplanation',  () => {
            hideAndShowSection('#themeScreen', '#themeExplanationScreen')
        })

        socket.on('startTurnByTurn',  (data) => {
            setTurnByTurnData(data)
            hideAndShowSection('#themeExplanationScreen', '#turnByTurn')
        })

        socket.on('animation',  () => {
            hideAndShowSection('#turnByTurn', '#animationScreen')
        })

        /*
        socket.on("questions", (questions) => {
            setQuestions(questions);
        });

        socket.on("reponses", (reponses) => {
            const reponsesAvecId = reponses.map((reponse) => ({
                ...reponse,
                id: Math.random().toString(36).substring(2),
            }));
            setReponses(reponsesAvecId);
        });

        socket.on('themeChosen', (selectedTheme) => {
            setSelectedTheme(selectedTheme);
        });

        socket.on("choixFaits", ({clientId}) => {
            setClientId(clientId);
        });

        socket.on("reloadClient", () => {
            window.location.reload();
        });

        return () => {
            socket.off("questions");
            socket.off("reponses");
        };
         */

    }, []);

    return (
        <>
            <Head>
                <title>Tablette groupe 1</title>
            </Head>

            <ShowTeams teamSelected={teamSelected} onTeamSelected={setTeamSelected} />

            <RulesScreen/>

            <ThemeScreen/>

            <ThemeExplanationScreen/>

            <TurnByTurn data={turnByTurnData} client={1} groupName={"teamGroupOne"}/>

            <AnimationScreen/>

        </>
    );

    function hideAndShowSection(hideSection, showSection) {
        document.querySelector(hideSection).classList.add('hide');
        document.querySelector(showSection).classList.remove('hide');
    }

}




