import React, { useEffect, useRef } from "react";

function ThemeExplanation({ explanation }) {
    const explanationRef = useRef(null);

    useEffect(() => {
        if (explanationRef.current) {
            explanationRef.current.style.display = "block";
        }
    }, []);

    return (
        <section id="themeExplanation" ref={explanationRef}>
            <h1>Explication du thème</h1>
            <h3>{explanation}</h3>
        </section>
    );
}

export default ThemeExplanation;
