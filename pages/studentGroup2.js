import React, {useState, useEffect, useRef} from "react";
import Head from "next/head";
import ShowTeams from "../components/ShowTeams";
import TurnByTurn from "../components/TurnByTurn";
import Conclusion from "../components/Conclusion";
import AudioPlayer from "../components/AudioPlayer";
import {url} from "./_app";
import StartScreen from "../components/StartScreen";
import Introduce from "../components/Introduce";
import {io} from "socket.io-client";
import Interaction from "../components/Interaction";
import Question from "../components/Question";
import TurnByTurn2 from "../components/TurnByTurn2";
import TurnByTurn3 from "../components/TurnByTurn3";
import Answer from "../components/Answer";

export default function StudentTablet2() {
    const [otherTeamWantsToContinue, setOtherTeamWantsToContinue] = useState(false);
    const [teamSelected, setTeamSelected] = useState(null);
    const [teamsDone, setTeamsDone] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(null);
    const [turnByTurnData, setTurnByTurnData] = useState(null);
    const [hiddenCards, setHiddenCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState([]);
    const [showAnswer, setShowAnswer] = useState(null);
    const [interactionsExplainedData, setInteractionsExplainedData] = useState(null);
    const [audioScenario, setAudioScenario] = useState(false);
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

        socketClient2.on("otherTeamWantsToContinue", () => {
            setOtherTeamWantsToContinue(true);
        });

        socketClient2.on("startExperience", () => {
            setCurrentScreen("start");
        });

        socketClient2.on("confirmIntroductionStart", () => {
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
            setCurrentScreen("theme");
        });

        socketClient2.on("themeIsSelectedShowThemeExplanation", () => {
            setCurrentScreen("themeExplanation");
        });

        socketClient2.on("setIndice1Screen", () => {
            setCurrentScreen("indice1");
        });

        socketClient2.on("setIndice2Screen", () => {
            setCurrentScreen("indice2");
        });

        socketClient2.on("setIndice3Screen", () => {
            setCurrentScreen("indice3");
        });

        socketClient2.on("audioIndice", () => {
            setAudioScenario(true);
        });

        socketClient2.on("stopAudioIndice", () => {
            setAudioScenario(false);
        });

        socketClient2.on("startGame", (data) => {
            setTurnByTurnData(data);
            setCurrentScreen("turnByTurn");
        });

        socketClient2.on("gameDataUpdated", (updatedData) => {
            setAudioScenario(false);
            console.log("game data is: ", updatedData);
            setHiddenCards(updatedData.hiddenCards);
            setCurrentIndex(updatedData.currentIndex);
            setTurnByTurnData((prevData) => {
                console.log(updatedData);
                return { ...prevData, ...updatedData };
            });
            setCurrentScreen("turnByTurn2");
        });

        socketClient2.on("gameDataUpdatedLastTime", (updatedData) => {
            console.log("game data is: ", updatedData);
            setHiddenCards(updatedData.hiddenCards);
            setCurrentIndex(updatedData.currentIndex);
            setTurnByTurnData((prevData) => {
                console.log(updatedData);
                return { ...prevData, ...updatedData };
            });
            setCurrentScreen("turnByTurn3");
        });

        socketClient2.on("showInteractions", (data) => {
            setShowAnswer(data);
            setCurrentScreen("showInteractions");
        });

        socketClient2.on("interactionExplained", (data) => {
            setInteractionsExplainedData(data);
            setCurrentScreen("understandInteraction");
        });

        socketClient2.on("askQuestion", () => {
            setCurrentScreen("question");
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

    }, []);

    const handleAddTeam = (teamIndex) => {
        setTeamSelected(teamIndex)
        socketClient2Ref.current.emit("addTeam", teamIndex);
    }
    const handleContinueIntroduction = () => {
        socketClient2Ref.current.emit("wantsToContinueIntroduction");
    };

    const handleStartButtonClick = () => {
        socketClient2Ref.current.emit("wantsToStartExperience");
    };
    const handleRulesButtonClick = () => {
        socketClient2Ref.current.emit("rules");
    };
    const handleAnswerQuestion = (answer) => {
        const data = ["two", answer]
        socketClient2Ref.current.emit("answer", data);
    }


    return (
        <>
            <Head><title>ELIE | Groupe 2</title>
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

                <AudioPlayer scenario={audioScenario} src={"audio/corbeau.mp3"}/>

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
                    <ShowTeams socket={socketClient2Ref.current} teamSelected={teamSelected}  onTeamSelected={handleAddTeam} client={2}/>
                )}

                {currentScreen === "rules" && teamsDone && (
                    // <RulesScreen socket={socketClient1Ref.current} onRulesButtonClicked={handleRulesButtonClick} />
                    <Interaction title={"Regardez le plateau"} subTitle={"Pour comprendre les règles"} arrow={true}
                                 arrowDown={false} eye={false} volume={false} puzzle={false}
                                 frameText={"Règles du jeu"}/>
                )}

                {currentScreen === "theme" && (
                    <Interaction title={"Choix de l'interaction"} subTitle={""} arrow={true} arrowDown={false} eye={false}
                                 volume={false} puzzle={false} frameText={"Interaction"}/>
                )}

                {currentScreen === "themeExplanation" && (

                    <Interaction title={"Mutualisme"} subTitle={""} arrow={true} arrowDown={false} eye={false}
                                 volume={false} puzzle={false} frameText={"Mutualisme"}/>
                )}

                {currentScreen === "indice1" && (
                    <Interaction title={"Indice 1"} subTitle={"Regardez le plateau"} arrow={true} arrowDown={false} eye={true}
                                 volume={false} puzzle={false} frameText={"Indice 1"}/>
                )}
                {currentScreen === "indice2" && (
                    <Interaction title={"Indice 2"} subTitle={"écoutez dans les enceintes"} arrow={true} arrowDown={true} eye={false}
                                 volume={true} puzzle={false} frameText={"Indice 2"}/>
                )}
                {currentScreen === "indice3" && (
                    <Interaction title={"Indice 3"} subTitle={"Regardez le plateau"} arrow={true} arrowDown={false} eye={false}
                                 volume={false} puzzle={true} frameText={"Indice 3"}/>
                )}


                {currentScreen === "turnByTurn" && (
                    <TurnByTurn
                        socket={socketClient2Ref.current}
                        data={turnByTurnData}
                        client={"two"}
                        groupName={"teamGroupTwo"}
                    />
                )}

                {currentScreen === "turnByTurn2" && (
                    <TurnByTurn2
                        socket={socketClient2Ref.current}
                        data={turnByTurnData}
                        client={"two"}
                        groupName={"teamGroupTwo"}
                        hiddenCards={hiddenCards}
                        currentIndex={currentIndex}
                    />
                )}
                {currentScreen === "turnByTurn3" && (
                    <TurnByTurn3
                        socket={socketClient2Ref.current}
                        data={turnByTurnData}
                        client={"two"}
                        groupName={"teamGroupTwo"}
                        hiddenCards={hiddenCards}
                        currentIndex={currentIndex}
                    />
                )}
                {currentScreen === "showInteractions" && (
                    <Answer socket={socketClient2Ref.current}  animalChosen={showAnswer} client={"two"}/>
                )}

                {currentScreen === "understandInteraction" && (
                    <Interaction title={"Mutualisme"} subTitle={" écoutez et regardez le plateau"} arrow={true} arrowDown={false} eye={false}
                                 volume={false} puzzle={false} frameText={"Mutualisme"}/>
                )}

                {currentScreen === "question" && (
                    <Question socket={socketClient2Ref.current} onAnswerSelected={handleAnswerQuestion} client={"two"}/>
                )}

                {currentScreen === "conclusion" && <Conclusion/>}

            </div>
        </>
    );
}
