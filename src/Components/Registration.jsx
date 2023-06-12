import React from 'react'
import './Registration.css'
import linkIcon1 from '../Images/Vector (3).png'
import linkIcon2 from '../Images/Vector (4).png'
import menu from '../Images/Menu.png'
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'
const Registration = () => {
    const { useState } = React;
    const [inputtext, setinputtext] = useState({
        email: "",
        password: ""
    });
    const [click, setClick] = useState(false)
    const closeLeftSide = () => {
        setClick(true)
    }


    const [warnemail, setwarnemail] = useState(false);
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
        setwarnemail(false);
        setwarnpassword(false);
        if (inputtext.email === "") {
            setwarnemail(true);
        }
        else if (inputtext.password === "") {
            setwarnpassword(true);
        }
        else {
            alert("form submitted");
            window.location.href = './Login'
            
        }

    }

    return (
        <div className='registration'>


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
                            <h3>Registration</h3>
                        </div>
                    </div>
                    <div className="registrationForms">
                        <form onSubmit={submitForm} action="/Login" method="post">
                            <label >
                                Employee Id
                                <input type="text" name="employeeId"  required />
                            </label>
                            <label >
                                First Name
                                <input type="text" name="firstName"  required />
                            </label>
                            <label >
                                last Name
                                <input type="text" name="lastName"  required />
                            </label>
                            <div className="dob_Mobile">
                                <label > Date OF Birth
                                    <input type="date" name="dob"  required />
                                </label>
                                <label > Mobile Number
                                    <input type="number" name="mobileNumber"  required />
                                </label>
                            </div>
                            <label >Email Id
                                <input type="email" className={` ${warnemail ? "warning" : ""}`} value={inputtext.email} onChange={inputEvent} name="email" required />
                                <i className="fa fa-envelope"></i>
                            </label>
                            <label>Gender
                                <select name="Gender" id="" required>
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Transgender">Transgender</option>
                                    <option value="Others">Others</option>
                                </select>
                            </label>
                            <label >Username
                                <input type="text" name="userName" id="" required />
                            </label>
                            <label>Password
                                <input required type="password" className={` ${warnpassword ? "warning" : ""}`}  value={inputtext.password} onChange={inputEvent} name="password" />
                             </label>
                            <button type="submit">Register</button>
                        </form>

                    </div>
                </div>
            </div>

            <div className="R_rightSection">
                <button onClick={(()=>{
                    if(click === false){
                        setClick(true)
                    }
                    else {
                        setClick(false)
                    }
                })}><img  src={menu} alt="" /></button>

            </div>
        </div>
    )
}


export default Registration;