import { useState, useEffect } from "react";
import { Table, Card, Form, Button, Modal } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import formatDate from "../../functions/DateFormat";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "", password: "" });

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_FETCH_ALL_USERS}`);
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user => {
            const search = searchTerm.toLowerCase();
            return (
                (user.name.toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search)) &&
                (roleFilter === "" || user.role === roleFilter)
            );
        });
        setFilteredUsers(filtered);
    }, [searchTerm, roleFilter, users]);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleRoleFilter = (e) => setRoleFilter(e.target.value);

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const confirmActivateOrDeactivate = (userId, currentStatus) => {
        setUserToDelete({ id: userId, status: currentStatus });
        setShowDeleteModal(true);
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_ADD_USER}`, newUser);
            if (response.data.success) {
                fetchUsers();
                setShowCreateModal(false);
                setNewUser({ name: "", email: "", password: "", role: "user" });
            } else {
                alert("Failed to create user.");
            }
        } catch (error) {
            console.error("Create user error:", error);
            alert("Error creating user.");
        }
    };

    const handleDeactivate = async () => {
        const newStatus = userToDelete.status === 1 ? 0 : 1;

        try {
            const response = await axios.put(`${import.meta.env.VITE_ACTIVATE_DEACTIVATE_USER}/${userToDelete.id}`, {
                status: newStatus,
            });

            if (response.data.success) {
                setUsers(prev =>
                    prev.map(user =>
                        user.id === userToDelete.id ? { ...user, status: newStatus } : user
                    )
                );
                setShowDeleteModal(false);
                setUserToDelete(null);
            } else {
                alert("Status update failed.");
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert("Error updating user status.");
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_UPDATE_USER}/${selectedUser.id}`, {
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role
            });

            if (response.data.success) {
                fetchUsers();
                setShowEditModal(false);
            } else {
                alert("Failed to update user.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating user.");
        }
    };
    const openViewModal = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    }

    const openEditModal = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    }
    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

    return (
        <div className="container-fluid">
            <div className="card bg-success text-white mb-3">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <h5 className="mb-0"><FaUser className="me-2" size={70} />User Management</h5>
                        <div className="d-flex flex-wrap gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Search name or email..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="rounded-0"
                            />
                            <Form.Select value={roleFilter} onChange={handleRoleFilter} className="rounded-0">
                                <option value="">All Roles</option>
                                {['admin', 'report-manager', 'maintenance-report-manager','lost-and-found-manager', 'incident-report-manager', 'user'].map(r => (
                                    <option key={r} value={r}>
                                        {r.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </div>
            </div>
            <Card className="shadow-sm">
                <Card.Header className="bg-success text-white py-3 d-flex justify-content-between">
                    <strong>User List</strong>
                    <Button variant="light" size="sm" className="rounded-0" onClick={() => setShowCreateModal(true)} >+ Add user</Button>

                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table bordered hover className="mb-0">
                            <thead className="table-success">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="text-center">Status</th>
                                    <th>Date Created</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        {/* <td>{user.role.replace(/-/g, ' ').replace(/\b\w/, c => c.toUpperCase())}</td> */}
                                        <td className="text-center">{user.role.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>

                                        <td className="text-center">{user.status === 1 ? 'Active' : 'Inactive'}</td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td className="d-flex justify-content-center">

                                            <Button variant="info" size="sm" className="rounded-0 me-2" onClick={() => openViewModal(user)}>View</Button>
                                            <Button variant="warning" size="sm" className="rounded-0 " onClick={() => openEditModal(user)}>Edit</Button>
                                            <Button variant={user.status === 1 ? "danger" : "success"} size="sm" className="rounded-0 ms-2" onClick={() => confirmActivateOrDeactivate(user.id, user.status)}>{user.status === 1 ? 'Deactivate' : 'Activate'}</Button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between flex-wrap align-items-center">
                    <div className="d-flex align-items-center">
                        <Form.Select value={pageSize} onChange={handlePageSizeChange} className="me-2 rounded-0">
                            {[10, 20, 30, 40, 50].map(size => (
                                <option key={size} value={size}>{size} per page</option>
                            ))}
                        </Form.Select>
                        <span>{filteredUsers.length} users</span>
                    </div>
                    <nav>
                        <ul className="pagination mb-0 flex-wrap">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <Button variant="link" className="page-link rounded-0" onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
                            </li>
                            {Array.from({ length: Math.ceil(filteredUsers.length / pageSize) }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                                    <Button variant="link" className="page-link rounded-0" onClick={() => setCurrentPage(page)}>{page}</Button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === Math.ceil(filteredUsers.length / pageSize) ? "disabled" : ""}`}>
                                <Button variant="link" className="page-link rounded-0" onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
                            </li>
                        </ul>
                    </nav>
                </Card.Footer>
            </Card>
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm {userToDelete?.status === 1 ? 'Deactivate' : 'Activate'}</Modal.Title>
                </Modal.Header>
                {/* <Modal.Body>Are you sure you want to delete this user?</Modal.Body> */}
                <Modal.Body>
                    Are you sure you want to {userToDelete?.status === 1 ? 'deactivate' : 'activate'} this user?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant={userToDelete?.status === 1 ? "danger" : "success"} onClick={handleDeactivate}>{userToDelete?.status === 1 ? 'Deactivate' : 'Activate'}</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {selectedUser && (
                        <div className="card shadow-sm rounded-0">
                            <div className="card-body text-center">
                                {/* <FaUser size={60} className="text-secondary mb-3" />
                                 */}
                                {selectedUser?.image_url && selectedUser.image_url.trim() !== "" ? (
                                    <img
                                        src={`${import.meta.env.VITE_IMAGES}/${selectedUser.image_url}`}
                                        width="60"
                                        height="60"
                                        className="rounded-circle"
                                        alt="User"
                                    />
                                ) : (
                                    // <BsPersonCircle size={60} className="text-secondary" />
                                    <FaUser size={60} className="text-secondary mb-3" />
                                )}
                                <small className="text-sm d-block text-muted">{selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1).toLowerCase()}</small>
                                <h5 className="card-title mb-1">{selectedUser.name}</h5>
                                <p className="card-text text-muted mb-2">{selectedUser.email}</p>
                                <hr />
                                <div className="text-start">
                                    <p><strong>User ID:</strong> {selectedUser.id}</p>
                                    <p><strong>Role</strong> {selectedUser.role}</p>
                                    <p><strong>Created At:</strong> {formatDate(selectedUser.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                    {/* <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button> */}
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {selectedUser && (
                        <div className="card shadow-sm rounded-0">

                            <div className="card-body ">
                                <div className="text-center">
                                    {selectedUser?.image_url && selectedUser.image_url.trim() !== "" ? (
                                        <img
                                            src={`${import.meta.env.VITE_IMAGES}/${selectedUser.image_url}`}
                                            width="80"
                                            height="80"
                                            className="rounded-circle"
                                            alt="User"
                                        />
                                    ) : (
                                        <FaUser size={60} className="text-secondary mb-3" />
                                    )}
                                    <small className="text-sm d-block text-muted">{selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1).toLowerCase()}</small>
                                    <h5 className="card-title mb-1">{selectedUser.name}</h5>
                                    <p className="card-text text-muted mb-2">{selectedUser.email}</p>
                                    <hr />
                                </div>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedUser.name}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select
                                        value={selectedUser.role}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                    >
                                        {['admin', 'report-manager', 'maintenance-report-manager','lost-and-found-manager', 'incident-report-manager', 'user'].map(r => (
                                            <option key={r} value={r}>
                                                {r.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                {['admin', 'report-manager', 'maintenance-report-manager','lost-and-found-manager', 'incident-report-manager', 'user'].map(r => (
                                    <option key={r} value={r}>
                                        {r.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleCreateUser}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserManagement;
