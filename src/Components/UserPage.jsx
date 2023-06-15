import React, { useEffect, useState } from 'react';
import menu from '../Images/Menu.png'
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'

import picMenu from '../Images/Vector (5).png'
import './UserPage.css'
const UserPage = ({ accessToken }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [city, setCity] = useState('')
    const [dob, setDob] = useState('')
    const [userData, setUserData] = useState(null);
    const [click, setClick] = useState(false)
    const closeLeftSide = () => {
        setClick(true)
    }
    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/userData', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setUserData(data);
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [accessToken]);
    return (
        <div className='UserPage'>
            <div className="userLeftSide">
                <div className="R_leftSection">
                    <div className={`regLoginLeft ${click ? 'regLeftBlock' : ''}`}>
                        <img id='close' onClick={closeLeftSide} src={close} alt="" />
                        <img src={logo} alt="" className="logo" />
                        <div className="userFilterSection">
                            <span>Filter By:</span>
                            <form action="">
                                <label > Name</label>
                                <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name'/>
                                <label > Email</label>
                                <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email Id'/>
                                <label > Mobile Number</label>
                                <input type='number' name='number' value={number} onChange={(e) => setNumber(e.target.value)} placeholder='Enter Number'/>
                                <label > Address</label>
                                <input type="text" name='address' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Your Address'/>
                                <label > Date Of Birth</label>
                                <input type="date" name='dob' value={dob} onChange={(e) => setDob(e.target.value)} placeholder='Enter Date Of Birth'/>
                                <label > City</label>
                                <input type="text" name='city' value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter City'/>
                                <label > Pincode</label>
                                <input type="number" name='pincode' value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder='Enter Pincode'/>
                                <button>Reset</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="userMidSection">
                    <div className="userTopsection">
                        <div className="userTopsection_a">

                            <img src={picMenu} alt="" srcset="" />
                            <div className="user_Profile_Name">
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
                        <div className="userTopsection_c">
                            <input type="search" name="search" id="srch" placeholder='Search' />
                            <label > Results</label>
                            <select name="Role" id="roles" placeholder='Role'>
                                <option value="">Role</option>
                                <option value="x">x</option>
                                <option value="y">y</option>
                                <option value="z">z</option>
                                <option value="a">a</option>
                            </select>
                        </div>
                    </div>
                    <div className="userBottomsection">
                    <table>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Mobile Number</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>DOB</th>
                                <th>City</th>
                                <th>Pincode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData &&
                                userData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.mobileNumber}</td>
                                        <td>{item.email}</td>
                                        <td>{item.address}</td>
                                        <td>{item.dob}</td>
                                        <td>{item.city}</td>
                                        <td>{item.pincode}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                </div>

            </div>
        </div>
    );
};

export default UserPage;
