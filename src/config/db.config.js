import chalk from "chalk";
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { dbUrl, nodeEnv } from "./initial.config.js";

const dialectOptions = {
    connectTimeout: 60000,
    timezone: "Asia/Karachi",
};

// Enable SSL for RDS, only in production
if (nodeEnv === "production") {
    dialectOptions.ssl = {
        require: true,
        ca: fs.readFileSync(path.resolve("./rds-global-bundle.pem")).toString()
    };
}

const sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    define: { underscored: true },
    // Environment-based logging (disable in production)
    logging: nodeEnv !== "production" ? (msg) => console.log(chalk.blue(msg)) : false,
    retry: {
        max: 3,
        match: [
            Sequelize.ConnectionError,
            Sequelize.ConnectionRefusedError,
            Sequelize.TimeoutError,
            Sequelize.ConnectionAcquireTimeoutError,
        ],
    },
    dialectOptions,
    pool: {
        max: 3,
        min: 1,
        acquire: 60000,
        idle: 10000
    }
});

// Connect function
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        // Log success message in green
        console.log(chalk.green.bold("Connected to the database"));
        console.log(chalk.green.bold("============================================================"));
        await sequelize.sync();
        console.log(chalk.green.bold("Models synced successfully"));
        console.log(chalk.green.bold("============================================================"));
    } catch (error) {
        // Log error message in red and exit the application
        console.log(chalk.red.bold("Error connecting to database "), error);
        console.log(chalk.green.bold("============================================================"));
        process.exit(1);
    }
};

export default sequelize;
