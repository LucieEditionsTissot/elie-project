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

export default function StudentTablet2() {
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [themeSelected, setThemeSelected] = useState(false);
    const [themeExplanationDone, setThemeExplanationDone] = useState(false);
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);

    useEffect(() => {
        if (teamSelected) {
            socket.emit("teamChosenGroupeTwo", teamSelected);
        }
    }, [teamSelected]);

    useEffect(() => {
        if (rulesButtonClicked) {
            socket.emit("rulesAreUnderstood");
        }
    }, [rulesButtonClicked]);

    useEffect(() => {
        socket.emit("registerStudent2");

        socket.on("teamsAreDoneShowRules", () => {
            setTeamsDone(true);
        });

        socket.on("rulesAreDoneSelectThemeRandomly", () => {
            setThemeSelected(true);
        });

        socket.on("themeIsSelectedShowThemeExplanation", () => {
            setThemeExplanationDone(true);
        });

        socket.on("startTurnByTurn", (data) => {
            setTurnByTurnData(data);
            setThemeExplanationDone(false);
        });

        socket.on("animation", () => {
            setAnimationInProgress(true);
        });

        socket.on("askQuestion", (data) => {
            setAnimationQuestionData(data);
            setAnimationInProgress(false);
        });


    }, []);

    return (
        <>
            <Head>
                <title>Tablette groupe 2</title>
            </Head>

            {!teamsDone && (
                <ShowTeams teamSelected={teamSelected} onTeamSelected={setTeamSelected} />
            )}

            {teamsDone && !themeSelected && (
                <ThemeScreen onThemeSelected={setThemeSelected} />
            )}

            {teamsDone && themeSelected && !themeExplanationDone && (
                <ThemeExplanationScreen onExplanationDone={setThemeExplanationDone} />
            )}

            {teamsDone && themeSelected && themeExplanationDone && (
                <TurnByTurn data={turnByTurnData} client={2} groupName={"teamGroupTwo"} />
            )}

            {teamsDone && themeSelected && themeExplanationDone && animationInProgress && (
                <AnimationScreen />
            )}

            {teamsDone && themeSelected && themeExplanationDone && !animationInProgress && (
                <AnimationQuestionScreen data={animationQuestionData} />
            )}
        </>
    );
}




