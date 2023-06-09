import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Head from "next/head";
import ShowTeams from "../components/ShowTeams";
import ThemeScreen from "../components/ThemeScreen";
import RulesScreen from "../components/RulesScreen";
import ThemeExplanationScreen from "../components/ThemeExplanationScreen";
import TurnByTurn from "../components/TurnByTurn";
import AnimationScreen from "../components/AnimationScreen";
import AnimationQuestionScreen from "../components/AnimationQuestionScreen";

const socket = io("localhost:3000");

export default function StudentTablet1() {
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("teams");
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);

    useEffect(() => {
        if (teamSelected) {
            socket.emit("teamChosenGroupeOne", teamSelected);
        }
    }, [teamSelected]);

    useEffect(() => {
        if (rulesButtonClicked) {
            socket.emit("rulesAreUnderstood");
        }
    }, [rulesButtonClicked]);

    useEffect(() => {
        socket.emit("registerStudent1");

        socket.on("teamsAreDoneShowRules", () => {
            setTeamsDone(true);
            setCurrentScreen("rules");
        });

        socket.on("rulesAreDoneSelectThemeRandomly", () => {
            setCurrentScreen("theme");
        });

        socket.on("startTurnByTurn", (data) => {
            setTurnByTurnData(data);
            setCurrentScreen("turnByTurn");
        });

        socket.on("animation", () => {
            setAnimationInProgress(true);
            setCurrentScreen("animation");
        });

        socket.on("askQuestion", (data) => {
            setAnimationQuestionData(data);
            setAnimationInProgress(false);
            setCurrentScreen("animationQuestion");
        });

    }, []);

    function handleThemesButtonClicked() {
        setCurrentScreen("themeExplanation");
    }

    return (
        <>
            <Head>
                <title>Tablette groupe 1</title>
            </Head>

            {currentScreen === "teams" && (
                <ShowTeams teamSelected={teamSelected} onTeamSelected={setTeamSelected} />
            )}

            {currentScreen === "rules" && teamsDone && (
                <RulesScreen onRulesButtonClicked={setRulesButtonClicked} />
            )}

            {currentScreen === "theme" && (
                <ThemeScreen onThemesButtonClicked={handleThemesButtonClicked} />
            )}

            {currentScreen === "themeExplanation" && (
                <ThemeExplanationScreen />
            )}

            {currentScreen === "turnByTurn" && (
                <TurnByTurn data={turnByTurnData} client={1} groupName={"teamGroupOne"} />
            )}

            {currentScreen === "animation" && (
                <AnimationScreen />
            )}

            {currentScreen === "animationQuestion" && (
                <AnimationQuestionScreen data={animationQuestionData} />
            )}
        </>
    );
}





