import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import MessageModal from '../../Messages/components/MessageModal';
import formatDate from '../../../functions/DateFormat';

function LostAndFoundViewModal({ showModal, setShowModal, selectedItem, claimData = [], fetchItems }) {
    const [showMessageInputModal, setShowMessageInputModal] = useState(false);
    const [updatedSelectedItem, setUpdatedSelectedItem] = useState(selectedItem);
    const [showConfirmReject, setShowConfirmReject] = useState(false);
    const [claimToReject, setClaimToReject] = useState(null);
    const [rejectMode, setRejectMode] = useState('request'); // or 'final'

    useEffect(() => {
        setUpdatedSelectedItem(selectedItem);
    }, [selectedItem]);

    const handleAcceptClaim = async (claim) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_ACCEPT_CLAIM_REQUEST}`,
                {
                    item_id: claim.item_id,
                    holder_id: claim.holder_id,
                    claimer_id: claim.claimer_id,
                    report_id: selectedItem.report_id,
                    location: selectedItem.location,
                    type: selectedItem.type,
                    item_name: selectedItem.item_name
                }
            );

            if (response.data.success) {
                setShowModal(false);
            } else {
            }
        } catch (error) {
            console.error('Error accepting claim:', error.response?.data || error.message);
        }
    };
    const handleConfirmReject = () => {
        if (!claimToReject) return;

        if (rejectMode === 'request') {
            handleRejectRequest(claimToReject);
        } else {
            handleRejectClaim(claimToReject);
        }

        setShowConfirmReject(false);
    };

    const handleRejectRequest = async (claim) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_REJECT_CLAIM_REQUEST}`,
                {
                    item_id: claim.item_id,
                    holder_id: claim.holder_id,
                    claimer_id: claim.claimer_id,
                    report_id: selectedItem.report_id,
                    location: selectedItem.location,
                    type: selectedItem.type,
                    item_name: selectedItem.item_name
                }
            );

            if (response.data.success) {
                setShowModal(false);
            } else {
            }
        } catch (error) {
            console.error('Error accepting claim:', error.response?.data || error.message);
        }
    };
    const handleRejectClaim = async (claim) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_REJECT_CLAIM}`,
                {
                    item_id: claim.item_id,
                    holder_id: claim.holder_id,
                    claimer_id: claim.claimer_id,
                    report_id: selectedItem.report_id,
                    location: selectedItem.location,
                    type: selectedItem.type,
                    item_name: selectedItem.item_name
                }
            );

            if (response.data.success) {
                setShowModal(false);
                fetchItems();
            } else {
            }
        } catch (error) {
            console.error('Error accepting claim:', error.response?.data || error.message);
        }
    };

    const handleMessage = (itemId, claimerId) => {
        const claim = claimData.find(claim => claim.item_id === itemId && claim.claimer_id === claimerId);
        if (claim) {
            const updatedItem = { ...selectedItem, user_id: claim.claimer_id };
            setUpdatedSelectedItem(updatedItem);
        }
        setShowMessageInputModal(true);
    };

    const handleRemarksChange = async (remarks) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_ADD_CLAIM_REMARKS}`,
                {
                    claim_id: selectedItem.claim_id,
                    remarks: remarks,
                    report_id: selectedItem.report_id
                }
            );

            if (response.data.success) {
                setUpdatedSelectedItem(prevItem => ({
                    ...prevItem,
                    remarks: remarks,
                }));
                fetchItems();
            } else {
            }
        } catch (error) {
            console.error('Error updating remarks:', error.response?.data || error.message);
        }
    };

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Item Details & {selectedItem?.type == 'found' ? 'Claim' : 'Return'} Requests</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem ? (
                        <>
                            <p><strong>Date Reported:</strong> {formatDate(selectedItem.created_at)}</p>
                            {selectedItem.claim_date && (
                                <p><strong>{selectedItem?.type == 'found' ? 'Claim' : 'Return'} On:</strong> {formatDate(selectedItem.claim_date)}</p>
                            )}
                            <p><strong>Reported By:</strong> {selectedItem.user_name}</p>
                            <p><strong>Location:</strong> {selectedItem.location}</p>
                            <p><strong>Type:</strong> {selectedItem.type.toUpperCase()}</p>
                            <p><strong>Description:</strong> {selectedItem.description}</p>
                            {selectedItem.image_path && (
                                <img
                                    src={`${import.meta.env.VITE_IMAGES}/${selectedItem.image_path}`}
                                    alt="Item"
                                    className="w-100 mb-3"
                                    style={{ maxHeight: '300px', objectFit: 'contain', borderRadius: '10px' }}
                                />
                            )}
                            <hr />
                            <h5>{selectedItem?.type == 'found' ? 'Claim' : 'Return'} Requests</h5>
                            {claimData.length > 0 ? (
                                <Table bordered hover>
                                    <thead>
                                        <tr>
                                            <th>{selectedItem?.type == 'found' ? 'Claimer' : 'Returner'} Name</th>
                                            <th>Message</th>
                                            <th>{selectedItem?.type == 'found' ? 'Claim' : 'Return'} On</th>
                                            <th className="text-center align-middle">Actions</th>
                                            {selectedItem.item_status === 'claimed' && (
                                                <th className="text-center align-middle">Remarks</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claimData
                                            .filter(claim => selectedItem.item_status !== 'claimed' || claim.status === 'accepted')
                                            .map((claim) => (
                                                <tr key={claim.id}>
                                                    <td>{claim.claimer_name}</td>
                                                    <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '300px' }}>
                                                        {claim.description}
                                                    </td>
                                                    <td>{formatDate(claim.created_at)}</td>
                                                    <td className="d-flex justify-content-center">
                                                        {claim.status !== 'accepted' && selectedItem.item_status !== 'claimed' ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-primary btn-sm rounded-0 mb-2 me-2 mb-sm-0"
                                                                    onClick={() => handleAcceptClaim(claim)}
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm rounded-0"
                                                                    // onClick={() => handleRejectRequest(claim)}
                                                                    onClick={() => {
                                                                        setClaimToReject(claim);
                                                                        setRejectMode('request');
                                                                        setShowConfirmReject(true);
                                                                    }}

                                                                >
                                                                    Reject
                                                                </button>

                                                                <button
                                                                    className="btn btn-success btn-sm rounded-0 mt-2 ms-2 mt-sm-0"
                                                                    onClick={() => handleMessage(claim.item_id, claim.claimer_id)}
                                                                >
                                                                    Message
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>

                                                                {updatedSelectedItem.remarks === 'unclaimed' && (
                                                                    <button
                                                                        className="btn btn-success btn-sm rounded-0 me-2 mt-sm-0"
                                                                        onClick={() => handleMessage(claim.item_id, claim.claimer_id)}
                                                                    >
                                                                        Message
                                                                    </button>
                                                                )}

                                                                <button
                                                                    className="btn btn-danger btn-sm rounded-0"
                                                                    // onClick={() => handleRejectClaim(claim)}
                                                                    onClick={() => {
                                                                        setClaimToReject(claim);
                                                                        setRejectMode('final');
                                                                        setShowConfirmReject(true);
                                                                    }}

                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                    {claim.status === 'accepted' && selectedItem.item_status === 'claimed' && (
                                                        <td className='justify-content-center'>
                                                            <>

                                                                <Form.Group>
                                                                    {/* Conditional Background Color Based on Remarks */}
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={updatedSelectedItem.remarks}
                                                                        onChange={(e) => handleRemarksChange(e.target.value)}
                                                                        className={`rounded-0 text-center text-white ${updatedSelectedItem.remarks === 'unclaimed' ? 'bg-danger' : 'bg-success'}`}
                                                                    >
                                                                        <option value="unclaimed">Unclaimed</option>
                                                                        <option value="claimed">Claimed</option>
                                                                    </Form.Control>
                                                                </Form.Group>
                                                            </>
                                                        </td>
                                                    )}

                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p>No claims found for this item.</p>
                            )}
                        </>
                    ) : (
                        <p>No item selected.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="rounded-0" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmReject} onHide={() => setShowConfirmReject(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Rejection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to reject this request?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmReject(false)} className="rounded-0">
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmReject} className="rounded-0">
                        Confirm Reject
                    </Button>
                </Modal.Footer>
            </Modal>

            <MessageModal
                show={showMessageInputModal}
                handleClose={() => setShowMessageInputModal(false)}
                existingItem={updatedSelectedItem}
                fetchItems={fetchItems}
            />
        </>
    );
}

export default LostAndFoundViewModal;
