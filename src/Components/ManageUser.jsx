import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './ManageUser.css'
import linkIcon1 from '../Images/Vector (3).png';
import linkIcon2 from '../Images/Vector (4).png';
import logo from '../Images/Logo.png';
import picMenu from '../Images/Vector (5).png'
import jwtDecode from 'jwt-decode';
const { v4: uuidv4 } = require('uuid');
const ManageUser = ({ refreshToken, onLogout }) => {
    const [loggedData, setloggedData] = useState('')
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [tableData, settableData] = useState([])

    const [existGroups, setexistGroups] = useState([])
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
    const navigate = useNavigate();
    useEffect(() => {
        const decodedToken = jwtDecode(accessToken);
        setloggedData(decodedToken);
    }, [accessToken])

    useEffect(() => {
        const fetchtableData = async () => {
            try {
                const response = await fetch('http://localhost:8000/mark-42/api/user/manage-user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
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
                        fetchtableData()
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

        handleGetGroups()

    }, [accessToken, refreshToken])

    const [click, setClick] = useState(false);
    const closeLeftSide = () => {
        setClick(true);
    };
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        const controller = new AbortController();
        controller.abort();
        onLogout();
        navigate('/');
    };

    const handleEditClick = (uu_id) => {
        if (tableData) {
            const row = tableData.find((row) => row.uu_id === uu_id);
            if (row) {
                const { groups, ...rowData } = row;
                setEditingRowId(uu_id);
                setEditedData({ ...rowData, groups: groups || '' });
            }
        }
    };



    const handleSaveClick = async () => {
        try {
            const user_uuid = editingRowId;
            const response = await fetch(`http://localhost:8000/mark-42/api/user/manage-user/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify( editedData
                    // "uu_id": editedData.uu_id,
                    // "email": editedData.email,
                    // "first_name": editedData.first_name,
                    // "last_name": editedData.last_name,
                    // "employee_id": editedData.employee_id,
                    // "role": editedData.role,
                    // "groups": editedData.groups
                ),
            });

            if (response.ok) {
                console.log('Data saved successfully');
                // Update the table data with the edited row
                const updatedData = tableData.map(row => {
                    if (row.uu_id === user_uuid) {
                        return { ...row, ...editedData };
                    }
                    return row;
                });
                settableData(updatedData);
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

    const handlePageChange = async () => {
        try {
            const lastRowId = tableData.data[tableData.data.length - 1].row_id;
            console.log(lastRowId)

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
    const handleDelete = async (uu_id) => {
        try {
            const user_uuid = uu_id;
            const response = await fetch(`http://localhost:8000/mark-42/api/user/manage-user/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ user_uuid }),
            });

            if (response.ok) {
                const updatedData = tableData.filter((row) => row.uu_id !== user_uuid);
                settableData(updatedData);
                console.log('User deleted successfully');
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    const handleGetGroups = async (e) => {
        try {
            const response = await fetch('http://localhost:8000/mark-42/api/user/manage-groups', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("grous ka dataas");
                console.log(data);
                setexistGroups(data);

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
        <div className="manageUser">
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
                            <li>
                                <Link to="/manage-group">Manage Group</Link>
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
                        <h3>Manage User</h3>
                        <div className="searchManage">
                            <input type="search" name="srch" id="srch" placeholder='Search User...' />
                            <button type="submit">Search</button>
                        </div>
                    </div>
                    <div className="userBottomsection M-buttom">
                        <table>
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Employee Id</th>
                                    <th>Role</th>
                                    <th>Group</th>
                                    <th>Email ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData && tableData.map((row) => (
                                    <tr key={row.uu_id}>
                                        <td>{editingRowId === row.uu_id ? <input type="text" value={editedData.first_name || ''} onChange={(e) => setEditedData({ ...editedData, first_name: e.target.value })} /> : row.first_name}</td>
                                        <td>{editingRowId === row.uu_id ? <input type="text" value={editedData.last_name || ''} onChange={(e) => setEditedData({ ...editedData, last_name: e.target.value })} /> : row.last_name}</td>
                                        <td>{editingRowId === row.uu_id ? <input type="text" value={editedData.employee_id || ''} onChange={(e) => setEditedData({ ...editedData, employee_id: e.target.value })} /> : row.employee_id}</td>
                                        <td>{editingRowId === row.uu_id ? <input type="text" value={editedData.role || ''} onChange={(e) => setEditedData({ ...editedData, role: e.target.value })} /> : row.role}</td>

                                        <td> {editingRowId === row.uu_id ? <select className='manageUserSelectClass' name="" id="" value={editedData.groups || ''} onChange={(e) => setEditedData({ ...editedData, groups: [...editedData.groups, e.target.value] })}>
                                            <option value="">Select groups</option>
                                            {existGroups && existGroups.data.map((key) => (
                                                <option key={key.name} value={key.name}>{key.name}</option>
                                            ))}
                                        </select>

                                            : row.groups}</td>

                                        <td>{editingRowId === row.uu_id ? <input type="text" value={editedData.email || ''} onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} /> : row.email}</td>
                                        <td>
                                            <button onClick={() => handleDelete(row.uu_id)}>Delete</button>


                                        </td>

                                        {loggedData && loggedData.role === 'admin' ? <td>
                                            {editingRowId === row.uu_id ? (
                                                <>
                                                    <button onClick={handleSaveClick}>Save</button>
                                                    <button onClick={handleCancelClick}>Cancel</button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleEditClick(row.uu_id)}>Edit</button>
                                            )}
                                        </td> : ''}
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                        {/* <div id="pagination">

                            <button onClick={handlePageChange} >Next</button>
                        </div> */}
                    </div>


                </div>
            </div>

        </div>
    )
}

export default ManageUser