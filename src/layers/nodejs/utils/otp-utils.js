const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOTPExpiration = (minutes = 5) => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + minutes);
  return expirationTime.toISOString();
};

const isOTPExpired = (otpExpiredAt) => {
  if (!otpExpiredAt) return true;
  return new Date() > new Date(otpExpiredAt);
};

module.exports = {
  generateOTP,
  getOTPExpiration,
  isOTPExpired,
};
