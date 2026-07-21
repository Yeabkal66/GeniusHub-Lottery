const { Telegraf } = require('telegraf');
const Application = require('./models/Application');
const Lottery = require('./models/Lottery');

let bot;
let pendingActions = {};

// These will store the current state
let currentOrder = 0;
let currentTicketNumber = 0;

const setupBot = () => {
bot = new Telegraf(process.env.BOT_TOKEN);

// Helper to get next ticket number
const getNextTicketNumber = () => {
currentTicketNumber += 1;
return A-${String(currentTicketNumber).padStart(3, '0')}`;
};

// Helper to get current order
const getCurrentOrder = async () => {
const lottery = await Lottery.findOne();
if (!lottery) {
const newLottery = new Lottery();
await newLottery.save();
return 0;
}
return lottery.ticketsSold;
};

// Helper to update sold count
const updateSoldCount = async () => {
const lottery = await Lottery.findOne();
if (lottery) {
lottery.ticketsSold += 1;
await lottery.save();
}
};

// Helper to get next order number
const getNextOrder = async () => {
const lottery = await Lottery.findOne();
if (!lottery) {
const newLottery = new Lottery();
await newLottery.save();
return 1;
}
return lottery.ticketsSold + 1;
};

// Check if lottery is shutdown
const isShutdown = async () => {
const lottery = await Lottery.findOne();
return lottery ? lottery.isShutdown : false;
};

// Check if sold out
const isSoldOut = async () => {
const lottery = await Lottery.findOne();
if (!lottery) return false;
return lottery.ticketsSold >= lottery.maxTickets;
};

// Send notification to admin about new application
const notifyAdmin = async (application) => {
try {
const order = await getNextOrder();
const maxTickets = (await Lottery.findOne())?.maxTickets || 10;

await bot.telegram.sendMessage(
process.env.ADMIN_ID,
📝 *New Application*\n\n +
Name:${application.firstName} latex
{application.lastName}\n` + `Phone: 

{application.phoneNumber}\n+Order: {maxTickets}\n\n+Use /approve or /reject commands.`,
{ parse_mode: 'Markdown' }
);
} catch (error) {
console.error('Error notifying admin:', error);
}
};

// Handle /start command
bot.command('start', async (ctx) => {
if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
await ctx.reply('⛔ Unauthorized');
return;
}

const lottery = await Lottery.findOne();
const maxTickets = lottery ? lottery.maxTickets : 10;
const sold = lottery ? lottery.ticketsSold : 0;

await ctx.reply(
🤖 *Lottery Bot Active*\n\n +
Total Tickets: ${maxTickets}\n+Sold: ${sold}\n +
Remaining: ${maxTickets - sold}\n\n+Commands:\n+/status - Check lottery status\n+/approve - Approve an application\n+/reject - Reject an application\n+/shutdown - Shutdown the lottery\n+/start - Show this menu`,
{ parse_mode: 'Markdown' }
);
});

// Handle /status command
bot.command('status', async (ctx) => {
if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
await ctx.reply('⛔ Unauthorized');
return;
}

const lottery = await Lottery.findOne();
if (!lottery) {
await ctx.reply('❌ No lottery found');
return;
}

const pending = await Application.countDocuments({ status: 'pending' });

await ctx.reply(
📊 *Lottery Status*\n\n +
Total Tickets:${lottery.maxTickets}\n+Sold: latex
{lottery.ticketsSold}\n` + `Remaining: 

{lottery.maxTickets - lottery.ticketsSold}\n+Pending Applications: latex
{pending}\n` + `Status: 

{lottery.isShutdown ? '🔴 SHUTDOWN' : '🟢 Active'}`,
{ parse_mode: 'Markdown' }
);
});

