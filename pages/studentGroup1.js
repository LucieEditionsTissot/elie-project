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
import AnimalCards from "../components/AnimalCards";
import ShowAnswer from "../components/ShowAnswer";

const socket = io("localhost:3000");

export default function StudentTablet1() {
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("teams");
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);
    const [themeSelected, setThemeSelected] = useState(null);
    const [themeExplanationFinished, setExplanationFinished] = useState(false);
    const [turnByTurnFinished, setTurnByTurnFinished] = useState(false);
    const [animalCards, setAnimalCards] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        socket.emit("registerStudent1");

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
            socket.emit("chooseTheme");
            setCurrentScreen("theme");
        });
        socket.on("themeSelected", (data) => {
            setThemeSelected(data.theme);
            setTimeout(() => {
                socket.emit("themeIsRandomlyChosen", data.theme);
            }, 1000);
        });

        socket.on("themeIsSelectedShowThemeExplanation", (data) => {
            setCurrentScreen("themeExplanation");
        });
        socket.on("showAnimals", (data) => {
            setExplanationFinished(true);
            setSelectedCard(data)
            setCurrentScreen("animals");
        });

        socket.on("startTurnByTurn", (data) => {
            setTurnByTurnData(data);
            setCurrentScreen("turnByTurn");
        });


        socket.on("askQuestionGroupOne", (data) => {
            setAnimationQuestionData(data);
            setAnimationInProgress(false);
            setCurrentScreen("animationQuestion");
        });

        socket.on("showAnswer", (data) => {
            setTurnByTurnFinished(true);
            setShowAnswer(data);
            setCurrentScreen("showAnswer");
        });

        return () => {
            socket.off("teamsAreDoneShowRules");
            socket.off("rulesAreDoneSelectThemeRandomly");
            socket.off("themeSelected");
            socket.off("themeIsSelectedShowThemeExplanation");
            socket.off("showAnimals");
            socket.off("startTurnByTurn");
            socket.off("animation");
            socket.off("askQuestionGroupOne");
            socket.off("showAnswerGroupOne");
        };
    }, []);

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

            {currentScreen === "theme" && <ThemeScreen themeSelected={themeSelected} />}

            {currentScreen === "themeExplanation" && (
                <ThemeExplanationScreen themeSelected={themeSelected} />
            )}
            {currentScreen === "animals" && (
                <AnimalCards data={animalCards} client={1} groupName={"teamGroupOne"} />
            )}
            {currentScreen === "turnByTurn" && (
                <TurnByTurn data={turnByTurnData} client={1} groupName={"teamGroupOne"} />
            )}


            {currentScreen === "animationQuestion" && (
                <AnimationQuestionScreen data={animationQuestionData} />
            )}
        </>
    );
}
