import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import DatePicker from "react-datepicker";
import axios from "axios";

function AddEventForm() {
    const navigate = useNavigate(); // Use the useNavigate hook
    const initialEvent = {
    title: "",
    date: null,
    location: "",
    description: "",
    type: "work",
    };
    const [newEvent, setNewEvent] = useState(initialEvent);
    const [validationErrors, setValidationErrors] = useState([]);

    function handleAddEvent() {
    const errors = [];
    if (!newEvent.title) {
        errors.push("Event name must be at least three characters");
    }
    if (!newEvent.date) {
        errors.push("Event must have a date");
    }
    if (!newEvent.location) {
        errors.push("Event must have a location");
    }
    if (!newEvent.description) {
        errors.push("Event description must be at least 5 characters");
    }
    if (errors.length > 0) {
        setValidationErrors(errors);
        return;
    }

    const eventToAdd = {
        title: newEvent.title,
        date: newEvent.date,
        location: newEvent.location,
        description: newEvent.description,
        type: newEvent.type,
    };

    axios
    .post("http://localhost:8000/api/events", eventToAdd)
    .then(() => {
        navigate("/"); // Navigate to the specified route
    })
    .catch((error) => {
        console.error("Error adding event:", error);
    });
}

return (
    <div className="add-event-form">
    <h2>Add New Event</h2>
    {validationErrors.length > 0 && (
        <div className="validation-errors">
        {validationErrors.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
            {error}
            </p>
        ))}
        </div>
    )}
    <input
        type="text"
        placeholder="Event Name"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
    />
    <DatePicker
        placeholderText="Event Date"
        selected={newEvent.date}
        onChange={(date) => setNewEvent({ ...newEvent, date })}
    />
    <input
        type="text"
        placeholder="Event Location"
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
    />
    <input
        type="text"
        placeholder="Event Description"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
    />
    <select
        value={newEvent.type}
        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
    >
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="fun">Fun</option>
        </select>
        <button className="btn btn-success" onClick={handleAddEvent}>
            Add Event
        </button>
    </div>
    );
}

export default AddEventForm;