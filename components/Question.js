import React, { useEffect, useState } from "react";
import Frame from "./Frame";
import config from "../config";
import socket from "socket.io-client";

function Question({ socket, onAnswerSelected, client }) {
    const questions = [
        "Les animaux se mangent entre eux",
        "Les animaux se protègent les uns des autres",
        "Les animaux s'entraident pour se nourrir"
    ];
    const [questionSelected, setQuestionSelected] = useState(null);
    const [revealText, setRevealText] = useState(false);
    const [questionData, setQuestionData] = useState(null);

    useEffect(() => {
        if (socket) {
            socket.on("answerChosen", function (index) {
                const answerSelectedByAnotherTeam = document.querySelector(
                    `#question .question[id='${index}']`
                );
                if (answerSelectedByAnotherTeam) {
                    answerSelectedByAnotherTeam.classList.add("selectedByOtherTeam");
                }
            });

            socket.on("questionReveal", function (data) {
                console.log(data);
                if (questionData === null) {
                    setQuestionData(data);
                    console.log(data);
                }
            });
        }
    }, [socket]);

    useEffect(() => {
        const bottomPart = document.querySelector("#question .bottom-part");
        setTimeout(() => {
            bottomPart.classList.add("is-active");
            setTimeout(() => {
                socket.emit("conclusion");
            }, 5000);
        }, 3000);
        console.log(questionData);
    }, [questionData]);


    function handleClickOnQuestion(e) {
        const button = document.querySelector("#question .button-next");
        const question = e.target.closest(".question");
        const allQuestions = document.querySelectorAll("#question .question");
        if (question && questionSelected === null) {
            if (question.classList.contains("is-active")) {
                question.classList.remove("is-active");
                button.classList.add("disabled");
            } else {
                allQuestions.forEach((question) => {
                    question.classList.remove("is-active");
                });
                question.classList.add("is-active");
                button.classList.remove("disabled");
            }
        }
    }

    function handleClickOnButton() {
        const button = document.querySelector("#question .button-next");
        const answerSelectedIndex = document.querySelector(
            "#question .question.is-active"
        ).id;

        if (!button.classList.contains("disabled")) {
            if (answerSelectedIndex) {
                setQuestionSelected(answerSelectedIndex);
                onAnswerSelected(answerSelectedIndex);
            }
            button.classList.add("disabled");
        }
    }

    return (
        <section id="question">
            <Frame color={"green"} crop={false} text={"Mutualisme"} />

            <div className="template-wrapper">
                <div className="top-part">
                    <div className="left-part">
                        <h3>
                            <span>Question</span>
                        </h3>
                        <h6>Que comprenez-vous de cette interaction ?</h6>
                    </div>
                    <div
                        className={`button-next flex flex-row justify-center items-center rounded-full ${
                            revealText ? "" : "disabled"
                        }`}
                        onClick={handleClickOnButton}
                    >
                        <p>Suivant</p>
                        <img src={"images/next-icon-wheat.svg"} alt="Next icon" />
                    </div>
                </div>

                <div className="bottom-part question-wrapper">
                    {questions.map((question, index) => (
                        <div
                            className="question"
                            key={index}
                            id={index}
                            onClick={handleClickOnQuestion}
                        >
                            <div className="left-part"></div>
                            <div className="right-part">
                                <p>{question}</p>
                            </div>
                        </div>
                    ))}

                    {questionData !== null && (
                        <>
                            {questionData[client] === 2 ? (
                                <img
                                    src={"images/good-answer.svg"}
                                    alt="Good answer icon"
                                    className="icon"
                                />
                            ) : (
                                <img
                                    src={"images/wrong-answer.svg"}
                                    alt="Bad answer icon"
                                    className="icon"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Question;
