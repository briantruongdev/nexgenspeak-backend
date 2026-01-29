const AWS = require("aws-sdk");

const sns = new AWS.SNS({ region: process.env.APP_REGION });

const sendOTPEmail = async (email, otp) => {
  const subject = "NexGenSpeak - Verify Your Email";
  const message = `
Hello,

Thank you for registering with NexGenSpeak! Please use the following OTP code to verify your email address:

━━━━━━━━━━━━━━━━━━━━━━
    OTP CODE: ${otp}
━━━━━━━━━━━━━━━━━━━━━━

⏰ This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} NexGenSpeak. All rights reserved.
  `.trim();

  const params = {
    TopicArn: process.env.OTP_NOTIFICATION_TOPIC_ARN,
    Subject: subject,
    Message: message,
    MessageAttributes: {
      email: {
        DataType: "String",
        StringValue: email,
      },
      otp: {
        DataType: "String",
        StringValue: otp,
      },
    },
  };

  try {
    const result = await sns.publish(params).promise();
    console.log(`OTP notification sent via SNS to ${email}:`, result.MessageId);
    return result;
  } catch (error) {
    console.error("Error sending OTP via SNS:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = {
  sendOTPEmail,
};
