const axios = require("axios");
const {
  getUserByEmail,
  createUser,
} = require("/opt/nodejs/db/repository/user-repository");
const { generateToken } = require("/opt/nodejs/common/jwt-service");
const { parseEventBody } = require("/opt/nodejs/common/utils");

exports.lambdaHandler = async (event) => {
  try {
    const { provider, idToken } = event.body ? parseEventBody(event) : event;

    if (!provider || !idToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "provider and idToken are required" }),
      };
    }

    let email, providerId, name, dob, city;

    // === GOOGLE ===
    if (provider === "google") {
      const res = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );
      if (!res.data.email || !res.data.sub) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid Google token" }),
        };
      }
      email = res.data.email;
      providerId = res.data.sub;
      name = res.data.name;

      // Google don't return dob, city in id_token
      dob = null;
      city = null;

      // === FACEBOOK ===
    } else if (provider === "facebook") {
      // require scope: email, public_profile, user_birthday, user_location
      const res = await axios.get(
        `https://graph.facebook.com/me?fields=id,email,name,picture.type(large),birthday,location&access_token=${idToken}`,
      );
      if (!res.data.email || !res.data.id) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid Facebook token" }),
        };
      }
      email = res.data.email;
      providerId = res.data.id;
      name = res.data.name;
      dob = res.data.birthday || null;
      city = res.data.location?.name || null;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Unsupported provider" }),
      };
    }

    // 2. Check user tồn tại chưa
    let user = await getUserByEmail(email);

    if (!user) {
      // Nếu chưa có user, tạo mới
      user = await createUser({
        email,
        authProvider: provider,
        providerId,
        name,
        dob,
        city,
      });
    }

    // 3. return token and user info
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      provider: user.authProvider,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: token,
        userId: user.userId,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        dob: user.dob,
        city: user.city,
        isCompleteRegister: user.isCompleteRegister,
      }),
    };
  } catch (err) {
    console.error("Social auth error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
