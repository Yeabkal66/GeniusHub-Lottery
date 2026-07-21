const Application = require('../models/Application');
const Lottery = require('../models/Lottery');
const { notifyAdmin } = require('../bot');

// Get lottery status
const getStatus = async (req, res) => {
try {
let lottery = await Lottery.findOne();
if (!lottery) {
lottery = new Lottery();
await lottery.save();
}

const pendingCount = await Application.countDocuments({ status: 'pending' });

res.json({
maxTickets: lottery.maxTickets,
ticketsSold: lottery.ticketsSold,
remaining: lottery.maxTickets - lottery.ticketsSold,
isActive: lottery.isActive && !lottery.isShutdown,
isShutdown: lottery.isShutdown || false,
isSoldOut: lottery.ticketsSold >= lottery.maxTickets,
pendingCount
});
} catch (error) {
res.status(500).json({ message: 'Error fetching status' });
}
};

// Create new application
const createApplication = async (req, res) => {
try {
const { firstName, lastName, phoneNumber } = req.body;

// Check if lottery is shutdown
const lottery = await Lottery.findOne();
if (!lottery) {
return res.status(400).json({ message: 'Lottery not found' });
}

if (lottery.isShutdown) {
return res.status(400).json({ message: 'Lottery is shutdown' });
}

if (lottery.ticketsSold >= lottery.maxTickets) {
return res.status(400).json({ message: 'All tickets are sold out' });
}

// Check if phone number already has a pending application
const existing = await Application.findOne({
phoneNumber,
status: 'pending'
});

if (existing) {
return res.status(400).json({
message: 'You already have a pending application'
});
}

// Create new application
const application = new Application({
firstName,
lastName,
phoneNumber,
status: 'pending'
});

await application.save();

// Notify admin via Telegram
try {
await notifyAdmin(application);
} catch (error) {
console.error('Failed to notify admin:', error);
}

res.status(201).json({
applicationId: application._id,
message: 'Application created successfully'
});
} catch (error) {
console.error('Error creating application:', error);
res.status(500).json({ message: 'Error creating application' });
}
};

// Get application status
const getApplication = async (req, res) => {
try {
const { phoneNumber } = req.params;

const application = await Application.findOne({ phoneNumber })
.sort({ createdAt: -1 });

if (!application) {
return res.status(404).json({ message: 'Application not found' });
}

res.json({
firstName: application.firstName,
lastName: application.lastName,
phoneNumber: application.phoneNumber,
status: application.status,
ticketNumber: application.ticketNumber,
order: application.order,
createdAt: application.createdAt
});
} catch (error) {
res.status(500).json({ message: 'Error fetching application' });
}
};

module.exports = { getStatus, createApplication, getApplication };
