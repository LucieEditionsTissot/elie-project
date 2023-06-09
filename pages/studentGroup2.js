import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Head from "next/head";
import ShowTeams from "../components/ShowTeams";
import ThemeScreen from "../components/ThemeScreen";
import RulesScreen from "../components/RulesScreen";
import ThemeExplanationScreen from "../components/ThemeExplanationScreen";
import TurnByTurn from "../components/TurnByTurn";
import AnimationScreen from "../components/AnimationScreen";
import AnimationQuestionScreen from "../components/AnimationQuestionScreen";

const socket = io('localhost:3000')

export default function StudentTablet2() {
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamSelected, setTeamSelected] = useState(null);
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationQuestionScreen, setAnimationQuestionScreen] = useState([]);

    useEffect(() => {
        if (teamSelected) {
            socket.emit("teamChosenGroupeTwo", teamSelected)
        }
    }, [teamSelected])

    useEffect(() => {
        if (rulesButtonClicked) {
            socket.emit("rulesAreUnderstood")
        }
    }, [rulesButtonClicked])

    useEffect(() => {
        socket.emit("registerStudent2");

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

        socket.on('askQuestion',  (data) => {
            setAnimationQuestionScreen(data)
            hideAndShowSection('#animationScreen', '#animationQuestionScreen')
        })

    }, []);

    return (
        <>
            <Head>
                <title>Tablette groupe 2</title>
            </Head>

            <ShowTeams teamSelected={teamSelected} onTeamSelected={setTeamSelected} />

            <RulesScreen onRulesButtonClicked={setRulesButtonClicked} />

            <ThemeScreen/>

            <ThemeExplanationScreen/>

            <TurnByTurn data={turnByTurnData} client={2} groupName={"teamGroupTwo"}/>

            <AnimationScreen/>

            <AnimationQuestionScreen data={animationQuestionScreen}/>

        </>
    );

    function hideAndShowSection(hideSection, showSection) {
        document.querySelector(hideSection).classList.add('hide');
        document.querySelector(showSection).classList.remove('hide');
    }

}



