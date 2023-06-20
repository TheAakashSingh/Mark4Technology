import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'
import picMenu from '../Images/Vector (5).png'
import './UserPage.css'
const UserPage = ({ accessToken, onLogout }) => {
    const [name, setName] = useState('');
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [city, setCity] = useState('')
    const [dob, setDob] = useState('')
    const [userData, setUserData] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [filteredUserData, setFilteredUserData] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);


    const [click, setClick] = useState(false);
    const closeLeftSide = () => {
        setClick(true);
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setUploadedFile(file);
    };

    const handleReset = () => {
        setName('');
        setEmail('');
        setNumber('');
        setAddress('');
        setPincode('');
        setCity('');
        setFilteredUserData(null);
    };
    const handleSearch = (searchValue) => {
        const filteredData = userData.allUserData.filter((user) => {
            const searchData = Object.values(user).join("").toLowerCase();
            return searchData.includes(searchValue.toLowerCase());
        });

        setFilteredUserData(filteredData.length > 0 ? filteredData : null);
    };
    const handleImport = async () => {
        if (uploadedFile) {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            try {
                const response = await fetch('http://localhost:5000/api/import', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Data imported successfully:', data);
                } else {
                    console.error('Error importing data:', response.statusText);
                }
            } catch (error) {
                console.error('Error importing data:', error);
            }
        } else {
            console.log('No file selected');
        }
    };

    const handleLogout = () => {
        const controller = new AbortController();

        controller.abort();
        onLogout();
        setUserData(null);
        navigate('/');
    };
    const handleEdit = (userId) => {
        setEditingUserId(userId);
    };

    const handleSave = async (userId) => {
        const userToEdit = userData.allUserData.find((user) => user.id === userId);

        if (userToEdit) {

            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        fname: userToEdit.fname,
                        lname: userToEdit.lname,
                        email: userToEdit.email,
                        number: userToEdit.number,
                        address: userToEdit.address,
                        pincode: userToEdit.pincode,
                        city: userToEdit.city,
                        dob: userToEdit.dob,
                    }),
                });

                if (response.ok) {
                    console.log(`User with ID ${userId} updated successfully`);
                } else {
                    console.error('Error updating user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }

        setEditingUserId(null);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const filteredUserData = userData.allUserData.filter((user) => {
            if (name && user.fname && user.fname.toLowerCase().includes(name.toLowerCase())) {
                return true;
            }
            if (email && user.email && user.email.toLowerCase().includes(email.toLowerCase())) {
                return true;
            }
            if (number && user.number && user.number.toLowerCase().includes(number.toLowerCase())) {
                return true;
            }
            if (address && user.address && user.address.toLowerCase().includes(address.toLowerCase())) {
                return true;
            }
            if (pincode && user.pincode && user.pincode.toLowerCase().includes(pincode.toLowerCase())) {
                return true;
            }
            if (city && user.city && user.city.toLowerCase().includes(city.toLowerCase())) {
                return true;
            }
            return false;
        });
        setFilteredUserData(filteredUserData);
    };
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
    }, [accessToken, uploadedFile]);
    useEffect(() => {
        if (userData && userData.isAdmin) {
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
                        console.log("admin")
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
        }
    }, [accessToken, userData]);

    return (
        <div className='UserPage'>
            <div className="userLeftSide">
                <div className="R_leftSection">
                    <div className={`regLoginLeft ${click ? 'regLeftBlock' : ''}`}>
                        <img id='close' onClick={closeLeftSide} src={close} alt="" />
                        <img src={logo} alt="" className="logo" />
                        <div className="userFilterSection">
                            <span>Filter By:</span>
                            <form action="" onSubmit={handleFilter}>
                                <label > Name</label>
                                <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name' />
                                <label > Email</label>
                                <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email Id' />
                                <label > Mobile Number</label>
                                <input type='number' name='number' value={number} onChange={(e) => setNumber(e.target.value)} placeholder='Enter Number' />
                                <label > Address</label>
                                <input type="text" name='address' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Your Address' />
                                <label > Date Of Birth</label>
                                <input type="date" name='dob' value={dob} onChange={(e) => setDob(e.target.value)} placeholder='Enter Date Of Birth' />
                                <label > City</label>
                                <input type="text" name='city' value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter City' />
                                <label > Pincode</label>
                                <input type="number" name='pincode' value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder='Enter Pincode' />
                                <button type='submit'>Apply Filter</button>
                                <button onClick={handleReset}>Reset</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="userMidSection">
                    <div className="userTopsection">
                        <div className="userTopsection_a">
                            <div className="user_Profile_Name">
                                <img src={picMenu} alt="" srcSet="" />
                                <div className="profName">
                                    <span id="fname">{userData && userData.loggedInUserData.fname + userData.loggedInUserData.lname}</span>
                                    <span id="lname">{userData && userData.loggedInUserData.role}</span>
                                </div>
                            </div>
                            <div className="allLinks">
                                <ul>
                                    {userData && userData.loggedInUserData.role === 'admin' ? <li> <Link to="/registration">Registration</Link> </li> : ''}
                                    {userData && userData.loggedInUserData.role === 'admin' ? <li onClick={() => navigate('/')}>Log</li> : ''}
                                    <button onClick={handleLogout}>Logout</button>
                                </ul>
                            </div>
                        </div>
                        <div className="userTopsection_c">
                            <button onClick={handleImport}>Import</button>
                            <input type="file" name="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

                            <input type="search" name="search" id="srch" placeholder='Search' onChange={(e) => handleSearch(e.target.value)} />
                            <label > Results</label>
                            <select name="Role" id="roles" placeholder='Role'>
                                <option value="">1</option>
                                <option value="x">10</option>
                                <option value="y">20</option>
                                <option value="z">30</option>
                                <option value="a">40</option>
                                <option value="a">50</option>
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
                                {userData && (filteredUserData || userData?.allUserData).map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.fname}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, fname: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.fname
                                            )}
                                        </td>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.lname}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, lname: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.lname
                                            )}
                                        </td>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.number}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, number: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.number
                                            )}
                                        </td>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.email}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, email: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.address}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, address: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.address
                                            )}
                                        </td>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.dob}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, dob: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.dob
                                            )}
                                        </td>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.city}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, city: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.city
                                            )}
                                        </td>
                                        <td>
                                            {editingUserId === user.id ? (
                                                <input
                                                    type="text"
                                                    value={user.pincode}
                                                    onChange={(e) =>
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            allUserData: prevData.allUserData.map((prevUser) =>
                                                                prevUser.id === user.id ? { ...prevUser, pincode: e.target.value } : prevUser
                                                            ),
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                user.pincode
                                            )}
                                        </td>

                                        {userData.loggedInUserData.role === 'admin' ? <td>
                                            {editingUserId === user.id ? (<>
                                                <button
                                                    className="save-button"
                                                    onClick={() => handleSave(user.id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="cancel-button"
                                                    onClick={() => setEditingUserId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                            ) : (
                                                <button
                                                    className="edit-button"
                                                    onClick={() => handleEdit(user.id)}
                                                >
                                                    Edit
                                                </button>)}
                                        </td> : ""}
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
