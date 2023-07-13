import React from 'react'
import jwt_decode from 'jwt-decode';
import './Login.css'
import './Registration.css'
import linkIcon1 from '../Images/Vector (3).png'
import linkIcon2 from '../Images/Vector (4).png'
import menu from '../Images/Menu.png'
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'
const Login = ({ onLogin }) => {

    const { useState } = React;
    const [employeeId, setEmployeeId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [click, setClick] = useState(false)
    const [logerr, setlogerr] = useState('')
    const [err, seterr] = useState(false)
    const closeLeftSide = () => {
        setClick(true)
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/mark-42/api/authentication/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'employee_id': employeeId, 'password': password }),
        });

        if (response.ok) {

            const { access: accessToken, refresh: refreshToken } = await response.json();
            const decodedToken = jwt_decode(accessToken);
            const role = decodedToken.role;
            onLogin(accessToken, refreshToken, role);
        } else {
            const msg = await response.json()
            seterr(true)
            setlogerr(msg.detail)
            console.log(logerr)

        }
    };




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
                        <form onSubmit={handleLogin} >
                            <label >
                                Employee Id
                                <input type="text" name="employeeId" value={employeeId} className={` dss ${err ? 'errInputColorChange' : ''}`}
                                    onChange={(e) => { setEmployeeId(e.target.value) }} required />

                            </label>

                            {/* <label >Username
                                <input type="text" name="userName" value={username}
                                    onChange={(e) => setUsername(e.target.value)} required />
                            </label> */}
                            <label>Password
                                <input required type="password"
                                    placeholder="Password"
                                    value={password}
                                    className={` dss ${err ? 'errInputColorChange' : ''}`}
                                    onChange={(e) => (setPassword(e.target.value), seterr(false))} name="password" />

                                {logerr ? (<><label style={{ color: 'red', padding: "10px 20px", opacity: '1', transition: 'opacity 0.3s' }}>{logerr}</label></>) : ''}
                            </label>
                            <div className="bottomPortion">
                                <button type="submit">Login</button>

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