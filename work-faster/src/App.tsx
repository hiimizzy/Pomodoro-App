import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

//import images
import playImg from './assets/play.png';
import resetImg from './assets/reset.png';
import studyBtnClicked from './assets/study-clicked.png';
import breakBtnClicked from './assets/break-clicked.png';
import breakBtn from './assets/break.png';
import idleGif from './assets/idle.gif';
import workGif from './assets/work.gif';
import workBtnClicked from './assets/work-clicked.png';
import workBtn from './assets/work.png';
import breakGif from './assets/break.gif';
import meowSound from "./assets/meow.mp3";
import closeBtn from './assets/close.png';

function App() {

  const [timeLeft, setTimeLeft] = useState(25 * 60); //25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement,setEncouragement] = useState('');
  const [isClose, setIsClose ] = useState(false);
  const [gifImage, setGifImage] = useState(idleGif);
  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
  const [workButtonImage, setWorkButtonImage] = useState(workBtn);
  const [image, setImage] = useState(playImg);
  const meowAudio = new Audio(meowSound);

  //frases de incetivo
  const encouragements = [
    "You can do it!",
    "Keep going!",
    "Stau focused!",
    "You're doing great!",
    "Almost there!",
    "Stay strong!",
    "Don't give up!",
    "Keep pushing!",
    "You're on fire!"
  ];

  const encouragementsBreak = [
    "Take a deep breath!",
    "Relax and recharge!",
    "Enjoy ur break!",
    "Snack time!",
    "Stay hydrated!",
    "Snack time!",
    "Stretch ur legs!"
  ];

  //Encouragement message updater
  useEffect (() => {
    let messageInterval: NodeJS.Timeout;

    if(isRunning){
      const messages = isBreak ? encouragementsBreak : 
      encouragements;
      setEncouragement(messages[0]); //set initial message
      let index = 1; //start from the second message
      messageInterval = setInterval(() => {
        setEncouragement(messages[index]);
        index = (index + 1) % messages.length;
      }, 4000); //update every 4 seconds
    }else{
      setEncouragement(''); //clear messahe when not running
    }

    return () => clearInterval(messageInterval); //cleanup on unmount or when isRunning changes
  }, [isRunning, isBreak]);

  //close
  const close = () => {
    if(!isClose){
      setIsClose(true);
    }
  }


  useEffect(() => {
    let timer : NodeJS.Timeout;
    if(isRunning && timeLeft > 0 ) {
      timer = setInterval( ()=>{
        setTimeLeft(prev => prev - 1);
      }, 1000); //update every second
    }
    return () => clearInterval(timer); //cleanup on unmount or when isRunning changes
  }, [isRunning, timeLeft]);

  //Tempo

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');

    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  //Set initial switch moed to false
  useEffect(() => {
    switchMode(false);
  }, [] );

  //Miau 
  useEffect(() =>{
    if (timeLeft === 0 && isRunning){
      meowAudio.play().catch(err => {
        console.error("Audio play failed:",err);
      });
      setIsRunning(false); //Optional: auto-play the timer
      setImage(playImg); //Reset to play button
      setGifImage(idleGif); //Reset to idle gif
      setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    }
  }, [timeLeft]);

  //Switch between work and break modes 

  const switchMode =  (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakButtonImage(breakMode ? breakBtnClicked : breakBtn);
    setWorkButtonImage(breakMode ? workBtnClicked : workBtn);
    setTimeLeft(breakMode ? 5 * 60 : 25 * 60);
    setGifImage(idleGif);
  }

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setGifImage(isBreak ? breakGif : workGif);
    }else {
      setIsRunning(false);
      setTimeLeft(isBreak ?5 * 60 : 25*60); //reset to 25 minutes
      setGifImage(idleGif);
    }
  }

  const containerClass = `home-container ${isRunning ? "background-green" : ""}`;

  return (
    //botões
    <div className={containerClass} style={{position: 'relative'}}>
    <div>
      {/* botão fechar */}
      <button className='closeButton'>
        <img src={closeBtn} alt="Close" />
      </button>
    </div>

    <div className='home-content'>
      <div className='home-controls'>
        <div className='mode-buttons'>
          <button className='image-button'
          onClick={ () => switchMode(false)}>
            <img src={workButtonImage} alt="Work" />
          </button>
          <button className='image-button'
          onClick={ () => switchMode(true)}>
            <img src={breakButtonImage} alt="Break" />
          </button>
        </div>
        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
          { encouragement }
        </p>
        <h1 className='home-timer'>{formatTime(timeLeft)}</h1>

        <img src={gifImage} alt="Timer status" className='gif-image' />

        <button className='home-button' onClick={handleStart}>
          <img src={playImg} alt="Start" />
        </button>
      </div>
    </div>
    </div>
  );
}

export default App;
