import sequelize from '../../config/db.config.js';
import { DataTypes } from 'sequelize';

// Define a schema for the user with email and password fields
const User = sequelize.define('user', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,           // This field is mandatory
        unique: { msg: "Email address already in use." },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,           // This field is mandatory
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        validate: {
            isIn: {
                args: [['male', 'female', 'other']],
                msg: "Gender must be either 'male', 'female', or 'other'."
            }
        },
        allowNull: true,
    },
    // use for email verification and password reset if needed
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    otp: {
        type: DataTypes.INTEGER,
    },
    otpCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    canChangePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

},
)

export default User;

// ==========================================
// Hooks
// ==========================================
// User.beforeValidate((user) => {
//     if (user.firstName) user.firstName = user.firstName.toLowerCase();
//     if (user.lastName) user.lastName = user.lastName.toLowerCase();
// });

// User.beforeSave((user) => {
//     if (user.firstName) user.firstName = user.firstName.toLowerCase();
// });