FROM node:16-alpine

WORKDIR /example

# Install deps
COPY package.json ./
RUN npm install

# Include app source
COPY .. .

# Run
CMD ["node", "login.js"]
