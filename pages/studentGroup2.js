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
import ThemeExplanation from "../components/ThemeExplanation";
import AnimalCards from "../components/AnimalCards";
import ShowAnswer from "../components/ShowAnswer";
import ShowInteractions from "../components/ShowInteractions";
import UnderstandInteraction from "../components/UnderstandInteraction";
import Conclusion from "../components/Conclusion";
import AudioPlayer from "../components/AudioPlayer";
import {url} from "./_app";
import StartScreen from "../components/StartScreen";
import Introduce from "../components/Introduce";
import io from "socket.io-client";


const socket = io(url);
let connected = false;

export default function StudentTablet2() {
    const [otherTeamWantsToContinue, setOtherTeamWantsToContinue] = useState(false);
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("start");
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
    const [audioScenario, setAudioScenario] = useState(null);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);


    socket.on('connect', function () {
        console.log("Client 2 connected");
        connected = true;
    });

    socket.on('disconnect', function () {
        console.log("Client 2 disconnected");
        connected = false;
    });

    if (connected) {
        socket.emit("registerStudent2");

    }
    socket.on("disconnect", () => {
        window.location.reload();
    });
    useEffect(() => {
        setOtherTeamWantsToContinue(false)
    }, [currentScreen]);

    useEffect(() => {
        if (rulesButtonClicked) {
            socket.emit("rulesAreUnderstood");
        }
    }, [rulesButtonClicked]);

    useEffect(() => {

        socket.on("otherTeamWantsToContinue", () => {
            setOtherTeamWantsToContinue(true)
        });

        socket.on("startExperience", () => {
            setCurrentScreen("start")
        });

        socket.on("launchIntroduction", () => {
            setCurrentScreen("introduce");
        });

        socket.on("showTeams", () => {
            setCurrentScreen("teams");
        });

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

        socket.on('scenario', (scenario) => {
            setCurrentScenario(scenario);
            setAudioLoaded(false);

            const audioElement = new Audio(scenario.audios[0]);
            audioElement.addEventListener('canplaythrough', () => {
                setAudioLoaded(true);
            });

            setCurrentAudio(audioElement);

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
                <title>ELIE | Groupe 2</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta name="application-name" content="MyApp" />
                <meta name="apple-mobile-web-app-title" content="ELIE" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="apple-touch-icon" href="images/logo-blue.svg" />
                <meta name="theme-color" content="#fff" />
            </Head>

            <div className="global-container">

                {otherTeamWantsToContinue && (
                    <div className="otherTeamWantsToContinue"></div>
                )}

                {currentScreen === "start" && (
                    <StartScreen onClick={handleStartButtonClick}/>
                )}

                {currentScreen === "introduce" && (
                    <Introduce onClick={handleClickOnIntroduceButton}/>
                )}

                {currentScreen === "teams" && (
                    <ShowTeams teamSelected={teamSelected} onTeamSelected={setTeamSelected}/>
                )}

                {currentScreen === "rules" && teamsDone && (
                    <RulesScreen onRulesButtonClicked={setRulesButtonClicked}/>
                )}

                {currentScreen === "theme" && <ThemeScreen themeSelected={themeSelected}/>}

                {currentScreen === "themeExplanation" && (
                    <ThemeExplanationScreen themeSelected={themeSelected}/>
                )}

                {currentScreen === "animals" && (
                    <AnimalCards data={animalCards} client={2} groupName={"teamGroupTwo"}/>
                )}

                {currentScreen === "turnByTurn" && (
                    <TurnByTurn data={turnByTurnData} client={2} groupName={"teamGroupTwo"}/>
                )}

                {currentScreen === "showInteractions" && (
                    <ShowInteractions data={interactionsData}/>
                )}

                {currentScreen === "understandInteraction" && (
                    <UnderstandInteraction themeSelected={themeSelected}/>
                )}

                {currentScreen === "answer" && (
                    <Answer/>
                )}

                {currentScreen === "animationQuestion" && (
                    <AnimationQuestionScreen data={animationQuestionData}/>
                )}

                {currentScreen === "conclusion" && (
                    <Conclusion/>
                )}

                {currentScenario && currentScenario.id === 12 && (
                    <AudioPlayer src={currentScenario.audios}/>
                )}

            </div>

        </>
    );

    function handleStartButtonClick() {
        socket.emit("wantsToStartExperience");
    }

    function handleClickOnIntroduceButton() {
        socket.emit("wantsToContinueIntroduction");
    }

}
