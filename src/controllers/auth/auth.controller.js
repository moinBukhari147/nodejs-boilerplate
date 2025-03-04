// ========================================
//           LIBRARIES IMPORTS
// ========================================
import crypto from "crypto"
import bcrypt from "bcryptjs";
import { Sequelize } from "sequelize";


// ========================================
//         CODE IMPORTS
// ========================================
import User from "../../models/auth/user.model.js";
import { bodyReqFields } from "../../utils/requiredFields.js"
import { convertToLowercase, validateEmail } from '../../utils/utils.js';
import { comparePassword, hashPassword, validatePassword } from "../../utils/passwordUtils.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwtTokenGenerator.js"
import { sendOTPEmail } from "../../utils/sendEmailUtils.js";
import {
  created,
  frontError,
  catchError,
  validationError,
  successOk,
  successOkWithData,
  UnauthorizedError,
  sequelizeValidationError
} from "../../utils/responses.js";




// ========================================
//            CONTOLLERS
// ========================================

export async function registerUser(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, [
      "firstName",
      "lastName",
      "gender",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const excludedFields = ['password', 'confirmPassword', 'email'];
    const requiredData = convertToLowercase(req.body, excludedFields);
    const {
      firstName, lastName, age, gender, email, password, confirmPassword, fcmToken
    } = requiredData;


    // Check if a user with the given email already exists
    let user = await User.findOne({
      where: {
        email: email
      }
    });

    if (user) return validationError(res, "User already exists",);

    const invalidEmail = validateEmail(email)
    if (invalidEmail) return validationError(res, invalidEmail)

    const invalidPassword = validatePassword(password, confirmPassword);
    if (invalidPassword) return validationError(res, invalidPassword)


    const userData = {
      first_name: firstName,
      last_name: lastName,
      age,
      gender,
      email,
      password: await hashPassword(password)
    }

    await User.create(userData)

    return created(res, "User created successfully")
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) return sequelizeValidationError(res, error);
    else return catchError(res, error);
  }
}

// ========================= loginUser ===========================

export async function loginUser(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["email", "password"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { email, password } = req.body;

    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return validationError(res, "Invalid email or password")
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return validationError(res, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // If passwords match, return success
    return successOkWithData(res, "Login successful", { accessToken, refreshToken });
  } catch (error) {
    return catchError(res, error);
  }
}

// ========================= regenerateAccessToken ===========================

export async function regenerateAccessToken(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["refreshToken"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { refreshToken } = req.body;
    const { invalid, userUid } = verifyRefreshToken(refreshToken);

    if (invalid) return validationError(res, "Invalid refresh token");
    const newAccessToken = generateAccessToken({ uuid: userUid });

    return successOkWithData(res, "Access Token Generated Successfully", { accessToken: newAccessToken });
  } catch (error) {
    return catchError(res, error);
  }
};

// ========================= updatePassword ===========================

export async function updatePassword(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["oldPassword", "newPassword", "confirmPassword"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if a user exists
    const user = await User.findOne({ where: { uuid: req.userUid } });
    if (!user) {
      return UnauthorizedError(res, "Invalid token")
    }

    // Compare oldPassword with hashed password in database
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) return validationError(res, 'Invalid old password', "oldPassword");

    const invalidPassword = validatePassword(newPassword, confirmPassword);
    if (invalidPassword) return validationError(res, invalidPassword)

    // Check if oldPassword and newPassword are the same
    if (oldPassword === newPassword) {
      return validationError(res, 'New password must be different from old password');
    }


    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    // // Update user's password in the database
    await User.update({ password: hashedPassword }, {
      where: { uuid: req.userUid }
    });

    return successOk(res, "Password updated successfully.");
  } catch (error) {
    catchError(res, error);
  }
}

// ========================= forgotPassword ===========================

export async function forgotPassword(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["email"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { email } = req.body;
    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return validationError(res, "This email is not registered.", "email")
    }

    // generating otp 
    const otp = crypto.randomInt(100099, 999990);
    // const expiry = new Date();
    // expiry.setSeconds(expiry.getSeconds() + 180);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (emailSent) {
      const otpData = {
        otp,
        otp_count: 0
      }
      // Save OTP in the database
      await User.update(otpData, {
        where: { email },
      });
      req.user = { email }
      return successOk(res, "OTP sent successfully")
    } else {
      return catchError(res, "Something went wrong. Failed to send OTP.")
    }
  } catch (error) {
    return catchError(res, error);
  }
}

// ========================= verifyOtp ===========================

// Handles verify otp
export async function verifyOtp(req, res) {
  try {

    const reqBodyFields = bodyReqFields(req, res, ["email", "otp"]);
    if (reqBodyFields.error) return reqBodyFields.response;
    const { email, otp } = req.body;

    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) return frontError(res, "This email is not registered.", "email")
    if (user.otp_count >= 3) return validationError(res, "Maximum OTP attempts reached. Please regenerate OTP.");

    // Compare OTP if does'nt match increment otp_count
    if (user.otp !== parseInt(otp, 10)) {
      await User.update(
        {
          otp_count: Sequelize.literal('otp_count + 1'),
        },
        { where: { email } },
      );
      return validationError(res, 'Invalid OTP');
    }

    // OTP matched, set can_change_password to true
    await User.update(
      { can_change_password: true },
      { where: { email } }
    );

    return successOk(res, "OTP Verified Successfully");
  } catch (error) {
    return catchError(res, error);
  }
}

// ========================= setNewPassword ===========================

// API endpoint to set new password after OTP verification
export async function setNewPassword(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["newPassword", "confirmPassword", "email"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { newPassword, confirmPassword, email } = req.body;

    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return frontError(res, "User with this email does not exist. Invalid email.");
    }

    // Check if passwords match
    const invalidPassword = validatePassword(newPassword, confirmPassword);
    if (invalidPassword) return validationError(res, invalidPassword);

    // only allow if can_change_password is true , i.e otp verified
    if (user.can_change_password === false) {
      return UnauthorizedError(res, "Unauthorized");
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password in the database
    await User.update({ password: hashedPassword, can_change_password: false, otp: null, otp_count: 0 }, {
      where: { email }
    });

    return successOk(res, "Password updated successfully.");
  } catch (error) {
    catchError(res, error);
  }
}

// ===================================================================