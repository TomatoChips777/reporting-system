import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const hours = Array.from({ length: 9 }, (_, i) => `${8 + i}:00`);

// Sample event data
const eventPlans = [
  {
    title: "Some Event",
    name: "Event 101",
    date: "2025-04-12",
    startTime: "9:00",
    endTime: "9:30",
    color: "#A0DAB5",
    equipments: [
      { name: "Laptop", quantity: 2 },
      { name: "Speaker", quantity: 5 },
      { name: "Projector", quantity: 1 }
    ]
  },
  {
    title: "Another Event",
    name: "Event 102",
    date: "2025-04-18",
    startTime: "10:00",
    endTime: "11:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Another Event",
    name: "Event 109",
    date: "2025-04-18",
    startTime: "12:00",
    endTime: "1:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Same event conflict",
    name: "Event 109",
    date: "2025-04-18",
    startTime: "12:00",
    endTime: "1:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Another Event",
    name: "Event 102",
    date: "2025-04-18",
    startTime: "10:00",
    endTime: "11:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Another Event",
    name: "Event 109",
    date: "2025-04-18",
    startTime: "12:00",
    endTime: "1:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Same event conflict",
    name: "Event 109",
    date: "2025-04-18",
    startTime: "12:00",
    endTime: "1:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Another Event",
    name: "Event 102",
    date: "2025-04-18",
    startTime: "10:00",
    endTime: "11:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Another Event",
    name: "Event 109",
    date: "2025-04-18",
    startTime: "12:00",
    endTime: "1:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Same event conflict",
    name: "Event 109",
    date: "2025-04-18",
    startTime: "12:00",
    endTime: "1:00",
    color: "#FFBB33",
    equipments: [
      { name: "Microphone", quantity: 3 }
    ]
  },
  {
    title: "Some Event",
    name: "Event 101",
    date: "2025-05-2",
    startTime: "9:00",
    endTime: "9:30",
    color: "#A0DAB5",
    equipments: [
      { name: "Laptop", quantity: 2 },
      { name: "Speaker", quantity: 5 },
      { name: "Projector", quantity: 1 }
    ]
  },
  {
    title: "Some Event",
    name: "Event 101",
    date: "2025-04-30",
    startTime: "9:00",
    endTime: "9:30",
    color: 'red',
    equipments: [
      { name: "Laptop", quantity: 2 },
      { name: "Speaker", quantity: 5 },
      { name: "Projector", quantity: 1 }
    ]
  },
];

function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventDate, setNewEventDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Track the current month

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowViewModal(false);
  };

  // Function to get the days of the current month
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayOfMonth = date.getDay(); // Starting day of the month
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); // Last date of the month

    // Fill the grid with empty days (before the first day of the month)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add the actual days of the month
    for (let i = 1; i <= lastDateOfMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth.getMonth() + 1;
    const nextMonthDate = new Date(currentMonth.getFullYear(), nextMonth, 1);
    setCurrentMonth(nextMonthDate);
  };

  const handlePrevMonth = () => {
    const prevMonth = currentMonth.getMonth() - 1;
    const prevMonthDate = new Date(currentMonth.getFullYear(), prevMonth, 1);
    setCurrentMonth(prevMonthDate);
  };

  // Get the current month and year
  const currentMonthNumber = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();

  // Get the days in the current month
  const daysInMonth = getDaysInMonth(currentMonthNumber, currentYear);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Event Master Calendar</h2>
        <Button variant="dark" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-lg"></i> Create Event Plan
        </Button>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="light" onClick={handlePrevMonth}>
          <i className="bi bi-arrow-left-circle"></i> Previous Month
        </Button>
        <h4>{currentMonth.toLocaleString('default', { month: 'long' })} {currentYear}</h4>
        <Button variant="light" onClick={handleNextMonth}>
          Next Month <i className="bi bi-arrow-right-circle"></i>
        </Button>
      </div>

      <div className="calendar-grid d-flex flex-wrap border">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <div key={index} style={{ width: '14%' }} className="text-center py-2 border">
            <strong>{day}</strong>
          </div>
        ))}

        {daysInMonth.map((day, index) => {
          // Filter events for the current day
          const eventsForDay = eventPlans.filter(
            (event) =>
              new Date(event.date).getDate() === day &&
              new Date(event.date).getMonth() === currentMonthNumber
          );

          return (
            <div key={index} style={{ width: '14%', minHeight: '120px', height: 'auto' }} className="text-center border">
              {day ? (
                <div
                  className="calendar-day"
                  style={{
                    position: 'relative',
                    height: '100%',
                    padding: '10px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{day}</div>

                  <div
                    style={{
                      maxHeight: '180px', // Maximum height for events
                      overflowY: 'auto', // Enable vertical scrolling
                      paddingRight: '10px', // Optional padding for scrollbar
                    }}
                  >
                    {eventsForDay.map((event, idx) => (
                      <div
                        key={idx}
                        onClick={() => openModal(event)}
                        style={{
                          backgroundColor: event.color,
                          padding: '5px',
                          borderRadius: '5px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          marginBottom: '5px', // Spacing between events
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: '100%' }}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={closeModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p>Event Title: <strong>{selectedEvent.title}</strong></p>
              <p>Event Name: <strong>{selectedEvent.name}</strong></p>
              <p>Date of event: <strong>{selectedEvent.date} - {selectedEvent.startTime} - {selectedEvent.endTime}</strong></p>
              <h6>Equipment to use:</h6>
              <strong>
              <ul>
                {selectedEvent.equipments.map((eq, idx) => (
                  <li key={idx}>{eq.name} (x{eq.quantity})</li>
                ))}
              </ul>
              </strong>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Date</Form.Label>
              <div>
                <DatePicker
                  selected={newEventDate}
                  onChange={(date) => setNewEventDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                />
              </div>
            </Form.Group>

            {/* Add more fields if needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Events;