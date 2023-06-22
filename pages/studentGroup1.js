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
import AnimalCards from "../components/AnimalCards";
import ShowAnswer from "../components/ShowAnswer";
import ShowInteractions from "../components/ShowInteractions";
import UnderstandInteraction from "../components/UnderstandInteraction";
import Conclusion from "../components/Conclusion";
import StartScreen from "../components/StartScreen";
import Introduce from "../components/Introduce";
import AudioPlayer from "../components/AudioPlayer";
import {url} from "./_app";
import Interaction from "../components/Interaction";
import Answer from "../components/Answer";

const socket = io(url);

let connected = false;

export default function StudentTablet1() {
    const [otherTeamWantsToContinue, setOtherTeamWantsToContinue] = useState(false);
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("answer");
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);
    const [themeSelected, setThemeSelected] = useState(null);
    const [themeExplanationFinished, setExplanationFinished] = useState(false);
    const [animalCards, setAnimalCards] = useState([]);
    const [interactionsData, setInteractionsData] = useState(null);
    const [interactionsExplainedData, setInteractionsExplainedData] = useState(null);
    const [audioScenario, setAudioScenario] = useState(null);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);

    socket.on('connect', function () {
        console.log("Client 1 connected");
        connected = true;
    });

    socket.on('disconnect', function () {
        console.log("Client 1 disconnected");
        connected = false;
    });

    socket.on("reloadClient", () => {
        window.location.reload();
    });

    if (connected) {
        socket.emit("registerStudent1");

    }

    useEffect(() => {

        socket.on('scenario', (scenario) => {
            setCurrentScenario(scenario);
            setAudioLoaded(false);

            const audioElement = new Audio(scenario.audios[0]);
            audioElement.addEventListener('canplaythrough', () => {
                setAudioLoaded(true);
            });

            setCurrentAudio(audioElement);

        });
    }, []);

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
            console.log("game can be launched")
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
            socket.off("showInteractions");
            socket.off("animation");
            socket.off("askQuestionGroupOne");
            socket.off("showAnswerGroupOne");
        };

    }, []);

    return (
        <>
            <Head>
                <title>ELIE | Groupe 1</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta name="application-name" content="MyApp" />
                <meta name="apple-mobile-web-app-title" content="ELIE" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="apple-touch-icon" href="images/logo-blue.svg" />
            </Head>

            <div className="global-container">

                <div className={`otherTeamWantsToContinue ${otherTeamWantsToContinue ? "show" : ""}`}>
                    <p>L'autre équipe t'attend</p>
                </div>

                {currentScreen === "start" && (
                    <StartScreen onClick={handleStartButtonClick}/>
                )}

                {currentScreen === "introduce" && (
                    <Introduce onClick={handleClickOnIntroduceButton}/>
                )}

                {currentScreen === "teams" && (
                    <ShowTeams teamSelected={teamSelected} onTeamSelected={setTeamSelected} handleClickOnValidateTeam={() => handleClickOnValidateTeam()}/>
                )}

                {currentScreen === "rules" && teamsDone && (
                    <RulesScreen onRulesButtonClicked={setRulesButtonClicked}/>
                    //<Interaction title={"Regardez le plateau"} subTitle={"Pour comprendre les règles"} arrow={true} arrowDown={false} eye={false} volume={false} puzzle={false} frameText={"Règles du jeu"}/>
                )}

                {currentScreen === "theme" && (
                    //<ThemeScreen themeSelected={themeSelected}/>
                    <Interaction title={"Choix du thème"} subTitle={""} arrow={true} arrowDown={false} eye={false} volume={false} puzzle={false} frameText={"Choix du thème"}/>
                )}

                {currentScreen === "themeExplanation" && (
                    //<ThemeExplanationScreen themeSelected={themeSelected}/>
                    <Interaction title={"Mutualisme"} subTitle={""} arrow={false} arrowDown={false} eye={false} volume={false} puzzle={false} frameText={"Mutualisme"}/>
                )}

                {currentScreen === "animals" && (
                    <AnimalCards data={animalCards} client={1} groupName={"teamGroupOne"}/>
                )}

                {currentScreen === "turnByTurn" && (
                    <TurnByTurn data={turnByTurnData} client={1} groupName={"teamGroupOne"}/>
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

                {currentScenario && currentScenario.id === 11 && (
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

    function handleClickOnValidateTeam() {
        if (teamSelected !== null) {
            socket.emit("teamChosenGroupeOne", teamSelected);
        }
    }

}
