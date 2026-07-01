const { admin } = require('../config/firebase');
const AppError = require('../utils/AppError');

const mapFcmError = (error) => {
  const code = error.code || 'messaging/unknown';

  if (
    code === 'messaging/invalid-registration-token' ||
    code === 'messaging/registration-token-not-registered' ||
    code === 'messaging/invalid-argument'
  ) {
    return new AppError('Invalid device token.', 422, true, { code });
  }

  return new AppError('FCM delivery failed.', 502, true, {
    code,
    message: error.message
  });
};

const buildMessage = ({ token, title, body, data = {}, priority = 'Normal' }) => ({
  token,
  notification: {
    title,
    body
  },
  data: Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = value === undefined || value === null ? '' : String(value);
    return acc;
  }, {}),
  android: {
    priority: priority === 'High' ? 'high' : 'normal',
    notification: {
      channelId: priority === 'High' ? 'high-priority-reminders' : 'reminders',
      priority: priority === 'High' ? 'max' : 'default',
      defaultSound: true
    }
  },
  apns: {
    payload: {
      aps: {
        sound: 'default',
        category: 'REMINDER_ACTIONS'
      }
    },
    headers: {
      'apns-priority': priority === 'High' ? '10' : '5'
    }
  }
});

const sendPushNotification = async ({ deviceToken, title, body, data, priority }) => {
  try {
    const messageId = await admin.messaging().send(
      buildMessage({
        token: deviceToken,
        title,
        body,
        data,
        priority
      })
    );

    return {
      success: true,
      messageId
    };
  } catch (error) {
    throw mapFcmError(error);
  }
};

const sendMulticastNotification = async ({ deviceTokens, title, body, data, priority }) => {
  const results = [];

  for (const deviceToken of deviceTokens) {
    try {
      const result = await sendPushNotification({
        deviceToken,
        title,
        body,
        data,
        priority
      });

      results.push({
        deviceToken,
        ...result
      });
    } catch (error) {
      results.push({
        deviceToken,
        success: false,
        error: error.message
      });
    }
  }

  return results;
};

module.exports = {
  sendPushNotification,
  sendMulticastNotification
};
