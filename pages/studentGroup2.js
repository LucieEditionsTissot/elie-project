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
import AnimalCards from "../components/AnimalCards";
import ShowAnswer from "../components/ShowAnswer";
import ShowInteractions from "../components/ShowInteractions";
import UnderstandInteraction from "../components/UnderstandInteraction";
import Conclusion from "../components/Conclusion";

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
    const [animalCards, setAnimalCards] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [interactionsData, setInteractionsData] = useState(null);
    const [interactionsExplainedData, setInteractionsExplainedData] = useState(null);

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
            setAnimalCards(data);
            setCurrentScreen("animals");
        });

        socket.on("startTurnByTurn", (data) => {
            setTurnByTurnData(data);
            setCurrentScreen("turnByTurn");
        });
        socket.on("showInteractions", (data) => {
            setInteractionsData(data);
            setCurrentScreen("showInteractions");
        });
        socket.on("interactionExplained", (data) => {
            setInteractionsExplainedData(data);
            setCurrentScreen("understandInteraction");
        })

        socket.on("askQuestion", (data) => {
            setAnimationQuestionData(data);
            setCurrentScreen("animationQuestion");
        });
        socket.on("conclusion", () => {
            setCurrentScreen("conclusion");
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
            socket.off("showAnswer");
        };
    }, []);


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

            {currentScreen === "theme" && <ThemeScreen themeSelected={themeSelected} />}

            {currentScreen === "themeExplanation" && (
                <ThemeExplanationScreen themeSelected={themeSelected} />
            )}

            {currentScreen === "animals" && (
                <AnimalCards data={animalCards} client={2} groupName={"teamGroupTwo"} />
            )}

            {currentScreen === "turnByTurn" && (
                <TurnByTurn data={turnByTurnData} client={2} groupName={"teamGroupTwo"} />
            )}

            {currentScreen === "showInteractions" && (
                <ShowInteractions data={interactionsData} />
            )}

            {currentScreen === "understandInteraction" && (
                <UnderstandInteraction themeSelected={themeSelected} />
            )}


            {currentScreen === "animationQuestion" && (
                <AnimationQuestionScreen data={animationQuestionData} />
            )}
            {currentScreen === "conclusion" && (
                <Conclusion/>
            )}

        </>
    );
}
