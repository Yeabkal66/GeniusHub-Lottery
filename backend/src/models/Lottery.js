const mongoose = require('mongoose');

const lotterySchema = new mongoose.Schema({
maxTickets: {
type: Number,
required: true,
default: parseInt(process.env.MAX_TICKETS) || 10
},
ticketsSold: {
type: Number,
default: 0
},
isActive: {
type: Boolean,
default: true
},
isShutdown: {
type: Boolean,
default: false
}
});

module.exports = mongoose.model('Lottery', lotterySchema);
