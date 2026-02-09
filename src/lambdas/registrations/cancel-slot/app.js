const { parseEventBody } = require("/opt/nodejs/common/utils");
const {
  getRegistrationById,
  updateRegistrationSlots,
  deleteRegistration,
} = require("/opt/nodejs/db/repository/registration-repository");
const { createCorsResponse } = require("/opt/nodejs/common/cors");
const { TIME_SLOTS } = require("/opt/nodejs/common/constants");
const jwt = require("jsonwebtoken");

exports.lambdaHandler = async (event) => {
  try {
    // Extract and verify JWT token
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createCorsResponse(401, {
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return createCorsResponse(401, {
        message: "Unauthorized: Invalid token",
      });
    }

    const userId = decoded.sub; // JWT token uses 'sub' field for userId

    // Parse request body
    const { registrationId, slotIds } = event.body
      ? parseEventBody(event)
      : event;

    // Validate required fields
    if (!registrationId) {
      return createCorsResponse(400, {
        message: "Registration ID is required",
      });
    }

    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return createCorsResponse(400, {
        message: "Slot IDs are required and must be a non-empty array",
      });
    }

    // Validate slot IDs
    const validSlotIds = TIME_SLOTS.map((s) => s.id);
    const invalidSlots = slotIds.filter((id) => !validSlotIds.includes(id));
    if (invalidSlots.length > 0) {
      return createCorsResponse(400, {
        message: `Invalid slot IDs: ${invalidSlots.join(", ")}`,
      });
    }

    // Get the registration
    const registration = await getRegistrationById(registrationId);
    if (!registration) {
      return createCorsResponse(404, {
        message: "Registration not found",
      });
    }

    // Verify that the registration belongs to the user
    if (registration.userId !== userId) {
      return createCorsResponse(403, {
        message: "You are not authorized to cancel this registration",
      });
    }

    // Check if the slots to cancel exist in the registration
    const currentSlots = registration.slotIds || [];
    const slotsNotInRegistration = slotIds.filter(
      (id) => !currentSlots.includes(id),
    );
    if (slotsNotInRegistration.length > 0) {
      const notFoundSlotDetails = TIME_SLOTS.filter((s) =>
        slotsNotInRegistration.includes(s.id),
      )
        .map((s) => `${s.startTime}-${s.endTime}`)
        .join(", ");
      return createCorsResponse(400, {
        message: `The following slots are not in your registration: ${notFoundSlotDetails}`,
        slotsNotInRegistration,
      });
    }

    // Remove the slots from the registration
    const remainingSlots = currentSlots.filter((id) => !slotIds.includes(id));

    // If no slots remain, delete the entire registration
    if (remainingSlots.length === 0) {
      await deleteRegistration(registrationId);
      return createCorsResponse(200, {
        message: "All slots cancelled. Registration deleted successfully",
        registrationId,
        cancelledSlots: slotIds,
        deleted: true,
      });
    }

    // Otherwise, update the registration with remaining slots
    await updateRegistrationSlots(registrationId, remainingSlots);

    const cancelledSlotDetails = TIME_SLOTS.filter((s) =>
      slotIds.includes(s.id),
    )
      .map((s) => `${s.startTime}-${s.endTime}`)
      .join(", ");

    return createCorsResponse(200, {
      message: `Successfully cancelled slots: ${cancelledSlotDetails}`,
      registration: {
        ...registration,
        slotIds: remainingSlots,
        updatedAt: new Date().toISOString(),
      },
      cancelledSlots: slotIds,
      remainingSlots,
    });
  } catch (err) {
    console.error("Cancel slot error:", err);
    return createCorsResponse(500, { message: "Internal server error" });
  }
};
