import React, { useEffect, useRef } from "react";

function ShowRules({ rules }) {
    const rulesRef = useRef(null);

    useEffect(() => {
        if (rulesRef.current) {
            rulesRef.current.classList.remove("hide");
        }
    }, []);

    return (
        <section id="rules" ref={rulesRef} className="hide">
            <h1>Affichage des règles blablabla</h1>
            {Array.isArray(rules) && rules.length > 0 ? (
                <ul>
                    {rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                    ))}
                </ul>
            ) : (
                <p>Aucune règle à afficher</p>
            )}
        </section>
    );
}

export default ShowRules;

