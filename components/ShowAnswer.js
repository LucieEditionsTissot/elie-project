import React from "react";

function ShowAnswer({ correctAnswer, isCorrect, onClose }) {
    const textClass = isCorrect ? "text-green-500" : "text-red-500";

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-80%">
                <h2 className={`text-xl font-bold mb-4 ${textClass}`} style={{ lineHeight: "1.5" }}>
                    {isCorrect ? "Bravo,\n" : "Dommage,\n"}
                    {isCorrect ? "tu as trouvé la bonne espèce !" : "ce n'est pas la bonne espèce."}
                </h2>
                <p className="text-gray-600">{correctAnswer}</p>
            </div>
        </div>
    );
}

export default ShowAnswer;
