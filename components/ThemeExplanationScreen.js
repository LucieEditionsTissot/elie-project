import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";

const socket = io("localhost:3000");

const ThemeExplanationScreen = ({ themeSelected }) => {
        return (
            <section id="themeExplanationScreen">
                <h1>{themeSelected}</h1>
            </section>
        );
};

export default ThemeExplanationScreen;

