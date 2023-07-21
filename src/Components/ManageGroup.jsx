import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './ManageGroup.css'
import linkIcon1 from '../Images/Vector (3).png';
import linkIcon2 from '../Images/Vector (4).png';
import logo from '../Images/Logo.png'
import picMenu from '../Images/Vector (5).png'
import jwtDecode from 'jwt-decode';
const { v4: uuidv4 } = require('uuid');
const ManageGroup = ({ refreshToken, onLogout }) => {
    const navigate = useNavigate();
    const [editBoxVisible, setEditBoxVisible] = useState(false);
    const [addBoxVisible, setaddBoxVisible] = useState(false);
    const [loggedData, setloggedData] = useState('')
    const [searchValue, setSearchValue] = useState('');
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [tableData, settableData] = useState([]);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
    const [inputText, setInputText] = useState({
        name: '',
        description: '',
        employee_id: ''
    });
    const [warnFields, setWarnFields] = useState({
        name: false,
        description: false,
        employee_id: false,
    });

    const inputEvent = (event) => {
        const name = event.target.name;
        let value = event.target.value;
        setInputText((prevInputText) => ({
            ...prevInputText,
            [name]: value,
        }));
    };
    useEffect(() => {
        const decodedToken = jwtDecode(accessToken);
        setloggedData(decodedToken);
    }, [accessToken])
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        const controller = new AbortController();
        controller.abort();
        onLogout();
        navigate('/');
    };

    useEffect(() => {
        const fetchtableData = async () => {
            try {
                const response = await fetch('http://localhost:8000/mark-42/api/user/manage-groups', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    settableData(data.data);
                } else if (response.status === 401) {
                    const refreshResponse = await fetch(
                        'http://localhost:8000/mark-42/api/authentication/refresh-access-token',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ accessToken: accessToken }),
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
                }
                else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };


        fetchtableData();


    }, [accessToken, refreshToken])

    const [click, setClick] = useState(false);
    const closeLeftSide = () => {
        setClick(true);
    };
    const handleEditClick = (uu_id) => {
        if (tableData) {
            const row = tableData.find((row) => row.uu_id === uu_id);
            if (row) {
                setEditingRowId(uu_id);
                setEditedData(row);
                setEditBoxVisible(true);
            }
        }
    };
    const handleAddVisible = () => {
        if (addBoxVisible === false) {
            setaddBoxVisible(true)
        }
        else { setaddBoxVisible(false) }
    }

    const handleSaveClick = async () => {
        try {
            const user_uuid = editingRowId
            const response = await fetch(`http://localhost:8000/mark-42/api/user/manage-groups/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                console.log('Data saved successfully');
                const updatedData = tableData.map(row => {
                    if (row.uu_id === user_uuid) {
                        return { ...row, ...editedData };
                    }
                    return row;
                });
                settableData(updatedData);
                setEditBoxVisible(false)
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
        setEditBoxVisible(false)
    };
    const handleDelete = async (uu_id) => {
        try {
            const response = await fetch(`http://localhost:8000/mark-42/api/user/manage-groups/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ uu_id }),
            });

            if (response.ok) {
                const updatedData = tableData.filter((row) => row.uu_id !== uu_id);
                settableData(updatedData);
                console.log('User deleted successfully');
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };


    const handleAddGroups = async (e) => {
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
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/mark-42/api/user/manage-groups/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputText),
            });

            if (response.ok) {
                // alert('Groups Add successful');
                setaddBoxVisible(false)

            }
            else {
                alert('Groups Add failed');
            }
        } catch (error) {
            console.log(error);
            alert('An error occurred during Groups Adding');
        }
    };

    return (
        <div className='ManageGroup'>
            <div className="MStartSection">
                <div className="R_leftSection">
                    <div className={`regLoginLeft `}>
                        <img src={logo} alt="" className="logo" />
                    </div>
                    <div className={`linksToPage `}>
                        <ul>
                            <li>
                                <Link to="/userPage">Table Data</Link>
                            </li>
                            <li>
                                <Link to="/">Log</Link>
                            </li>
                            <li>
                                <Link to="/Registration">Add User</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="M_midSection">
                    <div className="Manage_Profile_Name">
                        <img src={picMenu} alt="" srcSet="" />
                        <div className="profName">
                            <span id="fname">{loggedData && loggedData.first_name + " " + loggedData.last_name}</span>
                            <span id="lname">{loggedData && loggedData.role}</span>
                        </div>
                    </div>
                    <div className="heads_R">
                        <h3>Manage Group</h3>
                        <div className="searchManage">
                            <input
                                type="search"
                                name="srch"
                                id="srch"
                                placeholder="Search Group..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            /> <button type="submit">Search</button>
                            <button onClick={handleAddVisible}>Add</button>
                        </div>
                    </div>
                    <div className="userBottomsection M-buttom M2-buttom">
                        <table>
                            <thead>
                                <tr>
                                    <th>Groups Name</th>
                                    <th>Descriptions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData &&
                                    tableData
                                        .filter((row) => {
                                            const Name = `${row.name}`.toLowerCase();
                                            return Name.includes(searchValue.toLowerCase());
                                        }).map((row) => (
                                            <tr key={row.uu_id}>
                                                <td>{row.name}</td>
                                                <td>{row.description}</td>
                                                <td>
                                                    <button onClick={() => handleDelete(row.uu_id)}>Delete</button>

                                                </td>
                                                <td>
                                                    <button onClick={() => handleEditClick(row.uu_id)}>Edit</button>

                                                </td>



                                            </tr>

                                        ))}

                            </tbody>
                        </table>
                        {editBoxVisible && (
                            <div className="editBox">
                                <label htmlFor="">Group Name</label>
                                <input
                                    type="text"
                                    value={editedData.name || ''}
                                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                                />
                                <label htmlFor="">Description</label>
                                <input
                                    type="text"
                                    value={editedData.description || ''}
                                    onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                                />
                                <label htmlFor="">Employe_id</label>
                                <input
                                    type="text"
                                    value={editedData.created_by || ''}
                                    onChange={(e) => setEditedData({ ...editedData, created_by: e.target.value })}
                                />

                                {/* Add more input fields for other group data */}
                                <div className="editSaveButton">
                                    <button onClick={handleSaveClick}>Save</button>
                                    <button onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>
                        )}
                        {addBoxVisible && (<div className="groupsAddBox">
                            <input type="text" name='name'
                                value={inputText.name}
                                onChange={inputEvent}
                                required placeholder='Enter Name' />
                            <input type="text"
                                value={inputText.description}
                                onChange={inputEvent}
                                required
                                placeholder='description'
                                name='description' />
                            <input type="text"
                                value={inputText.employee_id}
                                onChange={inputEvent}
                                required
                                placeholder='employee_id'
                                name='employee_id' />

                            <button onClick={handleAddGroups}>Add Group</button>

                        </div>)}
                        {/* <div id="pagination">

                            <button onClick={handlePageChange} >Next</button>
                        </div> */}
                    </div>


                </div>
            </div>
        </div>
    )

}
export default ManageGroup