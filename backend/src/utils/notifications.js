const pool = require('../config/db');

const createNotification = async (userId, title, body, type, bookingId = null) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, title, body, type, booking_id) VALUES (?, ?, ?, ?, ?)',
      [userId, title, body, type, bookingId]
    );
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

const notifyAdmins = async (title, body, type, bookingId = null) => {
  try {
    const [admins] = await pool.query("SELECT id FROM users WHERE role = 'admin'");
    await Promise.all(admins.map((admin) => createNotification(admin.id, title, body, type, bookingId)));
  } catch (err) {
    console.error('Failed to notify admins:', err.message);
  }
};

module.exports = { createNotification, notifyAdmins };
