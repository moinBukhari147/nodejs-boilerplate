import bcrypt from "bcrypt";

// ============================ hashPassword =================================

// Function to generate a hashed password asynchronously
export const hashPassword = async (password) => {
  // Generate a salt with a cost factor of 12
  const salt = await bcrypt.genSalt(12);
  // Hash the provided password using the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);
  // Return the hashed password
  return hashedPassword;
};

// ============================ comparePassword =================================

// Function to compare a plain password with a hashed password asynchronously
export const comparePassword = async (password, hashedPassword) => {
  // Compare the provided password with the hashed password securely
  return await bcrypt.compare(password, hashedPassword);
};

// ============================ validatePassword =================================

export const validatePassword = (password, confirmPassword) => {
  if (!password) {
    return "Password is required";
  }
  if (confirmPassword && password !== confirmPassword) return "Password & confirmPassword do not match";
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  // Strong password criteria
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return "Password must contain at least one uppercase letter, one numeric digit and one special character.";
  }
};