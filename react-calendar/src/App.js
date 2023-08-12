import './App.css';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

const locales = {
  "en-us": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const initialEvent = {
  title: "",
  start: null,
  end: null
};

function App() {
  const [newEvent, setNewEvent] = useState(initialEvent);
  const [allEvents, setAllEvents] = useState([
    {
      id: 1,
      title: "Code Stuff",
      allDay: true,
      start: new Date(2023, 7, 8),
      end: new Date(2023, 7, 8)
    },
    {
      id: 2,
      title: "Code Bluff",
      start: new Date(2023, 7, 10),
      end: new Date(2023, 7, 13)
    },
    {
      id: 3,
      title: "Code Tough",
      allDay: true,
      start: new Date(2023, 7, 11),
      end: new Date(2023, 7, 11)
    },
  ]);
  const [editingEvent, setEditingEvent] = useState(null);

  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent]);
    setNewEvent(initialEvent);
  }

  function handleEventClick(event) {
    // Set the event to be edited when it's clicked
    setEditingEvent(event);
  }

  function handleEditEvent() {
    // Find the index of the editing event in the events list using the id property
    const eventIndex = allEvents.findIndex(e => e.id === editingEvent.id);
    if (eventIndex !== -1) {
      // Create a new array with the updated event
      const updatedEvents = [...allEvents];
      updatedEvents[eventIndex] = editingEvent;
      setAllEvents(updatedEvents);
      setEditingEvent(null); // Clear the editing event
    }
  }

  function handleDeleteEvent(event) {
    // Filter out the deleted event
    const updatedEvents = allEvents.filter(e => e !== event);
    setAllEvents(updatedEvents);
  }

  function handleCancelEdit() {
    // Clear the editing event
    setEditingEvent(null);
  }

  return (
    <div className="App">
      <h1>Calendar App</h1>
      <h3>Add New Event</h3>
      <div>
        <input
          type="text"
          placeholder='Event Name'
          style={{ width: "10%", marginRight: "10px" }}
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          placeholderText='Start Date'
          style={{ marginRight: "10px" }}
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
        />
        <DatePicker
          placeholderText='End Date'
          style={{ marginRight: "10px" }}
          selected={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })}
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "40px" }}
        onSelectEvent={handleEventClick} // Add event click handler
      />
      {editingEvent && (
        <div className="event-edit-form">
          <h3>Edit Event</h3>
          <div>
            <input
              type="text"
              placeholder='Event Name'
              style={{ width: "10%", marginRight: "10px" }}
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            />
            <DatePicker
              placeholderText='Start Date'
              style={{ marginRight: "10px" }}
              selected={editingEvent.start}
              onChange={(start) => setEditingEvent({ ...editingEvent, start })}
            />
            <DatePicker
              placeholderText='End Date'
              style={{ marginRight: "10px" }}
              selected={editingEvent.end}
              onChange={(end) => setEditingEvent({ ...editingEvent, end })}
            />
            <button onClick={handleEditEvent}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
            <button onClick={() => handleDeleteEvent(editingEvent)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
