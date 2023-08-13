const CalendarEvent = require("../models/calendar.models"); // Assuming the path to your model is correct

module.exports = {

    getAllEvents: async (req, res) => {
    try {
        const allEvents = await CalendarEvent.find({});
        res.status(200).json(allEvents);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
},

    addEvent: async (req, res) => {
        try {
            console.log("Received request to add event:", req.body);
            const newEvent = new CalendarEvent(req.body);

            // Log the event before saving it
            console.log("Event to be saved:", newEvent);

            const savedEvent = await newEvent.save();
            console.log("Event saved:", savedEvent);
            res.status(201).json(savedEvent);
        } catch (error) {
            console.error("Error adding event:", error);
            res.status(500).json({ error: "Failed to add event" });
        }
    },


updateEvent: async (req, res) => {
    try {
        const updatedEvent = await CalendarEvent.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: "Failed to update event" });
    }
},

deleteEvent: async (req, res) => {
    try {
        await CalendarEvent.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete event" });
        }
    },
};
