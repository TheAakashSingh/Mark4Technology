import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import close from '../Images/Close.png';
import logo from '../Images/Logo.png';
import picMenu from '../Images/Vector (5).png';
import './AdminPage.css';

const AdminPage = ({ refreshToken, onLogout }) => {
  const [loggedData, setLoggedData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [click, setClick] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const closeLeftSide = () => {
    setClick(true);
  };

  const searchEachLogs = () => {
    // Implement search logic here
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/mark-42/api/authentication/user-activity',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const decodedToken = jwt_decode(accessToken);
          setLoggedData(decodedToken);
          console.log(data);
          setAdminData(data);
        } else if (response.status === 401) {
          const refreshResponse = await fetch(
            'http://localhost:8000/mark-42/api/authentication/refresh-access-token',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: refreshToken }),
            }
          );

          if (refreshResponse.ok) {
            const { access: newAccessToken } = await refreshResponse.json();
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            fetchAdminData();
          } else {
            handleLogout();
          }
        } else {
          navigate('/');
          console.error('Error fetching admin data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, [accessToken, refreshToken]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    const controller = new AbortController();
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
                                    <span id="fname">{loggedData && loggedData.first_name + " " + loggedData.last_name}</span>
                                    <span id="lname">{loggedData && loggedData.role}</span>
                                </div>
                            </div>
                            <div className="allLinks">
                                <ul>
                                    {loggedData && loggedData.role === 'admin' ? <li> <Link to="/manage-user">Manage User</Link> </li> : ''}
                                    {loggedData && loggedData.role === 'admin' ? <li onClick={handleTablePageClick}>Filter Data</li> : ''}
                                    <li>Log</li>
                                    <button onClick={handleLogout}>Logout</button>
                                </ul>
                            </div>
                        </div>


                        <form method="GET" onSubmit={searchEachLogs}>
                            <div className="adminTopsection_c">
                                {loggedData && loggedData.role === 'admin' ? <div className="adminTopsection_d">
                                    <button type='submit' >Submit</button>
                                </div> : ''}

                                {loggedData && loggedData.role === 'admin' ? <input type="search" name="searchUser"  id="srchUser" placeholder='Search Empoyee ID' /> : ''}
                            </div>
                        </form>


                        <div className="adminTopsection_f">
                            <span>Logs</span>
                        </div>
                    </div>
                    <div className="adminBottomSection">
                        {adminData && adminData.data && Object.keys(adminData.data).map((adminKey) => (
                            <div className="adminBox" key={adminKey}>
                                <span className="admindate">{adminKey}</span>
                                {adminData.data[adminKey].map((item) => (
                                    <div key={item.time}>
                                        <div className="line"></div>
                                        <div className="dataOfAdmin">
                                            <div className="detailsLogin">
                                                <p>Time: {item.time}</p>
                                                <p>Status: {item.Status}</p>
                                            </div>
                                            <p>Activity: {item.Activity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminPage;
