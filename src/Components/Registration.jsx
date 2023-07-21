import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import linkIcon1 from '../Images/Vector (3).png';
import linkIcon2 from '../Images/Vector (4).png';
import menu from '../Images/Menu.png';
import close from '../Images/Close.png';
import logo from '../Images/Logo.png';
import './Registration.css';

const Registration = ({ accessToken, onLogout }) => {
    const [adminData, setAdminData] = useState();
    const [addErr, setaddErr] = useState('')
    const navigate = useNavigate();

    const [inputText, setInputText] = useState({
        email: '',
        password: '',
        role: '',
        first_name: '',
        last_name: '',
        employee_id: '',
        date_of_birth: '',
        phone_no: '',
        gender: '',
    });

    const [click, setClick] = useState(false);
    const closeLeftSide = () => {
        setClick(true);
    };

    const [warnFields, setWarnFields] = useState({
        email: false,
        password: false,
        role: false,
        first_name: false,
        last_name: false,
        employee_id: false,
        date_of_birth: false,
        phone_no: false,
        gender: false,
    });

    const inputEvent = (event) => {
        const name = event.target.name;
        let value = event.target.value;
        if (name === 'role') {
            value = parseInt(value);
        }
        setInputText((prevInputText) => ({
            ...prevInputText,
            [name]: value,
        }));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        let hasError = false;

        Object.keys(inputText).forEach((fieldName) => {
            if (inputText[fieldName] === '') {
                hasError = true;
                setWarnFields((prevWarnFields) => ({
                    ...prevWarnFields,
                    [fieldName]: true,
                }));
            } else {
                setWarnFields((prevWarnFields) => ({
                    ...prevWarnFields,
                    [fieldName]: false,
                }));
            }
        });

        if (hasError) {
            return; // Stop form submission if there are empty fields
        }

        try {
            const response = await fetch('http://localhost:8000/mark-42/api/user/manage-user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputText),
            });

            if (response.ok) {
                // const err = response.json()
                // setRegErr(err)
                alert('Registration successful');
                navigate('/manage-user');
            } else {
                alert('User already registered/Duplicate user');
                setaddErr(response.message)
                console.log(response)

            }
        } catch (error) {
            console.log(error);
            setaddErr(error.message)
            console.log(error)
            // alert('An error occurred during registration');
        }
    };

    useEffect(() => {
        const decodedToken = jwtDecode(accessToken);
        setAdminData(decodedToken);
    }, [accessToken]);

    return (
        <div className="registration">
            <div className="StartSection">
                <div className="R_leftSection">
                    <div className={`regLoginLeft ${click ? 'regLeftBlock' : ''}`}>\
                        <img src={logo} alt="" className="logo" />
                    </div>
                    <div className={`linksToPage ${click ? 'regLeftBlock' : ''}`}>
                        <ul>
                            <li>
                                <Link to="/userPage">Table Data</Link>
                            </li>
                            <li>
                                <Link to="/">Log</Link>
                            </li>
                        </ul>
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
                                <label><span>
                                    Employee Id <span class="text-danger">*</span></span>
                                    <input
                                        type="text"
                                        name="employee_id"
                                        value={inputText.employee_id}
                                        onChange={inputEvent}
                                        required
                                        className={warnFields.employee_id ? 'warning' : ''}
                                    />
                                </label>
                                <label><span>

                                    Employee Role <span class="text-danger">*</span>
                                </span>
                                    <select
                                        name="role"
                                        value={inputText.role}
                                        onChange={inputEvent}
                                        required
                                        className={warnFields.role ? 'warning' : ''}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="1">admin</option>
                                        <option value="3">user</option>
                                        <option value="2">moderator</option>
                                    </select>
                                </label>
                            </div>
                            <label><span>
                                First Name <span class="text-danger">*</span></span>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={inputText.first_name}
                                    onChange={inputEvent}
                                    required
                                    className={warnFields.first_name ? 'warning' : ''}
                                />
                            </label>
                            <label><span>
                                Last Name <span class="text-danger">*</span></span>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={inputText.last_name}
                                    onChange={inputEvent}
                                    required
                                    className={warnFields.last_name ? 'warning' : ''}
                                />
                            </label>
                            <div className="dob_Mobile">
                                <label><span>
                                    Date OF Birth <span class="text-danger">*</span></span>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={inputText.date_of_birth}
                                        onChange={inputEvent}
                                        required
                                        min="2010-01-02"
                                        className={warnFields.date_of_birth ? 'warning' : ''}
                                    />
                                </label>
                                <label><span>

                                    Mobile Number <span class="text-danger">*</span>
                                </span>
                                    <input
                                        type="number"
                                        name="phone_no"
                                        value={inputText.phone_no}
                                        onChange={inputEvent}
                                        required
                                        className={warnFields.phone_no ? 'warning' : ''}
                                    />
                                </label>
                            </div>
                            <label>
                                <span>
                                    Email Id <span class="text-danger">*</span></span>
                                <input
                                    type="email"
                                    name="email"
                                    value={inputText.email}
                                    onChange={inputEvent}
                                    required
                                    className={warnFields.email ? 'warning' : ''}
                                />
                                <i className="fa fa-envelope"></i>
                            </label>
                            <label>
                                <span>
                                    Gender <span class="text-danger">*</span>

                                </span>
                                <select
                                    name="gender"
                                    value={inputText.gender}
                                    onChange={inputEvent}
                                    required
                                    className={warnFields.gender ? 'warning' : ''}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </label>
                            <label>
                                <span>Password <span class="text-danger">*</span></span>
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    value={inputText.password}
                                    onChange={inputEvent}
                                    className={warnFields.password ? 'warning' : ''}
                                />
                            </label>
                            <button type="submit">Register</button>
                        </form>
                    </div>
                    {addErr && <>{addErr}</>}
                </div>
            </div>

        </div>
    );
};

export default Registration;
