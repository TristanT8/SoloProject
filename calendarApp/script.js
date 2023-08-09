let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getCalendar() {
    const dateAndTime = new Date();
    
    const day = dateAndTime.getDate();
    const month = dateAndTime.getMonth();
    const year = dateAndTime.getFullYear();
    console.log(day, month, year);

    //To get how many days in the month
    const daysInMonth = new Date(year, month+1, 0).getDate();
    console.log(daysInMonth);
    const firstDayInMonth = new Date(year, month, 1);

    
}

getCalendar();