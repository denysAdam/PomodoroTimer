import { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import './Pomodoro.css';  

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

export default function PomodoroTimer() {
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const totalTime = isBreak ? 5 * 60 : 25 * 60;

    const handleTimerComplete = useCallback(() => {
        if (isBreak) {
            setIsRunning(false);
            setIsBreak(false);
            setTimeLeft(25 * 60);
        } else {
            setIsBreak(true);
            setTimeLeft(5 * 60);
            setIsRunning(true);
        }
    }, [isBreak]);
    
    useEffect(() => {
        let timer: number | undefined;
        if (isRunning && timeLeft > 0) {
            timer = window.setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft, isBreak, handleTimerComplete]);
    

    const handleStartStop = () => {
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(25 * 60);
    };

    const addMinute = () => {
        if (timeLeft < 1441) {
        setTimeLeft((prevTime) => prevTime + 60);
        }
    };
    
    const subtractMinute = () => {
        if (timeLeft > 60) {
            setTimeLeft((prevTime) => prevTime - 60);
        }
    };

    const tailLength = `${(timeLeft / totalTime) * 90}px`;

    return (
        
        <Box 
            className="container" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh', 
                backgroundColor: '#EDEFF2', 
                color: '#333333',
                "--tail-length": tailLength 
            }}
        >
            
            <Typography
                variant="h2"
                sx={{
                    marginBottom: 18,
                    color: '#333333',
                    fontFamily: '"Comfortaa"',
                    fontWeight: 700
                }}
                >
                {isBreak ? "Reloading Bomb" : "Pomodoro Timer"}
            </Typography>


            <Box 
                className="circularProgress" 
                sx={{ 
                    position: 'relative', 
                    width: 300, 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}
            >
                {!isBreak ? (<Box className="tail">
                    <Box className="spark"></Box>
                </Box>): null}
                
                <Box 
                    className="rectangularTop" 
                    sx={{ 
                        position: 'absolute', 
                        top: '-40px', 
                        width: 100, 
                        height: 50, 
                        backgroundColor: '#2F333E', 
                        borderRadius: '10px', 
                        zIndex: 2 
                    }}
                />

                {/* Background CircularProgress (visible after progress passes) */}
                <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <CircularProgress
                        variant="determinate"
                        value={100}  
                        size={300}
                        thickness={10}
                        sx={{ color: '#000000' }}  
                    />
                </Box>

                {/* Foreground CircularProgress */}
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <CircularProgress
                        variant="determinate"
                        value={(timeLeft / totalTime) * 100}
                        size={300}
                        thickness={10}
                        sx={{ color: '#C04D4F'  }}  // Color of the progress bar
                    />
                </Box>

                <Box 
                    className="innerContainer" 
                    sx={{ 
                        position: 'relative', 
                        zIndex: 1, 
                        backgroundColor: '#2F333E', 
                        width: 290, 
                        height: 290, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}
                >
                    <Typography sx={{ color: '#ffffff' , fontSize: 70}}>
                        {formatTime(timeLeft)}
                    </Typography>
                    <Box className="buttonContainer" sx={{ display: 'flex', gap: 1}}>
                        <IconButton
                            onClick={addMinute}
                            disabled={isRunning}
                            sx={{ backgroundColor: '#4D93BF', color: '#FFFFFF', scale: .9}} 
                            size="large"
                        >
                            <AddIcon />
                        </IconButton>
                        <IconButton
                            onClick={subtractMinute}
                            disabled={isRunning}
                            sx={{ backgroundColor: '#4D93BF', color: '#FFFFFF', scale: .9 }} 
                            size="large"
                        >
                            <RemoveIcon sx={{ transform: 'rotate(180deg)' }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <Button
                    variant="contained"
                    
                    onClick={handleStartStop}
                    startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon sx={{ transform: 'rotate(360deg)' }} />}
                    sx={{ marginRight: 2 
                        , backgroundColor: isRunning ? '#B84DBF' : '#8EBF4D',
                        outline: 'none',
                        color: '#FFFFFF', '&:hover': {
                            backgroundColor: isRunning ? '#A344A9' : '#76A43C',
                            
                        }
                        }}
                >
                    {isRunning ? "Stop" : "Start"}
                </Button>
                <Button
                    variant="contained"
                    
                    onClick={handleReset}
                    startIcon={<ReplayIcon />}
                    sx={{
                        backgroundColor: "#D79C3E",
                        outline: 'none',
                        color: '#FFFFFF', 
                        '&:hover': {
                            backgroundColor: '#C28531' 
                        }
                    }}
                >
                    Reset
                </Button>
            </Box>
        </Box>
    );
}
