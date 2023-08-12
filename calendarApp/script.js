let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDropModal = document.getElementById('modalBackDrop');
const eventTitle = document.getElementById('eventTitle');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//This function will open the modal to create an event on the day that was clicked by the user
function openModal(date) {
    clicked = date;
    //e stands for event and we will run an if/else statement to see if there's an event for that day
    const eventForThatDay = events.find(e => e.date === clicked)
    //This is to prompt the user with creating an event if there isn't an event already created
    if (eventForThatDay) {  
        document.getElementById('eventText').innerText = eventForThatDay.title;
        updateEventModal.style.display = 'block';
    } else {
        newEventModal.style.display = 'block';
    }

    backDropModal.style.display = 'block';
}

function getCalendar() {
    const dateAndTime = new Date();

    //This is setting the month correctly where nav=0 is current month and all if nav is plue 2 it moves two months forwards etc.
    if (nav !== 0) {
        dateAndTime.setMonth(new Date().getMonth() + nav);
    }
    
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
    const falseDaysInThisMonth = weekdays.indexOf(dateString.split(', ')[0]);
    console.log(falseDaysInThisMonth);

    //This line is to display the date as a long and not a numeric to display in our header, we use string interpolation with backticks to send data into string
    document.getElementById('displayMonth').innerText = `${dateAndTime.toLocaleDateString('en-us', { month : 'long'})} ${year}`;

    //Setting the calendar to blank to wipe out the padding days and daysquares o adjust for the proper month
    calendar.innerHTML = '';

    //This for loop renders the empty squares for daysInThisMonth + the squares for the correct month
    for (let i = 1; i <= falseDaysInThisMonth + daysInMonth; i++) {
        //Createing a daySquare div and assign it to daySquare. Also adds classes to daySquare, "day"
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dateString = `${month + 1}/${i - falseDaysInThisMonth}/${year}`;

        //This if statement checks to see if we should render a blank square or a real square for the month
        if (i > falseDaysInThisMonth) {
            //This is so the days can populate with the correct date, i - falseDays is just excluding the padding days from the calendar
            daySquare.innerText = i - falseDaysInThisMonth;

            const eventForThatDay = events.find(e => e.date === dateString);

            //This is to hiughlight the current day we are on. Using a ternary to cull out the padding days and to choose the current month to highlight
            if (i - falseDaysInThisMonth === day && nav === 0) {
                daySquare.id = 'currentDay';
            }
            //If there is an event for a given day that we're on, we create a div, add a class, set the text, and then set it into daySquare div.
            if (eventForThatDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForThatDay.title;
                daySquare.appendChild(eventDiv);
            }

            //Adding click event listener runs a function anytime a user clicks a day, we do "i-falseDays" to skip the paddding days of previous month
            daySquare.addEventListener('click', () => openModal(dateString));
        } else {
            daySquare.classList.add('padding');
        }
        //This is to fill in the calendar with correct dates
        calendar.appendChild(daySquare);
    }
}

//We want to have eventTitle = blank because if we close a modal it will persist throughout the lifespan, and click = null because when we close the modal we want it to go back to null, not the date that we clicked
function closeModal(){
    eventTitle.classList.remove('error');
    newEventModal.style.display = 'none';
    updateEventModal.style.display = 'none';
    backDropModal.style.display = 'none';
    eventTitle.value = '';
    eventLocation.value = '';
    eventTime.value = '';
    eventDescription.value = '';
    clicked = null;
    getCalendar();
}

function saveEvent() {
    //If user has typed inside input we want to save the input
    if (eventTitle.value) {
        eventTitle.classList.remove('error');
        events.push({
            date: clicked,
            title: eventTitle.value,
        });
        localStorage.setItem('events', JSON.stringify(events));
    } else {
        eventTitle.classList.add('error');
    }
    closeModal();
}

//This filters out all events except for the one event that we are deleting
function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}


function initButtons() {
    document.getElementById('nextMonth').addEventListener('click', () => {
        nav++;
        getCalendar();
    });
    document.getElementById('backMonth').addEventListener('click', () => {
        nav--;
        getCalendar();
    });

    document.getElementById('createButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);

    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
getCalendar();