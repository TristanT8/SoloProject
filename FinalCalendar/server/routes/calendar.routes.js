const calendarController = require("../controllers/calendar.controller");

module.exports = (app) => {
app.get("/api/events", calendarController.getAllEvents);
app.post("/api/events", calendarController.addEvent);
app.patch("/api/events/:id", calendarController.updateEvent);
app.delete("/api/events/:id", calendarController.deleteEvent);
};
