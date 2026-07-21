const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
firstName: {
type: String,
required: true
},
lastName: {
type: String,
required: true
},
phoneNumber: {
type: String,
required: true,
unique: true
},
status: {
type: String,
enum: ['pending', 'approved', 'rejected'],
default: 'pending'
},
ticketNumber: {
type: String,
default: null
},
order: {
type: Number,
default: null
},
createdAt: {
type: Date,
default: Date.now
}
});

module.exports = mongoose.model('Application', applicationSchema);
