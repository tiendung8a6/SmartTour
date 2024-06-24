import React, { useState } from "react";
import useStore from "../store";
import { useMantineColorScheme } from "@mantine/core";

const ThemeSwitch = () => {
  const { setTheme } = useStore();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
    setColorScheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      className={`switch ${isDarkMode ? "light" : "dark"}`}
      onClick={toggleTheme}
    >
      <div className={`ball ${isDarkMode ? "dark" : "light"}`}></div>
    </div>
  );
};

export default ThemeSwitch;
