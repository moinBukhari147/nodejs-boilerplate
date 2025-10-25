import Sequelize from 'sequelize';

// ================================================================
// ===================== success responses ========================
// ================================================================

const successOk = (res, message = "Request processed successfully.") => {
    return res.status(200).send({
        success: true,
        message,
    });
};

// ===================== successOkWithData ========================

const successOkWithData = (res, data, message = "Request processed successfully.") => {
    return res.status(200).send({
        success: true,
        message,
        data: data,
    });
};

// =========================== created ============================

const created = (res, message = "Resource created successfully.") => {
    return res.status(201).send({
        success: true,
        message,
    });
};

// ======================= createdWithData ========================

const createdWithData = (res, data, message = "Resource created successfully.") => {
    return res.status(201).send({
        success: true,
        message,
        data: data,
    });
};



// ================================================================
// ======================= error 400 responses ========================
// ================================================================

// ======================== validationError =======================

const validationError = (res, message, key = "message") => {
    return res.status(400).send({
        success: false,
        type: "user",
        error: { [key]: message },
    });
};

// ======================== validationErrorObj =======================
// This will be used when we have to send multiple errors in response.
const validationErrorObj = (res, errorObj) => {
    return res.status(400).send({
        success: false,
        type: "user",
        error: errorObj,
    });
};



// ========================= frontError ===========================

const frontError = (res, message, key = "message") => {
    return res.status(400).send({
        success: false,
        type: "frontend",
        error: { [key]: message },
    });
};
// ========================= frontErrorObj ===========================
// This will be used when we have to send multiple errors in response.
const frontErrorObj = (res, errorObj) => {
    return res.status(400).send({
        success: false,
        type: "frontend",
        error: errorObj,
    });
};

// ========================== backError ===========================
// This will be used when we are calling the other external Api's from backend And facing an issue.

const backError = (res, message) => {
    return res.status(400).send({
        success: false,
        type: "backend",
        error: { message },
    });
};

// ============================ UnauthorizedError ==========================

const UnauthorizedError = (res, message = 'Access denied. You are not authorized.') => {
    return res.status(401).json({
        success: false,
        type: "user",
        error: { message },
    });
}

// ============================ forbiddenError ==========================

const forbiddenError = (res, message = 'Forbidden, You do not have permission to access this resource.') => {
    return res.status(403).json({
        success: false,
        type: "user",
        error: { message },
    });
}

// ============================ notFound ==========================

const notFound = (res, message = 'Resource not found.') => {
    return res.status(404).send({
        success: false,
        type: "user",
        error: { message },
    });
};

// ============================ notFoundRoute ==========================

const notFoundRoute = (res, message = 'Resource not found.') => {
    return res.status(404).send({
        success: false,
        type: "frontend",
        error: { message },
    });
};

// ========================= conflictError ========================

const conflictError = (res, message = 'Conflict. Resource already exists.') => {
    return res.status(409).send({
        success: false,
        type: "user",
        error: { message },
    });
};

// ========================= tooManyRequests ========================

const tooManyRequestsError = (res, message = 'Too many requests. Please wait before trying again.') => {
    const defaultError = {};
    return res.status(429).send({
        success: false,
        type: "user",
        error: message,
    });
};

// ========================= paymentRequiredError ========================

const paymentRequiredError = (res, message = 'Payment required to access this resource.') => {
    return res.status(402).send({
        success: false,
        type: "user",
        error: { message },
    });
};


// ======================== sequelizeValidationError =======================

const sequelizeValidationError = (res, error) => {
    const errorMessage = error.errors[0].message;
    const key = error.errors[0].path
    return validationError(res, errorMessage, key);
};

// ======================== sequelizeValidationError =======================

const sequlizeFrontError = (res, error) => {
    const errorMessage = error.errors[0].message;
    const key = error.errors[0].path
    return frontError(res, errorMessage, key);
};

// ================================================================
// ======================= error 500 responses ========================
// ================================================================

// ========================= catchError ===========================
const catchError = (res, error) => {
    return res.status(500).send({
        success: false,
        type: "backend",
        error: { message: 'Internal server error.' || error.message },
    });
};


// ========================= catchWithSequelizeFrontError ===========================

const catchWithSequelizeFrontError = (res, error) => {
    if (error instanceof Sequelize.ValidationError) return sequlizeFrontError(res, error);
    if (error.errors && error.errors[0].errors instanceof Sequelize.ValidationError) return frontError(res, error.errors[0].message)
    if (error.name === 'SequelizeForeignKeyConstraintError') return frontError(res, "Fogreign key voilates. Making a relation with value that not exit.", error.parent?.constraint);
    if (error.name === 'SequelizeDatabaseError') return frontError(res, error.message, "database");
    return catchError(res, error);
};


// ========================= catchWithSequelizeValidationError ===========================

const catchWithSequelizeValidationError = (res, error) => {
    if (error instanceof Sequelize.ValidationError) return sequelizeValidationError(res, error);
    if (error.errors && error.errors[0].errors instanceof Sequelize.ValidationError) return sequelizeValidationError(res, error)
    if (error.name === 'SequelizeForeignKeyConstraintError') return validationError(res, "Selecting or seding a value that not exits.", "foreign_key");
    if (error.name === 'SequelizeDatabaseError') return validationError(res, error.message);
    return catchError(res, error);
};



export {
    backError,
    catchError,
    catchWithSequelizeFrontError,
    catchWithSequelizeValidationError,
    created,
    createdWithData,
    conflictError,
    frontError,
    frontErrorObj,
    forbiddenError,
    notFound,
    notFoundRoute,
    successOk,
    successOkWithData,
    sequlizeFrontError,
    sequelizeValidationError,
    tooManyRequestsError,
    UnauthorizedError,
    validationError,
    validationErrorObj
};