const { Telegraf } = require('telegraf');
const Application = require('./models/Application');
const Lottery = require('./models/Lottery');

let bot;
let pendingActions = {};
let resetRequests = {};

// Helper functions
const updateSoldCount = async () => {
  const lottery = await Lottery.findOne();
  if (lottery) {
    lottery.ticketsSold += 1;
    await lottery.save();
  }
};

const getNextOrder = async () => {
  const lottery = await Lottery.findOne();
  if (!lottery) {
    const newLottery = new Lottery();
    await newLottery.save();
    return 1;
  }
  return lottery.ticketsSold + 1;
};

const isShutdown = async () => {
  const lottery = await Lottery.findOne();
  return lottery ? lottery.isShutdown : false;
};

const isSoldOut = async () => {
  const lottery = await Lottery.findOne();
  if (!lottery) return false;
  return lottery.ticketsSold >= lottery.maxTickets;
};

// Notify admin function
const notifyAdmin = async (application) => {
  try {
    if (!bot) {
      console.error('Bot not initialized');
      return;
    }

    const order = await getNextOrder();
    const lottery = await Lottery.findOne();
    const maxTickets = lottery ? lottery.maxTickets : 10;
    
    const message = 
      '📝 *New Lottery Application*\n\n' +
      'Name: ' + application.firstName + ' ' + application.lastName + '\n' +
      'Phone: ' + application.phoneNumber + '\n' +
      'Order: ' + order + '/' + maxTickets + '\n\n' +
      'Use /approve or /reject commands.';
    
    await bot.telegram.sendMessage(
      process.env.ADMIN_ID,
      message,
      { parse_mode: 'Markdown' }
    );
    
    console.log('✅ Admin notified about application:', application.firstName, application.lastName);
  } catch (error) {
    console.error('Error notifying admin:', error);
  }
};

