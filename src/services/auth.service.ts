import httpStatus from 'http-status';

import { emailQueue } from '@/queues';
import { TOKEN_TYPE } from '@/constants/jwt.constant';
import { ApiError, crypto, generateOtp } from '@/utils';
import { otpService, jwtService } from '@/services';
import { IUser } from '@/@types/user.type';
import { prisma } from '@/config/prisma';
const signUp = async (userData: Pick<IUser, 'email' | 'password'>): Promise<void> => {
  const { email } = userData;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email không được để trống.');
  }

  const isExist = await prisma.user.findUnique({ where: { email } });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email đã tồn tại. Vui lòng nhập email khác.');
  }

  const otp = generateOtp();
  const encryptedOtp = crypto.encrypt(otp);

  await otpService.saveOtp(`otp:signup:${email}`, encryptedOtp);
  await emailQueue.sendOtpEmail(email, otp);

  await prisma.user.create({ data: userData });
};

const verifyOtp = async (email: string, otp: string, context: string): Promise<void | string> => {
  const isOtpValid = await otpService.verifyOtp(`otp:${context}:${email}`, otp);
  if (!isOtpValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã OTP không hợp lệ.');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại.');
  }

  if (context === 'signup') {
    await prisma.user.update({ where: { email }, data: { isVerified: true } });
    return;
  } else if (context === 'forgot-password') {
    return crypto.encrypt(email);
  }
};

const login = async (identifier: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await prisma.user.findFirst({ where: { email: identifier } });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản chưa tồn tại. Vui lòng đăng ký tài khoản mới.');
  }

  // if (!(await user.isPasswordMatch(password))) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Thông tin đăng nhập không hợp lệ.');
  // }

  const accessToken = jwtService.generateToken({ id: user.id }, TOKEN_TYPE.ACCESS);
  const refreshToken = jwtService.generateToken({ id: user.id }, TOKEN_TYPE.REFRESH);

  return { accessToken, refreshToken };
};

const forgotPassword = async (email: string): Promise<void> => {
  const otp = generateOtp();
  const encryptedOtp = crypto.encrypt(otp);

  await otpService.saveOtp(`otp:forgot-password:${email}`, encryptedOtp);
  await emailQueue.sendOtpEmail(email, otp);
};

const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  const email = crypto.decrypt(resetPasswordToken);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại.');
  }

  user.password = newPassword;
  await prisma.user.update({ where: { email }, data: { password: newPassword } });
};

export { signUp, verifyOtp, login, forgotPassword, resetPassword };
