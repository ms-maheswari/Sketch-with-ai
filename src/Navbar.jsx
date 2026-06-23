import React from 'react'
import { HiSun } from 'react-icons/hi'
import { HiMoon } from 'react-icons/hi2'

const Navbar = ({ theme, setTheme }) => {

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] ">
        <div className="logo">
         <h3 className='text-[25px] font-[700] sp-text'> UI with AI</h3>
        </div>

        <div className="icons flex items-center gap-[15px]">
          <button className="icon" onClick={toggleTheme}>
            {theme === "dark" ? <HiMoon /> : <HiSun />}
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar;
