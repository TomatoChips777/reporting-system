import { Modal, Button, Table } from "react-bootstrap";

function ClaimListModal({ show, onHide, claimData = [] }) {
    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Claim Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {claimData.length > 0 ? (
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Claimer Name</th>
                                <th>Status</th>
                                <th>Claimed On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claimData.map((claim) => (
                                <tr key={claim.id}>
                                    <td>{claim.claimer_name}</td>
                                    <td>{claim.status}</td>
                                    <td>{new Date(claim.created_at).toLocaleString()}</td>
                                    <td><button className="btn btn-primary btn-sm rounded-0">Accept</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No claims found for this item.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ClaimListModal;