const setupBot = () => {
  bot = new Telegraf(process.env.BOT_TOKEN);

  // /start command
  bot.command('start', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
      await ctx.reply('⛔ Unauthorized');
      return;
    }
    
    const lottery = await Lottery.findOne();
    const maxTickets = lottery ? lottery.maxTickets : 10;
    const sold = lottery ? lottery.ticketsSold : 0;
    
    await ctx.reply(
      '🤖 *Lottery Bot Active*\n\n' +
      'Total Tickets: ' + maxTickets + '\n' +
      'Sold: ' + sold + '\n' +
      'Remaining: ' + (maxTickets - sold) + '\n\n' +
      'Commands:\n' +
      '/status - Check lottery status\n' +
      '/approve - Approve an application\n' +
      '/reject - Reject an application\n' +
      '/reset - Reset lottery (ask for quantity)\n' +
      '/shutdown - Shutdown the lottery\n' +
      '/cancel - Cancel current operation\n' +
      '/start - Show this menu',
      { parse_mode: 'Markdown' }
    );
  });

  // /status command
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
      '📊 *Lottery Status*\n\n' +
      'Total Tickets: ' + lottery.maxTickets + '\n' +
      'Sold: ' + lottery.ticketsSold + '\n' +
      'Remaining: ' + (lottery.maxTickets - lottery.ticketsSold) + '\n' +
      'Pending Applications: ' + pending + '\n' +
      'Status: ' + (lottery.isShutdown ? '🔴 SHUTDOWN' : '🟢 Active'),
      { parse_mode: 'Markdown' }
    );
  });

  // /reset command
  bot.command('reset', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
      await ctx.reply('⛔ Unauthorized');
      return;
    }

    if (resetRequests[ctx.from.id]) {
      await ctx.reply('⚠️ You already have a pending reset request. Use /cancel to cancel it.');
      return;
    }

    resetRequests[ctx.from.id] = { 
      action: 'reset', 
      step: 'ask_quantity' 
    };

    await ctx.reply(
      '⚠️ *Reset Lottery*\n\n' +
      'This will:\n' +
      '• Delete all existing applications\n' +
      '• Reset ticket count to 0\n' +
      '• Create a new lottery\n\n' +
      'Please enter the number of tickets you want (e.g., 100):\n\n' +
      'Type /cancel to cancel this operation.',
      { parse_mode: 'Markdown' }
    );
  });

  // /shutdown command
  bot.command('shutdown', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
      await ctx.reply('⛔ Unauthorized');
      return;
    }

    const lottery = await Lottery.findOne();
    if (lottery) {
      lottery.isShutdown = true;
      await lottery.save();
      await ctx.reply('🔴 Lottery has been shutdown. No more applications will be accepted.');
    } else {
      await ctx.reply('❌ No lottery found');
    }
  });

  // /cancel command
  bot.command('cancel', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
      await ctx.reply('⛔ Unauthorized');
      return;
    }

    delete pendingActions[ctx.from.id];
    delete resetRequests[ctx.from.id];
    await ctx.reply('✅ Cancelled');
  });

  // /approve command
  bot.command('approve', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
      await ctx.reply('⛔ Unauthorized');
      return;
    }

    if (await isShutdown()) {
      await ctx.reply('🔴 Lottery is shutdown');
      return;
    }

    if (await isSoldOut()) {
      await ctx.reply('❌ All tickets are sold out!');
      return;
    }

    const application = await Application.findOne({ status: 'pending' })
      .sort({ createdAt: 1 });

    if (!application) {
      await ctx.reply('📭 No pending applications');
      return;
    }

    pendingActions[ctx.from.id] = { 
      action: 'approve', 
      applicationId: application._id 
    };

    await ctx.reply(
      '✅ *Approve application?*\n\n' +
      'Name: ' + application.firstName + ' ' + application.lastName + '\n' +
      'Phone: ' + application.phoneNumber + '\n\n' +
      'Reply with ticket number (e.g., A-001) or /cancel',
      { parse_mode: 'Markdown' }
    );
  });

  // /reject command
  bot.command('reject', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
      await ctx.reply('⛔ Unauthorized');
      return;
    }

    const application = await Application.findOne({ status: 'pending' })
      .sort({ createdAt: 1 });

    if (!application) {
      await ctx.reply('📭 No pending applications');
      return;
    }

    application.status = 'rejected';
    await application.save();

    await ctx.reply(
      '❌ *Application Rejected*\n\n' +
      'Name: ' + application.firstName + ' ' + application.lastName + '\n' +
      'Phone: ' + application.phoneNumber,
      { parse_mode: 'Markdown' }
    );
  });

  // Handle text messages
  bot.on('text', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
    
    const text = ctx.message.text.trim();

    // ✅ Handle Reset Request
    if (resetRequests[ctx.from.id]) {
      const resetState = resetRequests[ctx.from.id];
      
      if (resetState.step === 'ask_quantity') {
        const quantity = parseInt(text);
        
        if (isNaN(quantity) || quantity < 1) {
          await ctx.reply('❌ Please enter a valid number greater than 0');
          return;
        }

        resetRequests[ctx.from.id] = {
          action: 'reset',
          step: 'confirm',
          quantity: quantity
        };

        await ctx.reply(
          '⚠️ *Confirm Reset*\n\n' +
          'You are about to reset the lottery with:\n' +
          '• New Total Tickets: ' + quantity + '\n\n' +
          'This will DELETE all applications.\n\n' +
          'Type "YES" to confirm or /cancel to cancel.',
          { parse_mode: 'Markdown' }
        );
        return;
      }

      if (resetState.step === 'confirm') {
        if (text.toUpperCase() === 'YES') {
          try {
            const quantity = resetState.quantity;
            
            await Application.deleteMany({});
            await Lottery.deleteMany({});
            
            const newLottery = new Lottery({
              maxTickets: quantity,
              ticketsSold: 0,
              isActive: true,
              isShutdown: false
            });
            await newLottery.save();

            delete resetRequests[ctx.from.id];

            await ctx.reply(
              '✅ *Lottery Reset Successful!*\n\n' +
              '• Total Tickets: ' + newLottery.maxTickets + '\n' +
              '• Sold: 0\n' +
              '• Remaining: ' + newLottery.maxTickets + '\n\n' +
              'All applications have been cleared.\n' +
              'The website will now show the new lottery.',
              { parse_mode: 'Markdown' }
            );
          } catch (error) {
            await ctx.reply('❌ Error resetting lottery: ' + error.message);
            delete resetRequests[ctx.from.id];
          }
        } else {
          await ctx.reply('❌ Reset cancelled');
          delete resetRequests[ctx.from.id];
        }
        return;
      }
    }

    // ✅ Handle Approve Action (existing)
    const pending = pendingActions[ctx.from.id];
    if (!pending) return;

    if (text === '/cancel') {
      delete pendingActions[ctx.from.id];
      await ctx.reply('✅ Cancelled');
      return;
    }

    if (pending.action === 'approve') {
      const ticketNumber = text.toUpperCase();
      
      if (!/^[A-Z0-9\-]{3,10}$/.test(ticketNumber)) {
        await ctx.reply('❌ Invalid format. Use format like A-001');
        return;
      }

      const existing = await Application.findOne({ ticketNumber });
      if (existing) {
        await ctx.reply('❌ Ticket number already taken. Please use another.');
        return;
      }

      const application = await Application.findById(pending.applicationId);
      if (!application) {
        await ctx.reply('❌ Application not found');
        delete pendingActions[ctx.from.id];
        return;
      }

      application.status = 'approved';
      application.ticketNumber = ticketNumber;
      
      const order = await getNextOrder();
      application.order = order;
      
      await application.save();
      await updateSoldCount();

      const lottery = await Lottery.findOne();
      const maxTickets = lottery ? lottery.maxTickets : 10;

      await ctx.reply(
        '✅ *Application Approved*\n\n' +
        'Name: ' + application.firstName + ' ' + application.lastName + '\n' +
        'Phone: ' + application.phoneNumber + '\n' +
        'Ticket: ' + ticketNumber + '\n' +
        'Order: ' + order + '/' + maxTickets + '\n\n' +
        '📱 Send SMS manually to: ' + application.phoneNumber,
        { parse_mode: 'Markdown' }
      );

      delete pendingActions[ctx.from.id];
    }
  });

  // Start bot
  bot.launch()
    .then(() => console.log('✅ Telegram bot started'))
    .catch(err => console.error('❌ Bot error:', err));

  return bot;
};

module.exports = { setupBot, notifyAdmin };
