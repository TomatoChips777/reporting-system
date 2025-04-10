import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import React, { useState } from 'react';

function Events() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDetails, setEventDetails] = useState({});
  const [showEventForm, setShowEventForm] = useState(false);

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days for the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const daysArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // Function to handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventForm(true); // Show event creation form
  };

  // Handle event form submission
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    const eventName = e.target.eventName.value;
    const itemsToPrepare = e.target.itemsToPrepare.value;

    // Save event details for the selected date
    setEventDetails({
      ...eventDetails,
      [selectedDate]: {
        eventName,
        itemsToPrepare,
      },
    });

    // Close the form after saving
    setShowEventForm(false);
  };

  // Render the calendar grid
  const renderCalendar = () => {
    const calendarDays = [];

    // Add empty cells before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div className="col empty-cell" key={`empty-${i}`} />);
    }

    // Add actual days of the month
    for (let i = 0; i < daysArray.length; i++) {
      calendarDays.push(
        <div
          key={i}
          className="col calendar-day d-flex justify-content-center align-items-center"
          onClick={() => handleDateClick(daysArray[i])}
        >
          {daysArray[i]}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Events</h1>
      
      {/* Calendar Grid */}
      <div className="mb-4">
        <div className="text-center">
          <h4>
            {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </h4>
        </div>
        <div className="row">
          {renderCalendar()}
        </div>
      </div>

      {/* Event Creation Form */}
      {showEventForm && (
        <div className="card p-4">
          <h2>Add Event for {selectedDate}</h2>
          <form onSubmit={handleSubmitEvent}>
            <div className="mb-3">
              <label htmlFor="eventName" className="form-label">
                Event Name
              </label>
              <input
                type="text"
                className="form-control"
                id="eventName"
                name="eventName"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="itemsToPrepare" className="form-label">
                Items to Prepare
              </label>
              <textarea
                className="form-control"
                id="itemsToPrepare"
                name="itemsToPrepare"
                rows="3"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Event
            </button>
          </form>
        </div>
      )}

      {/* Display Event Details for the selected date */}
      <h3 className="mt-4">Event Details</h3>
      {eventDetails[selectedDate] ? (
        <div className="card p-4">
          <p><strong>Event Name:</strong> {eventDetails[selectedDate].eventName}</p>
          <p><strong>Items to Prepare:</strong> {eventDetails[selectedDate].itemsToPrepare}</p>
        </div>
      ) : (
        <p>No event for this date.</p>
      )}
    </div>
  );
}

export default Events;
