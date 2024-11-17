import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@/home/context/ThemeContext';

const ThemeSwitcherCard = () => {
  const { theme, toggleTheme } = useTheme();

  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme()
  };
  return (
    <StyledWrapper>
      <div style={{ width: '100%', height: '100%' }}>
        <input
          id="switch"
          type="checkbox"
          checked={isDarkMode}
          onChange={handleThemeToggle}
        />
        <div className="app" style={{ width: '100%', height: '100%' }}>
          <div className="body" style={{ width: '100%', height: '100%' }}>
            <div className="phone" style={{ width: '100%', height: '100%' }}>
              <div className="menu">
                <div className="time">5:20</div>
                <div className="icons">
                  <div className="network" />
                  <div className="battery" />
                </div>
              </div>
              <div className="content">
                <div className="circle">
                  <div className="crescent" />
                </div>
                <label htmlFor="switch">
                  <div className="toggle" />
                  <div className="names">
                    <p className="light">Light</p>
                    <p className="dark">Dark</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Make sure the wrapper takes full height and width of its parent */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .credit {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    color: white;
  }

  .credit a {
    color: inherit;
  }

  /* Main Circle */
  .main-circle {
    width: 40vw;  /* Make the circle responsive */
    height: 40vw;
    border-radius: 50%;
    background: linear-gradient(40deg, #FF0080, #FF8C00 70%);
    position: absolute;
    z-index: 1;
    left: 50%;
    transform: translate(-50%, -70%);
  }

  /* Phone */
  .phone {
    position: relative;
    z-index: 2;
    width: 100%;
    background-color: inherit;
   // box-shadow: 0 4px 35px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }

  /* Menu */
  .menu {
    font-size: 80%;
    opacity: 0.4;
    padding: 0.8rem 1.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Icons */
  .icons {
    display: flex;
    margin-top: 0.5rem;
  }

  .battery {
    width: 0.85rem;
    height: 0.45rem;
    background-color: black;
  }

  .network {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 6.8px 7.2px 6.8px;
    border-color: transparent transparent black transparent;
    transform: rotate(135deg);
    margin: 0.12rem 0.5rem;
  }

  /* Content */
  .content {
    display: flex;
    flex-direction: column;
    margin: auto;
    text-align: center;
    width: 70%;
    transform: translateY(5%);
  }

  .circle {
    position: relative;
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
    background: linear-gradient(40deg, #FF0080, #FF8C00 70%);
    margin: auto;
  }

  .crescent {
    position: absolute;
    border-radius: 50%;
    right: 0;
    width: 6rem;
    height: 6rem;
    background: white;
    transform: scale(0);
    transform-origin: top right;
    transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  label, .toggle {
    height: 2.8rem;
    border-radius: 100px;
  }

  label {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    position: relative;
    margin: 4rem 0;
    cursor: pointer;
  }

  .toggle {
    position: absolute;
    width: 50%;
    background-color: #fff;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .names {
    font-size: 90%;
    font-weight: bolder;
    color: black;
    width: 65%;
    margin-left: 17.5%;
    margin-top: 6.5%;
    position: absolute;
    display: flex;
    justify-content: space-between;
    user-select: none;
  }

  .dark {
    opacity: 0.5;
  }

  .time {
    color: black;
  }

  /* Switch Styles */
  [type="checkbox"] {
    display: none;
  }

  /* Toggle */
  [type="checkbox"]:checked + .app .toggle {
    transform: translateX(100%);
    background-color: #34323D;
  }

  [type="checkbox"]:checked + .app .dark {
    opacity: 1;
    color: white;
  }

  [type="checkbox"]:checked + .app .light {
    opacity: 1;
    color: white;
  }

  /* App */
  [type="checkbox"]:checked + .app .body {
    background-color: #26242E;
    color: white;
  }

  /* Body (White Background for Day Mode) */
  .body {

    border-radius: 40px;
    background-color: white; /* White background for light mode */
  }

  /* Circle */
  [type="checkbox"]:checked + .app .crescent {
    transform: scale(1);
    background: #26242E;
  }

  [type="checkbox"]:checked + .app .circle {
    background: linear-gradient(40deg, #8983F7, #A3DAFB 70%);
  }

  [type="checkbox"]:checked + .app .main-circle {
    background: linear-gradient(40deg, #8983F7, #A3DAFB 70%);
  }

  [type="checkbox"]:checked + .app .body .phone .menu .time {
    color: white;
  }

  [type="checkbox"]:checked + .app .body .phone .menu .icons .network {
    border-color: transparent transparent white transparent;
  }

  [type="checkbox"]:checked + .app .body .phone .menu .icons .battery {
    background-color: white;
  }

  [type="checkbox"]:checked + .app .body {
    border-radius: 40px;
  }
`;
export default ThemeSwitcherCard;
