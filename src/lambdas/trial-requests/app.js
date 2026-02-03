const {
  createTrialRequest,
} = require("/opt/nodejs/db/repository/trial-requests-repository");
const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  sendTrialRequestNotification,
} = require("/opt/nodejs/services/sns-service");
const { createCorsResponse } = require("/opt/nodejs/common/cors");

exports.lambdaHandler = async (event) => {
  try {
    const { email, name, phone, englishLevel } = event.body
      ? parseEventBody(event)
      : event;

    if (!phone || !name) {
      return createCorsResponse(400, {
        message: "Name and phone are required",
      });
    }

    const trialRequest = await createTrialRequest({
      email,
      name,
      phone,
      englishLevel,
    });

    // Send notification email
    try {
      await sendTrialRequestNotification(trialRequest);
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the request if notification fails
    }

    return createCorsResponse(200, {
      message: "Request trial success! We will contact you soon.",
    });
  } catch (err) {
    console.error("Request trial error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
