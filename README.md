# express-auth-boilerplate

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
  ### For windows
  ```
    choco install nvm
    nvm version
  ```
## Node Installation
### Now setup same for both
- To install the lates version of node.
  ```
    nvm install lts
  ```
- Install the specific version of node.
  ```
    nvm ls-remote                       # check all the avaiable version for installation
    nvm install version_number          # wrtie the specific version number to be installed.
  ```
- Set the specific Node.js version for currect project directory
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
## Package Installation and setup
- Update package.json with Latest Versions:
  ```
    npx npm-check-updates -u
  ```
- Install the Updated Dependencies:
  ```
    npm install
  ```
- Rename the .sample_env to .env and setup the required enviroment variables.
- Run the command to start project:
  ```
    npm run dev
  ```
  