// Handle /approve command
bot.command('approve', async (ctx) => {
if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
await ctx.reply('⛔ Unauthorized');
return;
}

// Check if lottery is shutdown
if (await isShutdown()) {
await ctx.reply('⛔ Lottery is shutdown');
return;
}

// Check if sold out
if (await isSoldOut()) {
await ctx.reply('❌ All tickets are sold out!');
return;
}

// Get the first pending application
const application = await Application.findOne({ status: 'pending' })
.sort({ createdAt: 1 });

if (!application) {
await ctx.reply('📭 No pending applications');
return;
}

// Store the application ID for this admin session
pendingActions[ctx.from.id] = {
action: 'approve',
applicationId: application._id
};

await ctx.reply(
✅ Approve application?\n\n +
Name: ${application.firstName} ${application.lastName}\n +
Phone: ${application.phoneNumber}\n\n+Reply with ticket number (e.g., A-001) or /cancel`
);
});

// Handle /reject command
bot.command('reject', async (ctx) => {
if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
await ctx.reply('⛔ Unauthorized');
return;
}

// Get the first pending application
const application = await Application.findOne({ status: 'pending' })
.sort({ createdAt: 1 });

if (!application) {
await ctx.reply('📭 No pending applications');
return;
}

// Reject the application
application.status = 'rejected';
await application.save();

// Get lottery for order info
const lottery = await Lottery.findOne();
const maxTickets = lottery ? lottery.maxTickets : 10;
const order = await Application.countDocuments({
status: { `$in: ['approved', 'pending'] }
});

await ctx.reply(
❌ *Application Rejected*\n\n +
Name: ${application.firstName} ${application.lastName}\n +
Phone: ${application.phoneNumber}\n+Order: ${order}/${maxTickets}\n\n+The user has been notified.`,
{ parse_mode: 'Markdown' }
);
});

// Handle /shutdown command
bot.command('shutdown', async (ctx) => {
if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
await ctx.reply('⛔ Unauthorized');
return;
}

const lottery = await Lottery.findOne();
if (lottery) {
lottery.isShutdown = true;
await lottery.save();
await ctx.reply('🔴 Lottery has been shutdown\n\nNo more applications will be accepted.', { parse_mode: 'Markdown' });
} else {
await ctx.reply('❌ No lottery found');
}
});

// Handle /cancel command
bot.command('cancel', async (ctx) => {
if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
await ctx.reply('⛔ Unauthorized');
return;
}

delete pendingActions[ctx.from.id];
await ctx.reply('✅ Cancelled');
});

// Handle text messages (for ticket number input)
bot.on('text', async (ctx) => {
if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;

// Check if there's a pending action
const pending = pendingActions[ctx.from.id];
if (!pending) return;

const text = ctx.message.text.trim();

// Handle cancel
if (text === '/cancel') {
delete pendingActions[ctx.from.id];
await ctx.reply('✅ Cancelled');
return;
}

// Check if it's an approve action
if (pending.action === 'approve') {
const ticketNumber = text.toUpperCase();

// Validate ticket number format
if (!/^[A-Z0-9-]{3,10}`$/.test(ticketNumber)) {
await ctx.reply('❌ Invalid format. Use format like A-001');
return;
}

// Check if ticket number already exists
const existing = await Application.findOne({ ticketNumber });
if (existing) {
await ctx.reply('❌ Ticket number already taken. Please use another.');
return;
}

// Get the application
const application = await Application.findById(pending.applicationId);
if (!application) {
await ctx.reply('❌ Application not found');
delete pendingActions[ctx.from.id];
return;
}

// Approve the application
application.status = 'approved';
application.ticketNumber = ticketNumber;

// Get order number
const order = await getNextOrder();
application.order = order;

await application.save();

// Update sold count
await updateSoldCount();

// Get lottery info
const lottery = await Lottery.findOne();
const maxTickets = lottery ? lottery.maxTickets : 10;

await ctx.reply(
✅ *Application Approved*\n\n +
Name: ${application.firstName} ${application.lastName}\n +
Phone: ${application.phoneNumber}\n+Ticket: ${ticketNumber}\n +
Order: ${order}/${maxTickets}\n\n +
📱 Send SMS manually to: ${application.phoneNumber},
{ parse_mode: 'Markdown' }
);

// Clear pending action
delete pendingActions[ctx.from.id];
}
});

// Start bot
bot.launch()
.then(() => console.log('🤖 Telegram bot started'))
.catch(err => console.error('❌ Bot error:', err));

return bot;
};

module.exports = { setupBot, notifyAdmin };
