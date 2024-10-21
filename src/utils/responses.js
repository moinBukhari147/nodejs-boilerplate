import Sequelize from 'sequelize';

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
// ======================= error 400 responses ========================
// ================================================================

// ======================== validationError =======================

const validationError = (res, message, field) => {
    return res.status(400).send({
        success: false,
        error: "user",
        field: field,
        message: message,
    });
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
        message: error.message || "Internal server error",
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
    successOk,
    successOkWithData,
    created,
    createdWithData,
    validationError,
    frontError,
    backError,
    notFound,
    conflictError,
    UnauthorizedError,
    forbiddenError,
    sequelizeValidationError,
    sequlizeFrontError,
    catchError,
    catchWithSequelizeFrontError,
    catchWithSequelizeValidationError
};