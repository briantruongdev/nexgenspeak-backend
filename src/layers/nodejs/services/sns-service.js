const AWS = require("aws-sdk");

const sns = new AWS.SNS({ region: process.env.APP_REGION });

const sendTrialRequestNotification = async (trialRequestData) => {
  const { email, name, phone, englishLevel, requestedAt } = trialRequestData;

  const subject = `New Trial Request - ${name}`;
  const message = `
New trial request received:

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
English Level: ${englishLevel || "Not specified"}
Requested At: ${requestedAt}

Please follow up with the customer as soon as possible.
    `.trim();

  const params = {
    TopicArn: process.env.TRIAL_NOTIFICATION_TOPIC_ARN,
    Subject: subject,
    Message: message,
  };

  try {
    const result = await sns.publish(params).promise();
    console.log("Trial request notification sent:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Error sending trial request notification:", error);
    throw error;
  }
};

module.exports = {
  sendTrialRequestNotification,
};
