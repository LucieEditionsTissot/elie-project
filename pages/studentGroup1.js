import React, {useState, useEffect, useRef} from "react";
import {io} from "socket.io-client";
import Head from "next/head";
import ShowTeams from "../components/ShowTeams";
import TurnByTurn from "../components/TurnByTurn";
import AnimationQuestionScreen from "../components/AnimationQuestionScreen";
import ShowInteractions from "../components/ShowInteractions";
import UnderstandInteraction from "../components/UnderstandInteraction";
import Conclusion from "../components/Conclusion";
import StartScreen from "../components/StartScreen";
import Introduce from "../components/Introduce";
import AudioPlayer from "../components/AudioPlayer";
import {url} from "./_app";
import Interaction from "../components/Interaction";
import Question from "../components/Question";

export default function StudentTablet1() {
    const [otherTeamWantsToContinue, setOtherTeamWantsToContinue] = useState(false);
    const [teamSelected, setTeamSelected] = useState(null);
    const [rulesButtonClicked, setRulesButtonClicked] = useState(false);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(null);
    const [turnByTurnData, setTurnByTurnData] = useState({});
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationQuestionData, setAnimationQuestionData] = useState([]);
    const [themeSelected, setThemeSelected] = useState(null);
    const [animalCards, setAnimalCards] = useState([]);
    const [interactionsData, setInteractionsData] = useState(null);
    const [interactionsExplainedData, setInteractionsExplainedData] = useState(null);
    const [audioScenario, setAudioScenario] = useState(null);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const socketClient1Ref = useRef(null);

    useEffect(() => {
        socketClient1Ref.current = io(url);
        const socketClient1 = socketClient1Ref.current;

        socketClient1.on("connect", function () {
            console.log("Client 1 connected");
            socketClient1.emit("registerStudent1");
        });

        socketClient1.on("disconnect", function () {
            console.log("Client 1 disconnected");
        });


        socketClient1.on("otherTeamWantsToContinue", () => {
            setOtherTeamWantsToContinue(true);
        });

        socketClient1.on("startExperience", () => {
            setCurrentScreen("start");
        });

        socketClient1.on("confirmIntroductionStart", () => {
            console.log("hello");
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
            setCurrentScreen("theme");
        });

        socketClient1.on("themeIsSelectedShowThemeExplanation", () => {
            setCurrentScreen("themeExplanation");
        });
        socketClient1.on("setIndice1Screen", () => {
            setCurrentScreen("indice1");
        });
        socketClient1.on("startGame", (data) => {
            console.log("hey");
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
            socketClient1.disconnect();
        };
    }, [rulesButtonClicked]);
    const handleAddTeam = (teamName) => {
        socketClient1Ref.current.emit("addTeam", teamName);
    }
    const handleStartButtonClick = () => {
        socketClient1Ref.current.emit("wantsToStartExperience");
    }
    const handleRulesButtonClick = () => {
        socketClient1Ref.current.emit("rules");
    }
    const handleContinueIntroduction = () => {
        socketClient1Ref.current.emit("wantsToContinueIntroduction");
    };
    return (
        <>
            <Head>
                <title>ELIE | Groupe 1</title>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
                <meta name="application-name" content="MyApp"/>
                <meta name="apple-mobile-web-app-title" content="ELIE"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
                <link rel="apple-touch-icon" href="/images/logo-blue.svg"/>
            </Head>

            <div className="global-container">
                {otherTeamWantsToContinue && (
                    <div className="otherTeamWantsToContinue"></div>
                )}
                {currentScreen === "start" && (
                    <StartScreen onClick={handleStartButtonClick}/>
                )}

                {currentScreen === "introduce" && (
                    <Introduce onClick={handleContinueIntroduction}/>
                )}

                {currentScreen === "teams" && (
                    <ShowTeams socket={socketClient1Ref.current} teamSelected={teamSelected}
                               onTeamSelected={handleAddTeam} client={1}/>
                )}

                {currentScreen === "rules" && teamsDone && (
                    <Interaction title={"Regardez le plateau"} subTitle={"Pour comprendre les règles"} arrow={true}
                                 arrowDown={false} eye={false} volume={false} puzzle={false}
                                 frameText={"Règles du jeu"}/>
                )}

                {currentScreen === "theme" && (
                    <Interaction title={"Choix du thème"} subTitle={false} arrow={true} arrowDown={false} eye={false}
                                 volume={false} puzzle={false} frameText={"Choix du thème"}/>
                )}
                {currentScreen === "themeExplanation" && (
                    <Interaction title={"Mutualisme "} subTitle={""} arrow={false} arrowDown={false} eye={false}
                                 volume={false} puzzle={false} frameText={"Mutualisme"}/>
                )}

                {currentScreen === "indice1" && (
                    <Interaction title={"Indice 1"} subTitle={"Regardez le plateau"} arrow={true} arrowDown={false} eye={true}
                                 volume={false} puzzle={false} frameText={"Indice 1"}/>
                )}
                {currentScreen === "indice2" && (
                    <Interaction title={"Indice 2"} subTitle={"Ecoutez dans les enceintes"} arrow={false} arrowDown={true} eye={false}
                                 volume={true} puzzle={false} frameText={"Indice 2"}/>
                )}
                {currentScreen === "indice2" && (
                    <Interaction title={"Indice 3"} subTitle={"Regardez le plateau"} arrow={true} arrowDown={false} eye={false}
                                 volume={false} puzzle={true} frameText={"Indice 3"}/>
                )}
                {currentScreen === "turnByTurn" && (
                    <TurnByTurn
                        socket={socketClient1Ref.current}
                        data={turnByTurnData} client={1} groupName={"teamGroupOne"}
                    />
                )}

                {currentScreen === "showInteractions" && (
                    <ShowInteractions data={interactionsData}/>
                )}

                {currentScreen === "understandInteraction" && (
                    <UnderstandInteraction themeSelected={themeSelected}/>
                )}

                {currentScreen === "animationQuestion" && (
                    <AnimationQuestionScreen data={animationQuestionData}/>
                )}

                {currentScreen === "question" && (
                    <Question/>
                )}

                {currentScreen === "conclusion" && <Conclusion/>}

                {currentScenario && currentScenario.id === 11 && (
                    <AudioPlayer src={currentScenario.audios}/>
                )}
            </div>
        </>
    );
}
