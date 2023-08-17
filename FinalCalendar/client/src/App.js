import './App.css';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios"; // Import axios for API calls

const locales = {
  "en-us": require("date-fns/locale/en-US")
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const initialEvent = {
  title: "",
  date: null,
  location: "",
  description: "",
  type: "work",
};



function App() {
  const [newEvent, setNewEvent] = useState(initialEvent);
  const [allEvents, setAllEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [createValidationErrors, setCreateValidationErrors] = useState([]);
  const [editValidationErrors, setEditValidationErrors] = useState([]);
  


  function getBackgroundColorByEventType(eventType) {
    switch (eventType) {
      case "work":
        return "#FF5733";  // Red
      case "personal":
        return "#6CA6FF";  // Blue
      case "fun":
        return "#00CC00";  // Green
      case "school":
        return "#A070A0"; // Purple
      default:
        return "#D3D3D3";  // Default gray
    }
  }
  const eventTypeLegend = {
    work: { label: 'Work', color: '#FF5733' },   // Red
    personal: { label: 'Personal', color: '#6CA6FF' },   // Blue
    fun: { label: 'Fun', color: '#00CC00' },   // Green
    school: { label: 'School', color: '#A070A0' },   // Purple
  };
  function EventLegend({ eventType }) {
    const legendItem = eventTypeLegend[eventType];
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
        <span style={{ width: '15px', height: '15px', backgroundColor: legendItem.color, marginRight: '5px' }}></span>
        {legendItem.label}
      </div>
    );
  }
  
  
  

// Inside the useEffect where you fetch the events
useEffect(() => {
  axios.get("http://localhost:8000/api/events")
    .then((response) => {
      console.log("Fetched events:", response.data);
      // Map the events to the format expected by react-big-calendar
      const mappedEvents = response.data.map(event => ({
        title: event.title,
        start: new Date(event.date), // Use "start" instead of "date"
        end: new Date(event.date), 
        location: event.location,
        description: event.description,
        type: event.type,
        _id: event._id
      }));
      setAllEvents(mappedEvents);
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
}, []);


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
    setCreateValidationErrors(errors);
    return;
  }
  // Create a new event with description
  const eventToAdd = {
    title: newEvent.title,
    date: newEvent.date,
    location: newEvent.location,
    description: newEvent.description,
    type: newEvent.type
  };

  console.log("Event to be added:", eventToAdd);

  // Save the event to the database
  axios
    .post("http://localhost:8000/api/events", eventToAdd)
    .then((response) => {
      console.log("API response after adding event:", response.data);
      // Event successfully added to the database
      // Fetch the updated events from the server
      axios
        .get("http://localhost:8000/api/events")
        .then((response) => {
          const updatedEvents = response.data.map((event) => ({
            title: event.title,
            start: new Date(event.date),
            end: new Date(event.date),
            location: event.location,
            description: event.description,
            _id: event._id,
            type: event.type
          }));
          setAllEvents(updatedEvents);
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching updated events:", error);
        });
      setNewEvent(initialEvent);
      setCreateValidationErrors([]); // Clear validation errors
    })
    .catch((error) => {
      // Handle error
        console.error("Error adding event:", error);
    });
}
  function handleEventClick(event) {
    // Set the event to be edited when it's clicked
    setEditingEvent(event);
  }
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
      setEditValidationErrors(errors);
      return;
    }
    if (editingEvent) {
      // Update the existing event in the database
      axios
        .patch(`http://localhost:8000/api/events/${editingEvent._id}`, {
          title: editingEvent.title,
          date: editingEvent.date,
          location: editingEvent.location,
          description: editingEvent.description,
          type: editingEvent.type,
        })
        .then(() => {
          axios
            .get("http://localhost:8000/api/events")
            .then((response) => {
              const updatedEvents = response.data.map((event) => ({
                title: event.title,
                start: new Date(event.date),
                end: new Date(event.date),
                location: event.location,
                description: event.description,
                type: event.type,
                _id: event._id,
              }));
              setAllEvents(updatedEvents);
              setEditingEvent(null); // Clear the editing event
              setEditValidationErrors([]); // Clear validation errors
            })
            .catch((error) => {
              // Handle error
              console.error("Error fetching updated events:", error);
            });
        })
        .catch((error) => {
          // Handle error
          console.error("Error updating event:", error);
        });
    }
  }
  

  function handleDeleteEvent(event) {
    if (event) {
      console.log("Deleting event with ID:", event._id);
      // Delete the event from the database
      axios
        .delete(`http://localhost:8000/api/events/${editingEvent._id}`)
        .then(() => {
          // Fetch the updated events from the server
          axios
            .get("http://localhost:8000/api/events")
            .then((response) => {
              const updatedEvents = response.data.map((event) => ({
                title: event.title,
                start: new Date(event.date),
                end: new Date(event.date),
                location: event.location,
                description: event.description,
                type: event.type,
                _id: event._id,
              }));
              setAllEvents(updatedEvents);
              setEditingEvent(null); // Clear the editing event
            })
            .catch((error) => {
              // Handle error
              console.error("Error fetching updated events:", error);
            });
        })
        .catch((error) => {
          // Handle error
          console.error("Error deleting event:", error);
        });
    }
  }

  function handleCancelEdit() {
    // Clear the editing event
    setEditingEvent(null);
  }

  return (
    <div className="App">
      <h1>ScheduLife</h1>
      <h3>Add New Event</h3>
      <div>
      {createValidationErrors.length > 0 && (
        <div className="validation-errors">
          {createValidationErrors.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {error}
            </p>
          ))}
        </div>
      )}
        <input
          type="text"
          placeholder='Event Name'
          style={{ width: "10%", marginRight: "10px" }}
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <div className="date-picker-overlay">
        <DatePicker 
          placeholderText='Event Date'
          style={{ marginRight: "10px" }}
          selected={newEvent.date}
          onChange={(date) => setNewEvent({ ...newEvent, date })}
          />
        </div>
          <input
            type="text"
            placeholder='Event Location'
            style={{ width: "20%", marginRight: "10px" }}
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
        <input
          type="text"
          placeholder='Event Description'
          style={{ width: "20%", marginRight: "10px" }}
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        <select
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          >
          <option value="work">Work -- Orange</option>
          <option value="personal">Personal -- Blue</option>
          <option value="fun">Fun -- Green</option>
          <option value="school">School -- Purple</option>
        </select>
        <button className="btn btn-success" onClick={handleAddEvent}>Add Event</button>
      </div>

      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "60px" }}
        onSelectEvent={handleEventClick}
        eventPropGetter={(event) => {
          const backgroundColor = getBackgroundColorByEventType(event.type);
          return { style: { backgroundColor } };
        }}
          components={{
            event: (props) => (
              <div>
                {eventTypeLegend[props.event.type] && (
                  <EventLegend eventType={props.event.type} />
                )}
                {props.title}
              </div>
            ),
          }}
      />

        {editingEvent && (
          <div className="event-edit-form">
            <h3>Edit Event</h3>
            <div>
              {editValidationErrors.length > 0 && (
                <div className="validation-errors">
                  {editValidationErrors.map((error, index) => (
                    <p key={index} style={{ color: "red" }}>
                      {error}
                    </p>
                  ))}
                </div>
              )}
            <input
              type="text"
              placeholder='Event Name'
              style={{ width: "10%", marginRight: "10px" }}
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            />
            <div className="date-picker-overlay">
            <DatePicker
              placeholderText='Event Date'
              style={{ marginRight: "10px" }}
              selected={editingEvent.date}
              onChange={(date) => setEditingEvent({ ...editingEvent, date })}
            />
            </div>
              <input
                type="text"
                placeholder='Event Location'
                style={{ width: "20%", marginRight: "10px" }}
                value={editingEvent.location}
                onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
              />
            <input
              type="text"
              placeholder='Event Description'
              style={{ width: "20%", marginRight: "10px" }}
              value={editingEvent.description}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            />
            <select
              value={editingEvent.type}
              onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
            >
              <option value="work">Work -- Orange</option>
              <option value="personal">Personal -- Blue</option>
              <option value="fun">Fun -- Green</option>
              <option value="school">School -- Purple</option>
            </select>

            <button className="btn btn-outline-success" onClick={handleEditEvent}>Save</button>
            <button className="btn btn-outline-warning" onClick={handleCancelEdit}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this event?")) {
                  handleDeleteEvent(editingEvent._id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import EditEventForm from "./components/EditEventForm";
// import CalendarView from "./components/CalendarView";
// import AddEventForm from "./components/AddEventForm";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<CalendarView />} />
//           <Route path="/add-event" element={<AddEventForm />} />
//           {/* Define a dynamic route for editing an event */}
//           <Route path="/edit-event/:id" element={<EditEventForm />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
