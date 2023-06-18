import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("localhost:3000");

function AnimationQuestionScreen(props) {
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [answerSelected, setAnswerSelected] = useState(null);
    const [answerSelectedByOtherTeam, setAnswerSelectedByOtherTeam] = useState(null);
    const [infoText, setInfoText] = useState("");

    useEffect(() => {
        setQuestion(props.data.question);
        setAnswers(props.data.answers.map((answer) => ({ text: answer, status: "" })));
        setCorrectAnswer(props.data.correctAnswer);
    }, [props.data]);

    function handleAnswerClick(id) {
        if (answerSelected === null) {
            setAnswerSelected(id);
        }
    }

    function handleCLickOnValidateButton() {
        if (answerSelected !== null) {
            socket.emit("animationQuestionIsAnswered", answerSelected, { excludeSelf: true });
        }
    }

    socket.on("animationQuestionIsAnswered", function (answerId) {
        if (answerSelected === null) {
            setAnswerSelectedByOtherTeam(answerId);
            setInfoText("L'autre équipe a répondu !");
        }
    });

    socket.on("revealAnimationCorrectAnswer", function (data) {
        const finalAnswer = data[0];
        const animationCorrectAnswer = data[1];

        const updatedAnswers = answers.map((answer, index) => {
            if (index === animationCorrectAnswer) {
                return { ...answer, status: "correct" };
            }
            return answer;
        });

        setAnswers(updatedAnswers);
    });

    return (
        <section id="animationQuestionScreen" className="text-center">
            <h1>{question}</h1>
            <p className="sub-title">Réfléchissez ensemble afin de trouver la bonne réponse !</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {answers.map((answer, index) => (
                    <p
                        key={index}
                        className={`py-3 rounded-lg cursor-pointer ${
                            (index === answerSelected && answerSelected !== null) ||
                            (index === answerSelectedByOtherTeam && answerSelectedByOtherTeam !== null)
                                ? "bg-red-500 text-white"
                                : answer.status === "correct"
                                    ? "bg-green-500 text-white"
                                    : "bg-blue-500 text-white"
                        }`}
                        onClick={() => handleAnswerClick(index)}
                    >
                        {answer.text}
                    </p>
                ))}
            </div>
            <button
                className={`mt-4 py-2 px-4 rounded-lg bg-green-500 text-white ${
                    answerSelected !== null ? "block" : "hidden"
                }`}
                onClick={handleCLickOnValidateButton}
            >
                Valider
            </button>
            {answerSelectedByOtherTeam !== null && (
                <p className="info mt-4">{infoText}</p>
            )}
        </section>
    );
}

export default AnimationQuestionScreen;
