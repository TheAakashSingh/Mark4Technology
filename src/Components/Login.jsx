import React from 'react'
import './Login.css'
import './Registration.css'
import linkIcon1 from '../Images/Vector (3).png'
import linkIcon2 from '../Images/Vector (4).png'
import menu from '../Images/Menu.png'
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'
const Login = () => {
    const { useState } = React;
    const [inputtext, setinputtext] = useState({
        password: ""
    });
    const [click, setClick] = useState(false)
    const closeLeftSide = () => {
        setClick(true)
    }

    const [warnpassword, setwarnpassword] = useState(false);


    const inputEvent = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setinputtext((lastValue) => {
            return {
                ...lastValue,
                [name]: value
            }
        });

    }



    const submitForm = (e) => {
        e.preventDefault();
        setwarnpassword(false);

        if (inputtext.password === "") {
            setwarnpassword(true);
        }
        else {
            alert("Login SuccessFull");
        }

    }


    return (
        <div className='Login'>
            <div className="StartSection">
                <div className="R_leftSection">
                    <div className={`regLoginLeft ${click ? 'regLeftBlock' : ''}`}>
                        <img id='close' onClick={closeLeftSide} src={close} alt="" />
                        <img src={logo} alt="" className="logo" />
                    </div>
                </div>
                <div className="R_midSection">
                    <div className="headerRegistration">
                        <div className="linkicon">
                            <img src={linkIcon1} alt="" />
                            <img src={linkIcon2} alt="" />
                        </div>
                        <div className="heads_R">
                            <h3>Login</h3>
                        </div>
                    </div>
                    <div className="registrationForms">
                        <form onSubmit={submitForm} action="/postss" method="post">
                            <label >
                                Employee Id
                                <input type="text" name="employeeId" required />
                            </label>

                            <label >Username
                                <input type="text" name="userName" id="" required />
                            </label>
                            <label>Password
                                <input required type="password" className={` ${warnpassword ? "warning" : ""} `} value={inputtext.password} onChange={inputEvent} name="password" />

                            </label>
                            <div className="bottomPortion">
                                <button type="submit">Login</button>
                                <a className='Forgot' href="#"> Forgot Your Password</a>

                            </div>
                        </form>

                    </div>
                </div>
            </div>

            <div className="R_rightSection">
                <button onClick={(() => {
                    if (click === false) {
                        setClick(true)
                    }
                    else {
                        setClick(false)
                    }
                })}><img src={menu} alt="" /></button>

            </div>
        </div>
    )
}

export default Login