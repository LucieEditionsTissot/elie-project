import React, {useEffect, useState} from "react";
import Frame from "./Frame";
import config from "../config";
import socket from "socket.io-client";

function Question({socket, answerSelected, onAnswerSelected, client}) {

    const questions = ["Les animaux se mangent entre eux", "Les animaux se protègent les uns des autres", "Les animaux s'entraident pour se nourrir"]
    const [questionSelected, setQuestionSelected] = useState(null)
    useEffect(() => {
        if (socket) {
            socket.on("answerChosen", function (index) {
                const answerSelectedByAnotherTeam = document.querySelector("#question .question[id='" + index + "']")
                if (answerSelectedByAnotherTeam) {
                    answerSelectedByAnotherTeam.classList.add("selectedByOtherTeam");
                }
            });
        }
    }, []);
    function handleClickOnQuestion(e) {
            const question = e.target.closest('.question')
            const allQuestions = document.querySelectorAll('#question .question')
            if (question && questionSelected === null) {
                if (question.classList.contains('is-active')) {
                    question.classList.remove('is-active')
                } else {
                    allQuestions.forEach(question => {
                        question.classList.remove('is-active')
                    })
                    question.classList.add('is-active')
                }
        }
    }

    function handleClickOnButton() {
        setQuestionSelected(document.querySelector('#question .question.is-active').id);
            const answerSelectedIndex = document.querySelector('#question .question.is-active').id;

            const button = document.querySelector('#question .button-next');
            if (button) {
                button.classList.add('disabled')
            }
        }

    useEffect(() => {
        console.log(questionSelected)
        onAnswerSelected(questionSelected)
        console.log(answerSelected)
    }, [questionSelected])

    return (
        <section id="question">
            <Frame color={"green"} crop={false} text={"Mutualisme"}/>

            <div className="template-wrapper">

                <div className="top-part">

                    <div className="left-part">
                        <h3><span>Question</span></h3>
                        <h6>Que comprenez-vous de cette interaction ?</h6>
                    </div>
                    <div className={`${questionSelected === 2 ? "is-answer" : ""} button-next flex flex-row justify-center items-center rounded-full`} onClick={() => handleClickOnButton()}>
                        <p>Suivant</p>
                        <img src={"images/next-icon-wheat.svg"} alt="Next icon"/>
                    </div>

                </div>

                <div className="bottom-part question-wrapper">

                    {questions.map((question, index) => (
                        <div className="question" key={index} id={index} onClick={(e) => handleClickOnQuestion(e)}>
                            <div className="left-part"></div>
                            <div className="right-part">
                                <p>{question}</p>
                            </div>
                        </div>
                    ))}

                    <img src={"images/good-answer.svg"} alt="Good answer icon" className="icon"/>

                </div>
            </div>

        </section>
    );
}

export default Question;
