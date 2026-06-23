import React, { useEffect, useState } from 'react';
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from '/Home';
import Home from './Home';


const App = () => {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
