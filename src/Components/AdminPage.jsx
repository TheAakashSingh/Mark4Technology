import React, { useEffect, useState } from 'react';
import menu from '../Images/Menu.png'
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'
import picMenu from '../Images/Vector (5).png'
import './AdminPage.css'
const AdminPage = ({ accessToken }) => {
    const [adminData, setAdminData] = useState(null);
    const [click, setClick] = useState(false)
    const closeLeftSide = () => {
        setClick(true)
    }
    const jsonData = [
        { id: 1, date:'May 26th 2023', LoginTime: '10:15 AM', AccesssAttempt:'Pass(Login Successsful)', Systemactivity:'uploaded Records...', LogoutTime:'12:20 PM', AccessAtempt2:'Pass(Logouut Successful' },
        { id: 2,date:'May 25th 2023', LoginTime: '10:15 AM', AccesssAttempt:'Pass(Login Successsful)', Systemactivity:'uploaded Records...', LogoutTime:'12:20 PM', AccessAtempt2:'Pass(Logouut Successful' },
        { id: 3,date:'May 24th 2023', LoginTime: '10:15 AM', AccesssAttempt:'Pass(Login Successsful)', Systemactivity:'uploaded Records...', LogoutTime:'12:20 PM', AccessAtempt2:'Pass(Logouut Successful' },
        { id: 4,date:'May 23th 2023', LoginTime: '10:15 AM', AccesssAttempt:'Pass(Login Successsful)', Systemactivity:'uploaded Records...', LogoutTime:'12:20 PM', AccessAtempt2:'Pass(Logouut Successful' },
        { id: 5,date:'May 22th 2023', LoginTime: '10:15 AM', AccesssAttempt:'Pass(Login Successsful)', Systemactivity:'uploaded Records...', LogoutTime:'12:20 PM', AccessAtempt2:'Pass(Logouut Successful' },
        // Add more items as needed
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
                    console.log(data)
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

    return (
        <div className="AdminPage">
            <div className="adminLeftSide">
                <div className="R_leftSection">
                    <div className={`regLoginLeft ${click ? 'regLeftBlock' : ''}`}>
                        <img id='close' onClick={closeLeftSide} src={close} alt="" />
                        <img src={logo} alt="" className="logo" />
                        <div className="adminbtns">
                            <button>ADMIN</button>
                            <button>MODERATOR</button>
                        </div>
                    </div>
                </div>
                <div className="adminMidSection">
                    <div className="adminTopsection">
                        <div className="adminTopsection_a">

                            <img src={picMenu} alt="" srcset="" />
                            <div className="admin_Profile_Name">
                                <span id='fname'>John Doe</span>
                                <span id='lname'>Admin</span>
                            </div>
                            <button onClick={(() => {
                                if (click === false) {
                                    setClick(true)
                                }
                                else {
                                    setClick(false)
                                }
                            })}><img src={menu} alt="" /></button>
                        </div>
                        <div className="adminTopsection_b">
                            <a href="">Select Moderator</a>
                            <button>Add Moderator</button>
                        </div>
                        <div className="adminTopsection_c">
                            <input type="search" name="search" id="srch" placeholder='Search' />
                            <select name="Role" id="roles" placeholder='Role'>
                                <option value="">Role</option>
                                <option value="x">x</option>
                                <option value="y">y</option>
                                <option value="z">z</option>
                                <option value="a">a</option>
                            </select>
                            <input type="search" name="searchUser" id="srchUser" placeholder='Search User' />
                        </div>
                        <div className="adminTopsection_d">
                            <button>Add</button>
                        </div>
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
