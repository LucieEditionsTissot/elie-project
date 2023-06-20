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
import AudioPlayer from "../components/AudioPlayer";
import {url} from "./_app";
import StartScreen from "../components/StartScreen";
import Introduce from "../components/Introduce";

const socket = io(url);

let connected = false;

export default function StudentTablet2() {

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
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);


    socket.on('connect', function () {
        console.log("Client 2 connected");
        connected = true;
    });


    socket.on('disconnect', function () {
        console.log("Client 2 disconnected");
        connected = false;
    });


    useEffect(() => {
        if (connected)
        {
            socket.emit("registerStudent2");

            if (teamSelected) {
                //socket.emit("teamChosenGroupeTwo", teamSelected);
            }
        }
    }, [teamSelected]);

    useEffect(() => {
        if (rulesButtonClicked) {
            //socket.emit("rulesAreUnderstood");
        }
    }, [rulesButtonClicked]);


    useEffect(() => {
        socket.on("reloadClient", () => {
            window.location.reload();
        });
    }, []);


    return (
        <>
            <Head>
                <title>Tablette groupe 2</title>
            </Head>
            {currentScenario && currentScenario.id === 12 && (
                <AudioPlayer src={currentScenario.audios}/>
            )}

            {currentScreen === "start" && (
                <StartScreen onClick={handleStartButtonClick}/>
            )}

            {currentScreen === "introduce" && (
                <Introduce onNextClick={handleNextClick}/>
            )}

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
