// EditEventForm.js
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";


function EditEventForm({ event, onSave, onCancel, onDelete }) {
    const [editingEvent, setEditingEvent] = useState(event);
    const [validationErrors, setValidationErrors] = useState([]);

    function handleEditEvent() {
    const errors = [];
    if (!editingEvent.title) {
        errors.push("Event must have a name");
    }
    if (!editingEvent.date) {
        errors.push("Event must have a date");
    }
    if (!editingEvent.location) {
        errors.push("Event must have a location");
    }
    if (!editingEvent.description) {
        errors.push("Event must have a description");
    }
    if (errors.length > 0) {
        setValidationErrors(errors);
        return;
    }

    axios
        .patch(`http://localhost:8000/api/events/${editingEvent._id}`, {
        title: editingEvent.title,
        date: editingEvent.date,
        location: editingEvent.location,
        description: editingEvent.description,
        type: editingEvent.type,
        })
        .then(() => {
        onSave(); // Notify parent component of successful update
        })
        .catch((error) => {
        console.error("Error updating event:", error);
        });
    }

    return (
    <div className="edit-event-form">
        <h2>Edit Event</h2>
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
        value={editingEvent.title}
        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
        />
        <DatePicker
        placeholderText="Event Date"
        selected={editingEvent.date}
        onChange={(date) => setEditingEvent({ ...editingEvent, date })}
        />
        <input
        type="text"
        placeholder="Event Location"
        value={editingEvent.location}
        onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
        />
        <input
        type="text"
        placeholder="Event Description"
        value={editingEvent.description}
        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
        />
        <button className="btn btn-outline-success" onClick={handleEditEvent}>
        Save
        </button>
        <button className="btn btn-outline-warning" onClick={onCancel}>
        Cancel
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
        Delete
        </button>
    </div>
    );
}

export default EditEventForm;
