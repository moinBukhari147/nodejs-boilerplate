// ========================================
//           LIBRARIES IMPORTS
// ========================================
import crypto from "crypto"

// ========================================
//         CODE IMPORTS
// ========================================
import User from "../../models/auth/user.model.js";
import { bodyReqFields } from "../../utils/requiredFields.util.js"
import { convertToLowercase, validateEmail } from '../../utils/utils.js';
import { comparePassword, hashPassword, validatePassword } from "../../utils/password.util.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.util.js"
import { sendOTPEmail } from "../../utils/email.util.js";
import {
  created,
  frontError,
  catchError,
  validationError,
  successOk,
  successOkWithData,
  UnauthorizedError,
  createdWithData,
  catchWithSequelizeValidationError,
  catchWithSequelizeFrontError
} from "../../utils/response.util.js";
import sequelize from "../../config/db.config.js";
import e from "express";




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
      firstName, lastName, age, gender, email, password, confirmPassword
    } = requiredData;


    // Check if a user with the given email already exists
    let userExist = await User.findOne({
      where: {
        email: email
      },
      attributes: ['uuid']
    });

    if (userExist) return validationError(res, "User already exists",);

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
      otp: crypto.randomInt(100099, 999990),
      password: await hashPassword(password)
    }

    const user = await User.create(userData)
    await sendOTPEmail(email, otp);
    return createdWithData(res, user, "User created successfully")
  } catch (error) {
    return catchWithSequelizeValidationError(res, error);
  }
}


// ========================= verifyOtp ===========================

export const verifyOtp = async (req, res) => {
  const { otp, uuid } = req.body;

  const reqBodyFields = bodyReqFields(req, res, ["otp", "uuid"]);
  if (reqBodyFields.error) return reqBodyFields.response;

  const transaction = await sequelize.transaction();
  try {
    const user = await User.findOne({
      where: {
        uuid
      },
      attributes: ['uuid', 'email', 'otp', 'otpAttempt', 'isActive'],
      lock: transaction.LOCK.UPDATE, // Equivalent to SELECT ... FOR UPDATE
      transaction
    });

    if (!user) {
      await transaction.rollback();
      return frontError(res, "User not found. Invalid UUId.", "uuid");
    }

    if (!user.isActive) {
      await transaction.rollback();
      return conflictError(res, "User is already verfied.");
    }

    if (!user.otp) {
      await transaction.rollback();
      return validationError(res, "OTP is not sent to this number. Generate OTP first.");
    }

    if (user.otp !== otp) {
      user.otpAttempt += 1;
      if (user.otpAttempt > 2) {
        user.otp = null;
        user.otpAttempt = 0;
        await user.save({ fields: ['otp', 'otpAttempt'], transaction });
        await transaction.commit();
        return validationError(res, "Maximum OTP attempts reached. Please regenerate OTP.");
      } else {
        await user.save({ fields: ['otpAttempt'], transaction });
        await transaction.commit();
        return validationError(res, "Invalid OTP. Please try again.", "otp");
      }
    }

    user.isActive = true;
    user.otp = null;
    user.otpAttempt = 0;

    await user.save({ fields: ['otp', 'otpAttempt', 'isActive'], transaction });
    await transaction.commit();
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return successOkWithData(res, { accessToken, refreshToken }, "User verified successfully");

  } catch (error) {
    await transaction.rollback();
    return catchWithSequelizeFrontError(res, error);
  }
};

// ========================= resendOtp ===========================

export const resendOtp = async (req, res) => {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["email"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { email } = req.body;
    const invalidEmail = validateEmail(email)
    if (invalidEmail) return validationError(res, invalidEmail)

    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email }, attributes: ["uuid", "otp", "otpAttempt"] });
    if (!user) {
      return frontError(res, "User not found. Invalid email.", "email");
    }
    const otp = crypto.randomInt(100099, 999990);
    // Send OTP email
    const otpSend = await sendOTPEmail(otp, email);
    if (!otpSend) return validationError(res, "Otp service is down, Please try again in a while.");
    user.otp = otp;
    user.otpAttempt = 0;
    await user.save({ fields: ['otp', 'otpAttempt'] });
    return successOk(res, "OTP sent successfully");
  } catch (error) {
    return catchError(res, error);

  }

}


// ========================= loginUser ===========================

export async function loginUser(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["email", "password"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { email, password } = req.body;

    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email: email }, attributes: ["isActive", "password"] });
    if (!user) {
      return validationError(res, "Invalid email or password")
    }

    if (!user.isActive) {
      user.otp = crypto.randomInt(100099, 999990);
      user.otpAttempt = 0;
      await user.save({ fields: ['otp', 'otpAttempt'] });
      const otpSent = await sendOTPEmail(email, user.otp);
      if (!otpSent) return validationError(res, "Otp service is down, and your account is not active, Please try again in a while.");

      return validationError(res, "User is not verified. An OTP is send to your email, Please verify your email first.")
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
    return successOkWithData(res, { accessToken, refreshToken }, "Login successful");
  } catch (error) {
    return catchError(res, error);
  }
}

