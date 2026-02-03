const axios = require("axios");

const axiosFetch = async ({
  endpoint,
  payload = {},
  headers = {},
  method = "GET",
  options = {},
}) => {
  console.log("endpoint:", endpoint);
  console.log("method:", method);
  console.log("headers:", headers);
  console.log("payload:", payload);

  let response;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(headers && headers),
    },
    ...options,
  };
  try {
    switch (method.toUpperCase()) {
      case "POST":
        response = await axios.post(endpoint, payload, config);
        break;
      case "PATCH":
        response = await axios.patch(endpoint, payload, config);
        break;
      case "PUT":
        response = await axios.put(endpoint, payload, config);
        break;
      case "DELETE":
        response = await axios.delete(endpoint, {
          data: payload,
          ...config,
        });
        break;
      case "GET":
      default:
        response = await axios.get(endpoint, config);
        break;
    }
    console.log("response.data => ", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(`Error with ${method} request:`, error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    }
    throw error.response?.data ? error.response.data : error.message;
  }
};

module.exports = {
  axiosFetch,
};
