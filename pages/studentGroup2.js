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
import ThemeExplanation from "../components/ThemeExplanation";

const socket = io("localhost:3000");

export default function StudentTablet2() {
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("teams");
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);
    const [themeSelected, setThemeSelected] = useState(null);
    const [themeExplanationFinished, setExplanationFinished] = useState(false);

    useEffect(() => {
        socket.emit("registerStudent2");

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


        socket.on("teamsAreDoneShowRules", () => {
            setTeamsDone(true);
            setCurrentScreen("rules");
        });
        socket.on("rulesAreDoneSelectThemeRandomly", () => {
            socket.emit('chooseTheme');
            setCurrentScreen("theme");
            console.log("ici");
        });
        socket.on("themeSelected", (data) => {
            console.log(data.theme);
            setThemeSelected(data.theme);
            setTimeout(() => {
                socket.emit('themeIsRandomlyChosen', data.theme);
            }, 1000);
        });

        socket.on("themeIsSelectedShowThemeExplanation", (data) => {
            console.log("coucou")
            setCurrentScreen("themeExplanation");
        });

        socket.on("startTurnByTurnGroupTwo", (data) => {
            setExplanationFinished(true);
            setTurnByTurnData(data);
            setCurrentScreen("turnByTurn");
        });

        socket.on("animationGroupTwo", () => {
            setAnimationInProgress(true);
            setCurrentScreen("animation");
        });

        socket.on("askQuestionGroupOne", (data) => {
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
                <title>Tablette groupe 2</title>
            </Head>

            {currentScreen === "teams" && (
                <ShowTeams teamSelected={teamSelected} onTeamSelected={setTeamSelected} />
            )}

            {currentScreen === "rules" && teamsDone && (
                <RulesScreen onRulesButtonClicked={setRulesButtonClicked} />
            )}

            {currentScreen === "theme" && (
                <ThemeScreen themeSelected={themeSelected} />
            )}

            {currentScreen === "themeExplanation" && (
                <ThemeExplanationScreen themeSelected={themeSelected} />
            )}

            {currentScreen === "turnByTurn" && (
                <TurnByTurn data={turnByTurnData} client={2} groupName={"teamGroupTwo"} />
            )}

            {currentScreen === "animation" && <AnimationScreen />}

            {currentScreen === "animationQuestion" && (
                <AnimationQuestionScreen data={animationQuestionData} />
            )}
        </>
    );
}
