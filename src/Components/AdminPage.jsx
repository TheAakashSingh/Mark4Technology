import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import menu from '../Images/Menu.png';
import close from '../Images/Close.png';
import logo from '../Images/Logo.png';
import picMenu from '../Images/Vector (5).png';
import './AdminPage.css';

const AdminPage = ({ accessToken, onLogout }) => {
    const [adminData, setAdminData] = useState(null);
    const [click, setClick] = useState(false);
    const navigate = useNavigate();

    const closeLeftSide = () => {
        setClick(true);
    };

    const jsonData = [
        {date:'21-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},
        {date:'20-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},
        {date:'19-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},
        {date:'18-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},
        {date:'17-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},
        {date:'16-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},
        {date:'15-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},
        {date:'14-06-2023',LoginTime: '12:24 A.M', AccesssAttempt:'Passed loading...', Systemactivity:"Successfully Data fetching", LogoutTime:'6:45 P.M', AccessAtempt2:"Passed Loading...."},

    ];

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/adminData', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setAdminData(data);
                } else {
                    console.error('Error fetching admin data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        fetchAdminData();
    }, [accessToken]);
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        const controller = new AbortController();
        const signal = controller.signal;
        controller.abort();
        onLogout();
        setAdminData(null);
        navigate('/');
    };

    const handleTablePageClick = () => {
        navigate(`/userPage?accessToken=${accessToken}`);
    };
    return (
        <div className="AdminPage">
            <div className="adminLeftSide">
                <div className="R_leftSection">
                    <div className={`regLoginLeft ${click ? 'regLeftBlock' : ''}`}>
                        <img id="close" onClick={closeLeftSide} src={close} alt="" />
                        <img src={logo} alt="" className="logo" />
                    </div>
                </div>
                <div className="adminMidSection">
                    <div className="adminTopsection">
                        <div className="adminTopsection_a">
                            <div className="admin_Profile_Name">
                                <img src={picMenu} alt="" srcSet="" />
                                <div className="profName">
                                    <span id="fname">{adminData && adminData.loggedInUserData.fname + adminData.loggedInUserData.lname}</span>
                                    <span id="lname">{adminData && adminData.loggedInUserData.role}</span>
                                </div>
                            </div>
                            <div className="allLinks">
                                <ul>
                                    {adminData && adminData.loggedInUserData.role==='admin'?<li> <Link to="/registration">Registration</Link> </li>:''}
                                    {adminData && adminData.loggedInUserData.role==='admin'?<li  onClick={handleTablePageClick}>Filter Data</li>:''}
                                    <li>Log</li>
                                    <button onClick={handleLogout}>Logout</button>
                                </ul>
                            </div>
                        </div>
                        <div className="adminTopsection_b">
                            <a href="">Select User</a>
                            {adminData && adminData.loggedInUserData.role==='admin' ? <button>Add</button>:"" }
                        </div>
                        <div className="adminTopsection_c">
                            <input type="search" name="search" id="srch" placeholder='Search' />
                            {adminData && adminData.loggedInUserData.role==='admin'?<select name="Role" id="roles" placeholder='Role'>
                                <option value="">Role</option>
                                <option value="x">x</option>
                                <option value="y">y</option>
                                <option value="z">z</option>
                                <option value="a">a</option>
                            </select>:''}
                            {adminData && adminData.loggedInUserData.role==='admin'?<input type="search" name="searchUser" id="srchUser" placeholder='Search User' />:''}
                        </div>
                        {adminData && adminData.loggedInUserData.role==='admin'?<div className="adminTopsection_d">
                            <button>Submit</button>
                        </div>:''}
                        <div className="adminTopsection_e">
                            <p>Moderator Name...</p>
                            <button>Delete</button>
                            <button>Disable</button>
                        </div>
                        <div className="adminTopsection_f">
                            <span>Logs</span>
                        </div>
                    </div>
                    <div className="adminBottomSection">
                        {jsonData.map((item) => (
                            <div className="adminBox">
                                <span className='admindate'>{item.date}</span>
                                <div className="line"></div>
                                <div className="dataOfAdmin">
                                    <div className="detailsLogin">
                                        <p>Login Time : {item.LoginTime}</p>
                                        <p>Access Attempt : {item.AccesssAttempt}</p>
                                    </div>
                                    <p>System activity : {item.Systemactivity}</p>
                                    <div className="detailsLogout">
                                        <p>Log Out Time : {item.LogoutTime}</p>
                                        <p>Access Attempt : {item.AccessAtempt2}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminPage;
