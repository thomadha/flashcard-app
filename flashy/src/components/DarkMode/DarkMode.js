import React, { useState, useEffect } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {
    // Retrieve the saved dark mode state from localStorage, defaulting to false if not found
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const [isDarkMode, setIsDarkMode] = useState(savedDarkMode);

    // Effect to update the data-theme attribute and save the dark mode state to localStorage
    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        document.querySelector("body").setAttribute('data-theme', theme);
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className='dark_mode' onClick={toggleDarkMode}>
            <div className={`dark_mode_toggle ${isDarkMode ? 'dark_mode_on' : 'dark_mode_off'}`}>
                {isDarkMode ? <Moon /> : <Sun />}
            </div>
        </div>
    );
};

export default DarkMode;