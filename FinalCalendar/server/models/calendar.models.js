const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Event must have a name"],
        minLength: [3, "Event Name must be at least three characters"],
    },

    location: {
        type: String,
        required: [true, "Event must be at a location!"],
    },

    date: {
        type: Date,
        required: [true, "Event must have a date"],
    },

    description: {
        type: String,
        required: [true, "There must be a description!"],
        minLength: [5, "Please give at least 5 characters to describe"],
    },

    type: {
        type: String,
        required: [true, "Event must be something"],
    }
});

const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);

module.exports = CalendarEvent;
