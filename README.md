# 🚀 Express.js Authentication Boilerplate

A ready-to-use **Express.js boilerplate** designed for rapid development, featuring built-in authentication strategies and best practices for production-ready Node.js applications.

---

## ✨ Features

- 🛡 **Security**
  - Helmet for secure HTTP headers.
  - Rate limiting via express-rate-limit to prevent brute-force & DDOS attacks.
  - CORS configuration for controlled cross-origin requests.
  - **Database-level locking** to prevent race conditions during sensitive operations (e.g., OTP verification).
  - **Brute-force protection for OTP verification** with attempt limits and cooldowns.

- 📦 **Optimized Performance**
  - Response compression with compression.
  - JSON body parsing and cookie handling via cookie-parser.

- 🗄 **Database**
  - Configured for PostgreSQL with Sequelize ORM.

- 🔐 **Authentication Support**
  - JWT authentication using fast-jwt.
  - Email-based OTP verification via Nodemailer.
  - Optional OAuth integration with Google & Facebook (commented for easy enablement).

- 🛠 **Developer Experience**
  - Logging with "morgan" and colorful console output using "chalk".
  - Nodemon for automatic server restarts during development.
  - Environment variables using **dotenv**
  - Sample_env file for easy setup.

- 📤 **File Upload Handling**
  - Multer setup for handling file uploads with size and format validation.

- ✅ **Request Validation**
  - Integrated validation with express-validator and Joi.
  - Validation function to verify the required fields and extract only the fields to update.
  - Standard API response structure with semantic function for each response that also increases code readability.

- 📡 **Static File Serving**
  - Easily serve static assets via Express middleware.

- 🛑 **Global Error Handling**
  - Centralized error handling for consistent API responses.


## 📂 Project Structure

```plaintext
src/
│── config/           # Environment variables initial config, DB, email, jwt, multer 
│── controllers/      # Request handlers
│── middlewares/      # Authentication & Other middlewares
│── routes/           # API route definitions
│── strategies/       # Passport strategies (Google, Facebook) commented
│── utils/            # Utility functions & built-in helper function and api responses with proper structure
│── app.js            # Express app entry point
```

#
# Setup and Installation
 ## NVM Installation
 - Open the project and navigate to the project directory in the terminal.
 - Install the nvm (Node version manager) and install node with the help of nvm
   ### For Mac
   ```zsh
     brew update
     brew install nvm
     nvm --version
   ```
   Once installed, you need to add nvm to your shell configuration file (~/.zshrc if using zsh)
   ```zsh
     echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
     echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
     echo '[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"' >> ~/.zshrc
   ```
  ```zsh
      source ~/.zshrc
  ```
  ```zsh
      nvm --version
  ```
  ### For Windows
  ```
    choco install nvm
    nvm version
  ```
## Node Installation
### Now the setup is same for both:
- To install the latest version of Node.
  ```
    nvm install lts
  ```
- Install the specific version of Node.
  ```
    nvm ls-remote                       # check all the available versions for installation
    nvm install version_number          # write the specific version number to be installed.
  ```
- Set the specific Node.js version for the current project directory
  1. Create an .nvmrc file inside your project directory:
  ```
  echo 18 > .nvmrc  # Replace 18 with your version
  ```
  2. Whenever you enter the directory, run:
  ```
    nvm use
    node -v     # verify node version
  ```
- Or set the global version
  ```
    nvm alias default node_version
  ```
## Package Installation and Setup
- Update package.json with Latest Versions:
  ```
    npx npm-check-updates -u
  ```
- Install the Updated Dependencies:
  ```
    npm install
  ```
- Rename the .sample_env to .env and set up the required environment variables.
- Run the command to start the project:
  ```
    npm run dev
  ```
  


