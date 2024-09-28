import sequelize from '../../config/dbConfig.js';
import { DataTypes } from 'sequelize';
import bcrypt from "bcryptjs"

// Define a schema for the user with email and password fields
const User = sequelize.define('user', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,           // Makes this field mandatory
        unique: true,               // Ensures email addresses are unique in the database
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,           // Makes this field mandatory
    },
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
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
    },
    // use for email verification and password reset if needed
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    otp: {
        type: DataTypes.INTEGER,
    },
    otp_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    can_change_password: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
},
)

export default User;