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

const events = [
  {
    title: "Code Stuff",
    allDay: true,
    start: new Date(2023,7,8),
    end: new Date(2023,7,8)
  },
  {
    title: "Code Bluff",
    //allDay: true,
    start: new Date(2023,7,10),
    end: new Date(2023,7,13)
  },
  {
    title: "Code Tough",
    allDay: true,
    start: new Date(2023,7,11),
    end: new Date(2023,7,11)
  },
]

function App() {

  const [newEvent, setNewEvent] = useState({title: "", start: "", end: ""})
  const [allEvents, setAllEvents] = useState(events)

  //this is too add an event while adding the new one to the current events
  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent])
  }

  return (
    <div className="App">
      <h1>Calendar App</h1>
      <h3></h3>
      <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{height: 500, margin: "40px"}}/>
    </div>
  );
}

export default App;
