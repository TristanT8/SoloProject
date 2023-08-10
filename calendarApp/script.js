let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getCalendar() {
    const dateAndTime = new Date();
    
    //This get the current date
    const day = dateAndTime.getDate();
    const month = dateAndTime.getMonth();
    const year = dateAndTime.getFullYear();
    console.log(day, month, year);

    //To get how many days in the month
    const daysInMonth = new Date(year, month+1, 0).getDate();
    console.log(daysInMonth);

    //This is to get the first day of the month to load, 'en-us' is just English calendar
    const firstDayInMonth = new Date(year, month, 1);
    const dateString = firstDayInMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
    console.log(dateString);
    //This line will populate the first week of the month correctly, the "split(', ')" gets us the days from the previous month so our calender doesn't populate those dates from previous month
    const daysInThisMonth = weekdays.indexOf(dateString.split(', ')[0]);
    console.log(daysInThisMonth);
}

getCalendar();