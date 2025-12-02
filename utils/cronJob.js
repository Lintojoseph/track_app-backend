const cron = require('node-cron');
const mongoose = require('mongoose');

// Simple, robust version
const markOverdueTasks = async () => {
    try {
        console.log('\n🔍 Checking for overdue tasks...');
        
        // Get Task model - this is the safest way
        let Task;
        if (mongoose.models.Task) {
            Task = mongoose.models.Task;
        } else {
            // Try to load the model
            try {
                Task = require('../models/Task');
            } catch (error) {
                console.error('Cannot load Task model:', error.message);
                return;
            }
        }
        
        const now = new Date();
        
        // Find and update overdue tasks
        const result = await Task.updateMany(
            {
                status: { $in: ['todo', 'in-progress'] },
                dueDate: { $lt: now }
            },
            {
                status: 'overdue'
            }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} tasks as overdue`);
        
    } catch (error) {
        console.error('❌ Error in cron job:', error.message);
    }
};

// Initialize cron job
const initCronJob = () => {
    // Schedule daily at midnight
    cron.schedule('0 0 * * *', markOverdueTasks);
    console.log('📅 Cron job scheduled to run daily at midnight');
    
    // Run on server start after a delay
    setTimeout(() => {
        console.log('🚀 Running initial overdue check...');
        markOverdueTasks();
    }, 5000);
};

module.exports = { initCronJob };