
import React from 'react';
import '../style/home.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

const Home = () => {

    
    return (
        <div className='home'>
            <div className='columns' style={{display: "flex", justifyContent: "space-between"}}>
                <div className='fpt-logo'>
                    <img src='fpt-logo.png'></img>
                </div>
                <Link to="/login">
                    <div className='login'>
                        <button className='button-login'>
                            Login
                        </button>
                    </div>
                </Link>
            </div>
            <hr style={{margin: 0, color: 'gray'}}/>
            <div className='home-container' style={{display: "flex", justifyContent: "space-evenly"}}> 
                <div className='title'>
                    <h1 >Social Constructive Learning</h1>
                    <h3 className='content'>Construct knowledge and personalize the learning way to empower learners' full potential.</h3>
                    <button className='button-join'>
                        Join now
                    </button>
                </div>
                <div>
                    <img src='education.png'></img>
                </div>
            </div>
        </div>
    );
};

export default Home;