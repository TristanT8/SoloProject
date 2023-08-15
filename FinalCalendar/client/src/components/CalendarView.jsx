import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "react-big-calendar/lib/css/react-big-calendar.css";

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


function CalendarView() {
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
    axios.get("http://localhost:8000/api/events")
        .then((response) => {
        const mappedEvents = response.data.map(event => ({
            title: event.title,
            start: new Date(event.date),
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

function handleEventClick(event) {
    console.log("Clicked event ID:", event._id);
    // Redirect to the edit event form with the event's ID as a parameter
    // Use react-router-dom's Link component
    return (
        <Link to={`/edit-event/${event._id}`} state={{ event }}>
            Edit Event
        </Link>
    );
}

    return (
    <div className="calendar-view">
        <h2>Calendar View</h2>
        <h3>Add Event</h3>
        <Link to="/add-event">Add New Event</Link>
        <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "60px" }}
        onSelectEvent={handleEventClick}
        />
    </div>
    );
}

export default CalendarView;