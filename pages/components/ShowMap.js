import React, { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";

function ShowMap({ animation, currentTurn, onNextTurn }) {
    const [currentThemeData, setCurrentThemeData] = useState(null);

    const themeIndices = [
        {
            theme: "Mutualisme",
            type: "video",
            animation: "video/Anim_indice_01_003.mp4",
            time: 15,
        },
    ];

    useEffect(() => {
        setCurrentThemeData(themeIndices[0]);
    }, []);

    const handleNextTheme = () => {
        onNextTurn();
    };

    return (
        <section id={"map"} className={"hide"}>
            {currentThemeData && (
                <div>
                    {currentTurn === 0 && <VideoPlayer />}

                    {currentTurn === 1 && <AudioPlayer />}

                    <h3>{currentThemeData.theme}</h3>

                    <button onClick={handleNextTheme}>Next Theme</button>
                </div>
            )}
        </section>
    );
}

export default ShowMap;
