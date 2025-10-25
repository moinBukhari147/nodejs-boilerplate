import User from "../../models/auth/user.model.js";
import { successOkWithData, UnauthorizedError } from "../../utils/response.util.js";
import { extractFieldsToUpdate, validateEmail } from "../../utils/utils.js";

// ========================= getUser ===========================

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { uuid: req.userUid },
            attributes: { exclude: ["password", "otp", "otpCount", "canChangePassword", "createdAt", "updatedAt"] },
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
        const fieldsToUpdate = extractFieldsToUpdate(req.body, ['firstName', 'lastName', 'gender',]);
        // if (fieldsToUpdate.email) {
        //     const invalidEmail = validateEmail(fieldsToUpdate.email);
        //     if (invalidEmail) return validationError(res, invalidEmail, "email")
        // }
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