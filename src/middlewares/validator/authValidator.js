import { body, validationResult } from "express-validator";
import { frontError } from "../../utils/responses.js";

export const validateUserRegister = [
  [
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(), // This takes care of converting the email to lowercase among other things
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      // return frontError(res, "this is required", 'email')
    }
    next();
  },
];

export const validateUserLogin = [
  [
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(), // Normalizes the email to lowercase
    body("password").exists().withMessage("Password is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]