import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ShowTeams from "../components/ShowTeams";
import ThemeScreen from "../components/ThemeScreen";
import RulesScreen from "../components/RulesScreen";
import TurnByTurn from "../components/TurnByTurn";
import AnimationQuestionScreen from "../components/AnimationQuestionScreen";
import ThemeExplanation from "../components/ThemeExplanation";
import ShowInteractions from "../components/ShowInteractions";
import UnderstandInteraction from "../components/UnderstandInteraction";
import Conclusion from "../components/Conclusion";
import AudioPlayer from "../components/AudioPlayer";
import { url } from "./_app";
import StartScreen from "../components/StartScreen";
import Introduce from "../components/Introduce";
import { io } from "socket.io-client";

export default function StudentTablet2() {
    const [otherTeamWantsToContinue, setOtherTeamWantsToContinue] = useState(
        false
    );
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(null);
    const [turnByTurnData, setTurnByTurnData] = useState(null);
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);
    const [themeSelected, setThemeSelected] = useState(null);
    const [themeExplanationFinished, setExplanationFinished] = useState(false);
    const [animalCards, setAnimalCards] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [interactionsData, setInteractionsData] = useState(null);
    const [interactionsExplainedData, setInteractionsExplainedData] = useState(
        null
    );
    const [audioScenario, setAudioScenario] = useState(null);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const socketClient2Ref = useRef(null);

    useEffect(() => {
        socketClient2Ref.current = io(url);
        const socketClient2 = socketClient2Ref.current;

        socketClient2.on("connect", function () {
            console.log("Client 2 connected");
            socketClient2.emit("registerStudent2");
        });

        socketClient2.on("disconnect", function () {
            console.log("Client 2 disconnected");
        });

        setOtherTeamWantsToContinue(false);

        if (rulesButtonClicked) {
            socketClient2.emit("rulesAreUnderstood");
        }

        socketClient2.on("otherTeamWantsToContinue", () => {
            setOtherTeamWantsToContinue(true);
        });

        socketClient2.on("startExperience", () => {
            setCurrentScreen("start");
        });

        socketClient2.on("confirmIntroductionStart", () => {
            console.log("hello");
            setCurrentScreen("introduce");
        });

        socketClient2.on("showTeams", () => {
            setCurrentScreen("teams");
        });

        socketClient2.on("teamsAreDoneShowRules", () => {
            setTeamsDone(true);
            setCurrentScreen("rules");
        });

        socketClient2.on("rulesAreDoneSelectThemeRandomly", () => {
            socketClient2.emit("chooseTheme");
            setCurrentScreen("theme");
        });

        socketClient2.on("themeSelected", (data) => {
            setThemeSelected(data);
            socketClient2.emit("themeIsRandomlyChosen", data);
        });

        socketClient2.on("themeIsSelectedShowThemeExplanation", (data) => {
            setCurrentScreen("themeExplanation");
        });

        socketClient2.on("startTurnByTurn", (data) => {
            setTurnByTurnData(data);
            setCurrentScreen("turnByTurn");
        });

        socketClient2.on("showInteractions", (data) => {
            setInteractionsData(data);
            setCurrentScreen("showInteractions");
        });

        socketClient2.on("interactionExplained", (data) => {
            setInteractionsExplainedData(data);
            setCurrentScreen("understandInteraction");
        });

        socketClient2.on("askQuestion", (data) => {
            setAnimationQuestionData(data);
            setCurrentScreen("animationQuestion");
        });

        socketClient2.on("conclusion", () => {
            setCurrentScreen("conclusion");
        });

        socketClient2.on("scenarsocketClient2", (scenario) => {
            setCurrentScenario(scenario);
            setAudioLoaded(false);

            const audioElement = new Audio(scenario.audios[0]);
            audioElement.addEventListener("canplaythrough", () => {
                setAudioLoaded(true);
            });

            setCurrentAudio(audioElement);
        });
        return () => {
            socketClient2.disconnect();
        };
    }, [rulesButtonClicked]);
  const handleAddTeam = (teamName) => {
      socketClient2Ref.current.emit("addTeam", teamName);
    }
    const handleContinueIntroduction = () => {
        socketClient2Ref.current.emit("wantsToContinueIntroduction");
    };

    const handleStartButtonClick = () => {
        socketClient2Ref.current.emit("wantsToStartExperience");
    };

    return (
        <>
            <Head>
                <title>Tablette groupe 2</title>
            </Head>

            <div className="global-container">
                {otherTeamWantsToContinue && (
                    <div className="otherTeamWantsToContinue"></div>
                )}

                {currentScreen === "start" && (
                    <StartScreen onClick={handleStartButtonClick} />
                )}

                {currentScreen === "introduce" && (
                    <Introduce onClick={handleContinueIntroduction} />
                )}

                {currentScreen === "teams" && (
                    <ShowTeams socket={socketClient2Ref.current}
                        teamSelected={teamSelected}  onTeamSelected={handleAddTeam}
                    />
                )}

                {currentScreen === "rules" && teamsDone && (
                    <RulesScreen socket={socketClient2Ref.current} onRulesButtonClicked={setRulesButtonClicked} />
                )}

                {currentScreen === "theme" && (
                    <ThemeScreen themeSelected={themeSelected} />
                )}

                {currentScreen === "themeExplanation" && (
                    <ThemeExplanation themeSelected={themeSelected} />
                )}

                {currentScreen === "turnByTurn" && (
                    <TurnByTurn
                        data={turnByTurnData}
                        client={2}
                        groupName={"teamGroupTwo"}
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

                {currentScenario && currentScenario.id === 12 && (
                    <AudioPlayer src={currentScenario.audios} />
                )}
            </div>
        </>
    );
}
