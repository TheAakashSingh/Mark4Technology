import React from 'react'
import './Registration.css'
import linkIcon1 from '../Images/Vector (3).png'
import linkIcon2 from '../Images/Vector (4).png'
import { useNavigate } from 'react-router-dom';
import menu from '../Images/Menu.png'
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'
const Registration = () => {
    const navigate = useNavigate();
    const { useState } = React;
    const [inputtext, setinputtext] = useState({
        email: "",
        password: "",
        role:'',
        fname:'',
        lname:'',
        eid:'',
        dob:'',
        number:'',
        gender:'',
        username:'',
        password:''
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
    const submitForm = async (e) => {
        e.preventDefault();
        setwarnemail(false);
        setwarnpassword(false);
        if (inputtext.email === "") {
            setwarnemail(true);
        } else if (inputtext.password === "") {
            setwarnpassword(true);
        } else {
            try {
                const response = await fetch("http://localhost:5000/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputtext),
                });
                if (response.ok) {
                    alert("Registration successful");
                    navigate('/');
                } else {
                    alert("Registration failed");
                }
            } catch (error) {
                console.log(error);
                alert("An error occurred during registration");
            }
        }
    };



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
                            <div className="employeeIdRole">
                                <label >
                                    Employee Id
                                    <input type="text" name="eid" value={inputtext.id} onChange={inputEvent} required />
                                </label>
                                <label > Employee Role
                                    <select name="role" id="" style={{ height: '47px' }} value={inputtext.role} onChange={inputEvent}>
                                        <option value="admin">admin</option>
                                        <option value="user">user</option>
                                        <option value="moderator">moderator</option>
                                    </select>
                                </label>
                            </div>
                            <label >
                                First Name
                                <input type="text" name="fname" value={inputtext.fname} onChange={inputEvent} required />
                            </label>
                            <label >
                                last Name
                                <input type="text" name="lname" value={inputtext.lnamename} onChange={inputEvent} required />
                            </label>
                            <div className="dob_Mobile">
                                <label > Date OF Birth
                                    <input type="date" name="dob"value={inputtext.dob} onChange={inputEvent} required />
                                </label>
                                <label > Mobile Number
                                    <input type="number" name="number"value={inputtext.number} onChange={inputEvent} required />
                                </label>
                            </div>
                            <label >Email Id
                                <input type="email" className={` ${warnemail ? "warning" : ""}`} value={inputtext.email} onChange={inputEvent} name="email" required />
                                <i className="fa fa-envelope"></i>
                            </label>
                            <label>Gender
                                <select name="Gender" id="" value={inputtext.id} onChange={inputEvent} required>
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Transgender">Transgender</option>
                                    <option value="Others">Others</option>
                                </select>
                            </label>
                            <label >Username
                                <input type="text" name="username" value={inputtext.username} onChange={inputEvent}  required  id=""  />
                            </label>
                            <label>Password
                                <input required type="password" className={` ${warnpassword ? "warning" : ""}`} value={inputtext.password} onChange={inputEvent} name="password" />
                            </label>
                            <button type="submit">Register</button>
                        </form>

                    </div>
                </div>
            </div>

            <div className="R_rightSection">
                <button onClick={(() => {
                    navigate('/')
                })}><img src={menu} alt="" /></button>

            </div>
        </div>
    )
}


export default Registration;