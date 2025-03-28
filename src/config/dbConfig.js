// Import required modules and configuration
import chalk from "chalk";
import { Sequelize } from "sequelize";
import { dbUrl, nodeEnv } from "./initialConfig.js";

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  define: { underscored: true },
  // Environment-based logging (disable in production)
  logging: nodeEnv !== "production"
    ? (msg) => console.log(chalk.blue(msg))
    : false,
  retry: {
    max: 3,
    match: [
      Sequelize.ConnectionError,
      Sequelize.ConnectionRefusedError,
      Sequelize.TimeoutError,
      Sequelize.ConnectionAcquireTimeoutError,
    ],
  },
  dialectOptions: {
    connectTimeout: 60000,
    timezone: "Asia/Karachi",
  },
  pool: {
    max: 5,
    min: 1,
    acquire: 60000,
    idle: 10000
  }
});
// Async function to connect to the MongoDB database
export const connectDB = async () => {
  try {
    // Connect to the database with the provided URL and name
    await sequelize.authenticate();
    // Log success message in green
    console.log(`${chalk.green.bold("Connected to the database")}`);
    console.log(`${chalk.green.bold("============================================================")}`);
    await sequelize.sync();
    console.log(`${chalk.green.bold("Models synced successfully")}`);
    console.log(`${chalk.green.bold("============================================================")}`);
  } catch (error) {
    // Log error message in red and exit the application
    console.log(`${chalk.red.bold("Error")} connecting to database `, error);
    console.log(`${chalk.green.bold("============================================================")}`);
    process.exit(1);
  }
};
// Export the connectDB function
export default sequelize;
