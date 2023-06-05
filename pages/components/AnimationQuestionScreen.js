import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";

const socket = io('localhost:3000')

function AnimationQuestionScreen(props) {

    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [answerSelected, setAnswerSelected] = useState(null);
    const [answerSelectedByOtherTeam, setAnswerSelectedByOtherTeam] = useState(null);

    useEffect(() => {
        setQuestion(props.data[0])
        setAnswers(props.data[1])
        setCorrectAnswer(props.data[2])

    }, [props.data])

    function handleAnswerClick(e, id) {
        if (answerSelected === null) {
            const allAnswers = document.querySelectorAll("#animationQuestionScreen .answer")
            const button = document.querySelector("#animationQuestionScreen .validateButton")
            const answerSelected = e.target
            if (answerSelected.classList.contains("selected")) {
                answerSelected.classList.remove("selected")
                button.style.display = "none"
            } else {
                allAnswers.forEach((answer) => {
                    answer.classList.remove("selected")
                })
                answerSelected.classList.add("selected")
                button.style.display = "block"
            }
        }
    }

    function handleCLickOnValidateButton() {
        const selectedAnswer = document.querySelector("#animationQuestionScreen .answer.selected")
        if (selectedAnswer) {
            const answerId = selectedAnswer.id
            setAnswerSelected(answerId)
            const button = document.querySelector("#animationQuestionScreen .validateButton")
            button.style.display = "none"
            if (answerSelectedByOtherTeam !== null) {
                const infoText = document.querySelector("#animationQuestionScreen .info")
                infoText.innerhtml = "En attente de l'autre équipe..."
            }
            socket.emit("animationQuestionIsAnswered", answerId, {excludeSelf: true});
        }
    }

    socket.on("animationQuestionIsAnswered", function (answerId) {
        if (answerSelected === null) {
            setAnswerSelectedByOtherTeam(answerId)
            const infoText = document.querySelector("#animationQuestionScreen .info")
            infoText.textContent = "L'autre équipe a répondu !"
        }
        const answerSelectedByTheOtherTeam = document.querySelector("#animationQuestionScreen .answer[id='" + answerId + "'")
        answerSelectedByTheOtherTeam.classList.add("selectedByTheOtherTeam")
    });

    socket.on("revealAnimationCorrectAnswer", function (data) {
        const finalAnswer = data[0]
        const animationCorrectAnswer = data[1]
        const infoText = document.querySelector("#animationQuestionScreen .info")
        infoText.style.display = "none"
        const correctAnswerElement = document.querySelector("#animationQuestionScreen .answer[id='" + animationCorrectAnswer + "'")
        const allAnswers = document.querySelectorAll("#animationQuestionScreen .answer")
        console.log(animationCorrectAnswer)
        allAnswers.forEach((answer) => {
            if (answer.classList.contains("selected") && answer.id !== animationCorrectAnswer || answer.classList.contains("selectedByTheOtherTeam") && answer.id !== animationCorrectAnswer) {
                answer.classList.remove("selected")
                answer.classList.remove("selectedByTheOtherTeam")
                answer.classList.add("wrongAnswer")
            }
        })
        setTimeout(() => {
            allAnswers.forEach((answer) => {
                answer.classList.remove("wrongAnswer")
            })
            setTimeout(() => {
                if (correctAnswerElement) {
                    correctAnswerElement.classList.add("correctAnswer")
                }
            }, 1000)
        }, 3000)
    });

    return (
        <section id={"animationQuestionScreen"} className={"hide"}>

            <h1>{question}</h1>

            <p className={"sub-title"}>Réfléchissez ensemble afin de trouver la bonne réponse !</p>

            <div className={"wrapper"}>

                {answers && answers.length > 0 ? (
                    answers.map((answer, index) => {
                        return (
                            <p key={index} id={index} className={"answer"}
                               onClick={(e) => handleAnswerClick(e, index)}>{answer}</p>
                        );
                    })
                ) : (
                    ""
                )}

            </div>

            <div className={"validateButton"} onClick={() => handleCLickOnValidateButton()}>Valider</div>

            <p className={"info"}></p>

        </section>
    )
}

export default AnimationQuestionScreen;
