import React, { useEffect, useRef, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import close from '../Images/Close.png'
import logo from '../Images/Logo.png'
import picMenu from '../Images/Vector (5).png'
import './UserPage.css'
const UserPage = ({ refreshToken, onLogout }) => {
    const [first_name, setfirst_name] = useState('')
    const [last_name, setlast_name] = useState('')
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loggedData, setLoggedData] = useState('')
    const [number, setNumber] = useState('')
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [city, setCity] = useState('')
    const [dob, setDob] = useState('')
    const [tableData, settableData] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('')
    const [uploadedFile, setUploadedFile] = useState(null);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [isVisiblepopup, setIsVisiblepopup] = useState(false);
    const [LastRowID, setLastRowID] = useState(false);
    const [FileErrorMessage, setFileErrorMessage] = useState('')
    const [filterErr, setFilterErr] = useState('')

    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');


    const popupRef = useRef(null);

    useEffect(() => {
        const decodedToken = jwt_decode(accessToken);
        setLoggedData(decodedToken);
        if (!isVisiblepopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisiblepopup]);

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            alert('Please close the upload box');
        }
    };
    const [click, setClick] = useState(false);
    const closeLeftSide = () => {
        setClick(true);
    };
    const handleEditClick = (rowId) => {

        if (tableData && tableData.data) {
            const row = tableData.data.find((row) => row.row_id === rowId);
            if (row) {
                setEditingRowId(rowId);
                setEditedData(row);
            }
        }
    };

    const handleSaveClick = async () => {
        try {
            const response = await fetch(`http://localhost:8000/mark-42/api/data-management/edit-data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                console.log('Data saved successfully');
            } else {
                console.error('Error saving data:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }

        setEditingRowId(null);
        setEditedData({});
    };

    const handleCancelClick = () => {
        setEditingRowId(null);
        setEditedData({});
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
        }
        setUploadedFile(file);
    };

    const handleReset = () => {
        setfirst_name('')
        setlast_name('')
        setEmail('');
        setNumber('');
        setAddress('');
        setPincode('');
        setCity('');
    };

    const handleImport = async (e) => {
        if (uploadedFile) {
            const formData = new FormData();
            formData.append('file', uploadedFile);


            try {
                const response = await fetch('http://localhost:8000/mark-42/api/data-management/upload-data', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    console.log('Data imported successfully:');
                    setIsVisible(true)
                    const timeout = setTimeout(() => {
                        setIsVisible(false);
                    }, 2000);



                } else {
                    const ErrorMessage = await response.json()
                    setFileErrorMessage(ErrorMessage)
                    console.log(FileErrorMessage)
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
        onLogout();
      };

    const handleFilter = async (e) => {
        e.preventDefault();
        console.log("filtered clicked");

        const filters = {
        };

        if (first_name) {
            filters.first_name = first_name;
        }
        if (last_name) {
            filters.last_name = last_name;
        }
        if (email) {
            filters.email = email;
        }
        if (number) {
            filters.number = number;
        }
        if (address) {
            filters.address = address;
        }
        if (pincode) {
            filters.pincode = pincode;
        }
        if (city) {
            filters.city = city;
        }
        if (dob) {
            filters.dob = dob;
        }

        const filterParams = new URLSearchParams(filters).toString();

        try {
            const response = await fetch(`http://localhost:8000/mark-42/api/data-management/view-data?${filterParams}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },

            });

            if (response.ok) {
                const tableData = await response.json();
                console.log(tableData.data.length)
                if (tableData.data.length === 0) {

                    setFilterErr("No Data Found")
                }
                else {
                    setFilterErr(null)
                }
                settableData(tableData);
            } else {
                console.error('Error fetching user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };




    useEffect(() => {
        const fetchtableData = async () => {
            try {
                const response = await fetch('http://localhost:8000/mark-42/api/data-management/view-data', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const decodedToken = jwt_decode(accessToken);
                    setLoggedData(decodedToken);
                    console.log(data);
                    settableData(data);
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
                        fetchtableData();
                    } else {
                        handleLogout();
                    }
                } else {
                    navigate('/');
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchtableData();
    }, [accessToken]);

    const handlePageChange = async () => {
        try {
            const lastRowId = tableData.data[tableData.data.length - 1].row_id;
            console.log(lastRowId)
            setLastRowID(lastRowId)

            const url = `http://localhost:8000/mark-42/api/data-management/view-data?row_id=${lastRowId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }

            });

            if (response.ok) {
                const newData = await response.json();
                console.log("paging")
                console.log(newData); // Check the response data
                const updatedData = {
                    ...tableData,
                    data: [...tableData.data, ...newData.data],
                };
                settableData(updatedData);
            } else {
                console.error('Error fetching user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };



    return (
        <div className='UserPage'>
            <div className="userLeftSide">
                <div className="R_leftSection" style={{ height: 'initial' }}>
                    <div className={`regLoginLeft ${click ? 'regLeftBlock' : ''}`}>
                        <img id='close' onClick={closeLeftSide} src={close} alt="" />
                        <img src={logo} alt="" className="logo" />
                        <div className="userFilterSection">
                            <span>Filter By:</span>
                            <form onSubmit={handleFilter}>
                                <label>First Name</label>
                                <input type="text" name="first_name" value={first_name} onChange={(e) => setfirst_name(e.target.value)} placeholder="Enter First Name" />
                                <label>Last Name</label>
                                <input type="text" name="last_name" value={last_name} onChange={(e) => setlast_name(e.target.value)} placeholder="Enter Last Name" />
                                <label>Email</label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email Id" />
                                <label>Mobile Number</label>
                                <input type="number" name="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter Number" />
                                <label>Address</label>
                                <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Your Address" />
                                <label>Date Of Birth</label>
                                <input type="date" name="dob" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Enter Date Of Birth" />
                                <label>City</label>
                                <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter City" />
                                <label>Pincode</label>
                                <input type="number" name="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter Pincode" />
                                <button type="submit">Apply Filter</button>
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
                                    <span id="fname">{loggedData && loggedData.first_name + " " + loggedData.last_name}</span>
                                    <span id="lname">{loggedData && loggedData.role}</span>
                                </div>
                            </div>
                            <div className="allLinks">
                                <ul>
                                    {loggedData && loggedData.role === 'admin' ? <li> <Link to="/manage-user">Manage User</Link> </li> : ''}
                                    {loggedData && loggedData.role === 'admin' ? <li onClick={() => navigate('/')}>Log</li> : ''}
                                    <button onClick={handleLogout}>Logout</button>
                                </ul>
                            </div>
                        </div>
                        <div className="userTopsection_c">
                            {loggedData && loggedData.role === "admin" ? <>
                                <button onClick={() => setIsVisiblepopup(true)}>Upload Data</button>
                                {isVisiblepopup && (
                                    <div className="popup" ref={popupRef}>
                                        <img id='close' onClick={() => { setIsVisiblepopup(false) }} style={{ width: 'fit-content' }} src={close} alt="" />
                                        <label className="custom-file-input">
                                            <input
                                                className="input-file"
                                                type="file"
                                                name="file"
                                                accept=".xlsx, .xls"
                                                onChange={handleFileUpload}
                                            />
                                            Choose File
                                        </label>
                                        <span className="file-name-label">{selectedFileName}</span>
                                        <button className="upload-button" onClick={handleImport}>
                                            Upload
                                        </button>
                                        <span style={{ width: '17rem', color: 'red', padding: "10px 20px", opacity: '1', transition: 'opacity 0.3s' }}>{FileErrorMessage && FileErrorMessage.msg ? FileErrorMessage.msg : ''}</span>
                                        <span style={{ width: '17rem', color: 'red', padding: "10px 20px", opacity: '1', transition: 'opacity 0.3s' }}>
                                            {FileErrorMessage && FileErrorMessage.message ? FileErrorMessage.message + "-->" + FileErrorMessage.missing_columns : ''}</span>
                                        <div className={`snackbar ${isVisible ? 'visible' : ''}`}>
                                            <span>File Uploaded successfully...</span>
                                        </div>
                                    </div>
                                )}
                            </> : ''}

                            <label > Showing Results {LastRowID ? LastRowID : "50"}</label>

                        </div>
                    </div>
                    <div className="userBottomsection">
                        <table>
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Address</th>
                                    <th>Mobile No</th>
                                    <th>Email ID</th>
                                    <th>City</th>
                                    <th>Pincode</th>
                                    <th>Order Item</th>
                                    <th>Order Restaurant</th>
                                    <th>Date of Birth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData && tableData.data.map((row) => (
                                    <tr key={row.row_id}>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.first_name || ''} onChange={(e) => setEditedData({ ...editedData, first_name: e.target.value })} /> : row.first_name}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.last_name || ''} onChange={(e) => setEditedData({ ...editedData, last_name: e.target.value })} /> : row.last_name}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.address || ''} onChange={(e) => setEditedData({ ...editedData, address: e.target.value })} /> : row.address}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.mobile_no || ''} onChange={(e) => setEditedData({ ...editedData, mobile_no: e.target.value })} /> : row.mobile_no}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.email_id || ''} onChange={(e) => setEditedData({ ...editedData, email_id: e.target.value })} /> : row.email_id}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.city || ''} onChange={(e) => setEditedData({ ...editedData, city: e.target.value })} /> : row.city}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.pincode || ''} onChange={(e) => setEditedData({ ...editedData, pincode: e.target.value })} /> : row.pincode}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.order_item || ''} onChange={(e) => setEditedData({ ...editedData, order_item: e.target.value })} /> : row.order_item}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.order_restaurant || ''} onChange={(e) => setEditedData({ ...editedData, order_restaurant: e.target.value })} /> : row.order_restaurant}</td>
                                        <td>{editingRowId === row.row_id ? <input type="text" value={editedData.date_of_birth || ''} onChange={(e) => setEditedData({ ...editedData, date_of_birth: e.target.value })} /> : row.date_of_birth}</td>
                                        {loggedData && loggedData.role === 'admin' ? <td>
                                            {editingRowId === row.row_id ? (
                                                <>
                                                    <button onClick={handleSaveClick}>Save</button>
                                                    <button onClick={handleCancelClick}>Cancel</button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleEditClick(row.row_id)}>Edit</button>
                                            )}
                                        </td> : ''}
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                        {filterErr}
                        <div id="pagination">

                            <button onClick={handlePageChange} >Next</button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default UserPage;
