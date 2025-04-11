import { useState, useEffect } from "react";
import { Table, Card, Form, Button, Modal } from "react-bootstrap";
import { FaSearch, FaUser } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../../AuthContext";
import formatDate from "../../functions/DateFormat";

function UserManagement() {
    const { role } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [editRole, setEditRole] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/get-all-users`);
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

    const confirmDelete = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_CREATE_USER}`, newUser);
            if (response.data.success) {
                fetchUsers();
                setShowCreateModal(false);
                setNewUser({ name: "", email: "", password: "", role: "student" });
            } else {
                alert("Failed to create user.");
            }
        } catch (error) {
            console.error("Create user error:", error);
            alert("Error creating user.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_DELETE_USER}/${userToDelete}`);
            if (response.data.success) {
                setUsers(prev => prev.filter(u => u.id !== userToDelete));
                setShowDeleteModal(false);
                setUserToDelete(null);
            } else {
                alert("Delete failed.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Delete error.");
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_UPDATE_USER}/${userToEdit.id}`, {
                role: editRole
            });
            if (response.data.success) {
                fetchUsers(); // Refresh the list
                setShowEditModal(false);
            } else {
                alert("Failed to update user.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating user.");
        }
    };


    const openEditModal = (user) => {
        setUserToEdit(user);
        setEditRole(user.role);
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
                        <h5 className="mb-0"><FaUser className="me-2" />User Management</h5>
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
                                {['admin', 'report-manager', 'maintenance-report-manager', 'incident-report-manager', 'student'].map(r => (
                                    <option key={r} value={r}>
                                        {r.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </option>
                                ))}

                            </Form.Select>
                            {/* <Button variant="primary" className="rounded-0" onClick={() => setShowCreateModal(true)}>
                                + Create New User
                            </Button> */}
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
                                        <td>{user.role}</td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td className="d-flex justify-content-center">
                                            <Button variant="warning" size="sm" className="rounded-0 me-2" onClick={() => openEditModal(user)}>Edit</Button>
                                            <Button variant="danger" size="sm" className="rounded-0 me-2" onClick={() => confirmDelete(user.id)}>Delete</Button>
                                            {/* Add View/Edit button if needed */}
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
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {userToEdit && (
                        <div className="card shadow-sm rounded-0">
                            <div className="card-body text-center">
                                {/* <FaUser size={60} className="text-secondary mb-3" />
                                 */}
                                {userToEdit?.image_url && userToEdit.image_url.trim() !== "" ? (
                                    <img
                                        src={`${import.meta.env.VITE_IMAGES}/${userToEdit.image_url}`}
                                        width="60"
                                        height="60"
                                        className="rounded-circle"
                                        alt="User"
                                    />
                                ) : (
                                    // <BsPersonCircle size={60} className="text-secondary" />
                                    <FaUser size={60} className="text-secondary mb-3" />
                                )}
                                <h5 className="card-title mb-1">{userToEdit.name}</h5>
                                <p className="card-text text-muted mb-2">{userToEdit.email}</p>
                                <hr />
                                <div className="text-start">
                                    <p><strong>User ID:</strong> {userToEdit.id}</p>
                                    <p><strong>Date Created:</strong> {formatDate(userToEdit.created_at)}</p>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Role</strong></Form.Label>
                                        <Form.Select
                                            value={editRole}
                                            onChange={(e) => setEditRole(e.target.value)}
                                        >
                                            {['admin', 'report-manager', 'maintenance-report-manager', 'incident-report-manager', 'student'].map(r => (
                                                <option key={r} value={r}>
                                                    {r.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                </option>
                                            ))}

                                        </Form.Select>
                                    </Form.Group>
                                </div>
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
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </Form.Group> */}
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                {['admin', 'report-manager', 'maintenance-report-manager', 'incident-report-manager', 'student'].map(role => (
                                    <option key={role} value={role}>{role}</option>
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