// ========================= regenerateAccessToken ===========================

export async function regenerateAccessToken(req, res) {
  try {

    const user = await User.findOne({ where: { uuid: req.userUid } });
    if (!user) return UnauthorizedError(res, "Invalid token");
    const newAccessToken = generateAccessToken({ uuid: req.userUid });

    return successOkWithData(res, { accessToken: newAccessToken }, "Access Token Generated Successfully",);
  } catch (error) {
    return catchError(res, error);
  }
};

// ========================= getUser ===========================

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.userUid },
      attributes: { exclude: ["password", "otp", "otpAttempt", "can_change_password"] },
    });
    if (!user) {
      return UnauthorizedError(res, "Invalid token");
    }
    return successOkWithData(res, user, "User fetched successfully");
  } catch (error) {

    return catchError(res, error);

  }
}

// ========================= updateUser ===========================

export const updateUser = async (req, res) => {
  try {
    const { email, } = req.body;

    const fieldsToUpdate = {};
    if (email) {
      const invalidEmail = validateEmail(email);
      if (invalidEmail) return validationError(res, invalidEmail, "email");
      fieldsToUpdate.email = email;
    }
    if (Object.keys(fieldsToUpdate).length > 0) {
      await User.update(fieldsToUpdate, {
        where: { uuid: req.userUid }
      });
    }
    return successOk(res, "User updated successfully");
  } catch (error) {
    return catchWithSequelizeValidationError(res, error);

  }
}


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

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) return validationError(res, "Otp service is down, Please try again in a while.");
    const otpData = {
      otp,
      otp_count: 0
    }
    // Save OTP in the database
    await User.update(otpData, {
      where: { email },
    });
    return successOk(res, "OTP sent successfully")
  } catch (error) {
    return catchError(res, error);
  }
}

// ========================= forgotPasswordOtpVerify ===========================

// Handles verify otp
export async function forgotPasswordOtpVerify(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["email", "otp"]);
    if (reqBodyFields.error) return reqBodyFields.response;
    const { email, otp } = req.body;

    const transaction = await sequelize.transaction();
    // Check if a user with the given email exists
    const user = await User.findOne({
      where: { email: email },
      lock: transaction.LOCK.UPDATE, // Equivalent to SELECT ... FOR UPDATE
      attributes: ['uuid', 'canChangePass', 'otp', 'otpAttempt']
    });

    if (!user) {
      await transaction.rollback();
      return frontError(res, "User not found. Invalid email.", "email");
    }
    if (!user.otp) {
      await transaction.rollback();
      return validationError(res, "OTP is not sent to this email. Generate OTP first.");
    }

    if (user.otp !== otp) {
      user.otpAttempt += 1;
      if (user.otpAttempt > 2) {
        user.otp = null;
        user.otpAttempt = 0;
        await user.save({ fields: ['otp', 'otpAttempt'], transaction });
        await transaction.commit();
        return validationError(res, "Maximum OTP attempts reached. Please regenerate OTP.");
      } else {
        await user.save({ fields: ['otpAttempt'], transaction });
        await transaction.commit();
        return validationError(res, "Invalid OTP. Please try again.", "otp");
      }
    }
    // OTP matched, set can_change_password to true
    await User.update(
      { canChangePass: true, otp: null, otpAttempt: 0 },
      { where: { email } }
    );

    return successOk(res, "OTP Verified Successfully");
  } catch (error) {
    return catchError(res, error);
  }
}

/// ========================= forgotPasswordReset ===========================

// API endpoint to set new password after OTP verification
export async function forgotPasswordReset(req, res) {
  try {
    const reqBodyFields = bodyReqFields(req, res, ["newPassword", "confirmPassword", "email"]);
    if (reqBodyFields.error) return reqBodyFields.response;

    const { newPassword, confirmPassword, email } = req.body;

    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email: email }, attributes: ['uuid', 'canChangePass'] });
    if (!user) {
      return frontError(res, "User with this email does not exist. Invalid email.");
    }

    // Check if passwords match
    const invalidPassword = validatePassword(newPassword, confirmPassword);
    if (invalidPassword) return validationError(res, invalidPassword);

    // only allow if can_change_password is true , i.e otp verified
    if (user.canChangePass === false) {
      return UnauthorizedError(res, "Unauthorized");
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password in the database
    await User.update({ password: hashedPassword, canChangePass: false, otp: null, otpAttempt: 0 }, {
      where: { email }
    });

    return successOk(res, "Password updated successfully.");
  } catch (error) {
    return catchError(res, error);
  }
}