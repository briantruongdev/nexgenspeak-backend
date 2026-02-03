exports.parseEventBody = (event) => {
  if (!event) return {};
  if (typeof event.body === "object" && event.body !== null) return event.body;
  if (typeof event.body === "string") {
    try {
      return JSON.parse(event.body);
    } catch (e) {
      return {};
    }
  }
  return {};
};
