// ================================================================
// ===================== success responses ========================
// ================================================================

const successOk = (res, message) => {
    return res.status(200).send({
        success: true,
        message: message,
    });
};

// ===================== successOkWithData ========================

const successOkWithData = (res, message, data) => {
    return res.status(200).send({
        success: true,
        message: message,
        data: data,
    });
};

// =========================== created ============================

const created = (res, message) => {
    return res.status(201).send({
        success: true,
        message: message,
    });
};

// ======================= createdWithData ========================

const createdWithData = (res, message, data) => {
    return res.status(201).send({
        success: true,
        message: message,
        data: data,
    });
};

// ================================================================
// ======================= error responses ========================
// ================================================================

// ========================= catchError ===========================
const catchError = (res, error) => {
    return res.status(500).send({
        message: error.message || "Internal server error",
    });
};

// ======================== validationError =======================

const validationError = (res, message, field) => {
    return res.status(400).send({
        success: false,
        error: "user",
        field: field,
        message: message,
    });
};

// ======================== sequlizeValidationError =======================

const sequlizeValidationError = (res, error) => {
    const errorMessage = error.errors[0].message;
    const key = error.errors[0].path
    return validationError(res, errorMessage, key);
};

// ========================= frontError ===========================

const frontError = (res, message, field) => {
    return res.status(400).send({
        success: false,
        error: "frontend",
        field: field,
        message: message,
    });
};

// ========================== backError ===========================
// This will be used when we are calling the other external Api's from backend And facing an issue.

const backError = (res, message, field) => {
    return res.status(400).send({
        success: false,
        error: "backend",
        field: field,
        message: message,
    });
};

// ============================ authenticationError ==========================

const UnauthorizedError = (res, message) => {
    return res.status(401).json({
        success: false,
        message: message || 'Unauthorized',
    });
}

// ============================ authenticationError ==========================

const forbiddenError = (res, message) => {
    return res.status(403).json({
        success: false,
        message: message || 'Forbidden',
    });
}

// ============================ notFound ==========================

const notFound = (res, message) => {
    return res.status(404).send({
        success: false,
        message: message,
    });
};

// ========================= conflictError ========================

const conflictError = (res, message) => {
    return res.status(409).send({
        success: false,
        message: message,
    });
};

// ================================================================

export {
    successOk,
    successOkWithData,
    created,
    createdWithData,
    catchError,
    validationError,
    sequlizeValidationError,
    frontError,
    backError,
    notFound,
    conflictError,
    UnauthorizedError,
    forbiddenError
};