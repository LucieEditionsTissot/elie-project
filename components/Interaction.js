import React from "react";
import Frame from "./Frame";

function Interaction(props) {

    return (
        <section id="interaction" className="flex flex-row items-center justify-around">

            <Frame color={"blue"} crop={false} text={props.frameText}/>

            {props.arrow &&
                <div className={`arrow ${props.arrowDown ? "down" : ""}`}>
                    <div>
                        <img src={"images/arrow-green.svg"} alt={"arrow green"}/>
                    </div>
                </div>
            }

            <div className="wrapper">

                {props.eye &&
                    <img src={"images/eye-white.svg"} alt="Eye icon" className="icon"/>
                }

                {props.volume &&
                    <img src={"images/volume-white.svg"} alt="Volume icon" className="icon"/>
                }

                {props.puzzle &&
                    <img src={"images/puzzle-white.svg"} alt="Puzzle icon" className="icon"/>
                }

                <h3 className="title">{props.title}</h3>

                {props.subTitle !== "" &&
                    <h6 className="sub-title">{props.subTitle}</h6>
                }

            </div>

            {props.arrow &&
                <div className={`arrow ${props.arrowDown ? "down" : ""}`}>
                    <div>
                        <img src={"images/arrow-green.svg"} alt={"arrow green"}/>
                    </div>
                </div>
            }

        </section>
    );
}

export default Interaction;
