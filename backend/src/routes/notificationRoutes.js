const express = require('express');
const ctrl = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, ctrl.getMyNotifications);
router.get('/unread-count', authenticate, ctrl.getUnreadCount);
router.patch('/read-all', authenticate, ctrl.markAllRead);
router.patch('/:id/read', authenticate, ctrl.markAsRead);

module.exports = router;
