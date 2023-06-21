import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Head from "next/head";
import ShowTeams from "../components/ShowTeams";
import ThemeScreen from "../components/ThemeScreen";
import RulesScreen from "../components/RulesScreen";
import ThemeExplanationScreen from "../components/ThemeExplanationScreen";
import TurnByTurn from "../components/TurnByTurn";
import AnimationQuestionScreen from "../components/AnimationQuestionScreen";
import ShowInteractions from "../components/ShowInteractions";
import UnderstandInteraction from "../components/UnderstandInteraction";
import Conclusion from "../components/Conclusion";
import StartScreen from "../components/StartScreen";
import Introduce from "../components/Introduce";
import AudioPlayer from "../components/AudioPlayer";
import { url } from "./_app";
import ThemeExplanation from "../components/ThemeExplanation";

const socketClient1 = io(url);

export default function StudentTablet1() {
    const [otherTeamWantsToContinue, setOtherTeamWantsToContinue] = useState(
        false
    );
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState({});
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);
    const [themeSelected, setThemeSelected] = useState(null);
    const [themeExplanationFinished, setExplanationFinished] = useState(false);
    const [animalCards, setAnimalCards] = useState([]);
    const [interactionsData, setInteractionsData] = useState(null);
    const [interactionsExplainedData, setInteractionsExplainedData] = useState(
        null
    );
    const [audioScenario, setAudioScenario] = useState(null);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);

    useEffect(() => {
        socketClient1.on("connect", function () {
            console.log("Client 1 connected");
            socketClient1.emit("registerStudent1");
        });

        socketClient1.on("disconnect", function () {
            console.log("Client 1 disconnected");
        });

        return () => {
            socketClient1.off("connect");
            socketClient1.off("disconnect");
        };
    }, []);

    useEffect(() => {
        setOtherTeamWantsToContinue(false);
    }, [currentScreen]);

    useEffect(() => {
        if (teamSelected) {
            socketClient1.emit("teamChosenGroupeOne", teamSelected);
        }
    }, [teamSelected]);

    useEffect(() => {
        if (rulesButtonClicked) {
            socketClient1.emit("rulesAreUnderstood");
        }
    }, [rulesButtonClicked]);

    useEffect(() => {
        socketClient1.on("otherTeamWantsToContinue", () => {
            setOtherTeamWantsToContinue(true);
        });

        socketClient1.on("startExperience", () => {
            console.log("ici");
            setCurrentScreen("start");
        });

        socketClient1.on("launchIntroduction", () => {
            setCurrentScreen("introduce");
        });

        socketClient1.on("showTeams", () => {
            setCurrentScreen("teams");
        });

        socketClient1.on("teamsAreDoneShowRules", () => {
            setTeamsDone(true);
            setCurrentScreen("rules");
        });

        socketClient1.on("rulesAreDoneSelectThemeRandomly", () => {
            socketClient1.emit("chooseTheme");
            setCurrentScreen("theme");
        });

        socketClient1.on("themeSelected", (data) => {
            setThemeSelected(data);
            console.log(data)
        });

        socketClient1.on("themeIsSelectedShowThemeExplanation", (data) => {
            setCurrentScreen("themeExplanation");
        });

        socketClient1.on("startTurnByTurn", (data) => {
            setTurnByTurnData(data);
            setCurrentScreen("turnByTurn");
        });

        socketClient1.on("showInteractions", (data) => {
            setInteractionsData(data);
            setCurrentScreen("showInteractions");
        });

        socketClient1.on("interactionExplained", (data) => {
            setInteractionsExplainedData(data);
            setCurrentScreen("understandInteraction");
        });

        socketClient1.on("askQuestion", (data) => {
            setAnimationQuestionData(data);
            setCurrentScreen("animationQuestion");
        });

        socketClient1.on("conclusion", () => {
            setCurrentScreen("conclusion");
        });

        return () => {
            socketClient1.off("otherTeamWantsToContinue");
            socketClient1.off("startExperience");
            socketClient1.off("launchIntroduction");
            socketClient1.off("showTeams");
            socketClient1.off("teamsAreDoneShowRules");
            socketClient1.off("rulesAreDoneSelectThemeRandomly");
            socketClient1.off("themeSelected");
            socketClient1.off("themeIsSelectedShowThemeExplanation");
            socketClient1.off("showAnimals");
            socketClient1.off("startTurnByTurn");
            socketClient1.off("showInteractions");
            socketClient1.off("interactionExplained");
            socketClient1.off("askQuestion");
            socketClient1.off("conclusion");
        };
    }, []);

    return (
        <>
            <Head>
                <title>Tablette groupe 1</title>
            </Head>

            <div className="global-container">
                {otherTeamWantsToContinue && (
                    <div className="otherTeamWantsToContinue"></div>
                )}
                {currentScreen === "start" && (
                    <StartScreen socket={socketClient1}  onClick={handleStartButtonClick}/>
                )}

                {currentScreen === "introduce" && (
                    <Introduce socket={socketClient1} onClick={handleClickOnIntroduceButton}/>
                )}

                {currentScreen === "teams" && (
                    <ShowTeams socket={socketClient1} teamSelected={teamSelected} onTeamSelected={setTeamSelected} />
                )}

                {currentScreen === "rules" && teamsDone && (
                    <RulesScreen socket={socketClient1} onRulesButtonClicked={setRulesButtonClicked} />
                )}

                {currentScreen === "theme" && (
                    <ThemeScreen socket={socketClient1} themeSelected={themeSelected} />
                )}

                {currentScreen === "themeExplanation" && (
                    <ThemeExplanation socket={socketClient1} themeSelected={themeSelected} />
                )}

                {currentScreen === "turnByTurn" && (
                    <TurnByTurn
                        socket={socketClient1}
                        data={turnByTurnData}
                        client={1}
                        groupName={"teamGroupOne"}
                    />
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

                {currentScreen === "conclusion" && <Conclusion />}

                {currentScenario && currentScenario.id === 11 && (
                    <AudioPlayer src={currentScenario.audios} />
                )}
            </div>
        </>
    );

    function handleStartButtonClick() {
        socketClient1.emit("wantsToStartExperience");
    }

    function handleClickOnIntroduceButton() {
        socketClient1.emit("wantsToContinueIntroduction");
    }
}
