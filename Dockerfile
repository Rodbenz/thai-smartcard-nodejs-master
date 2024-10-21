FROM node:20-alpine

# Install build tools and pcsc-lite development package
RUN apk add --no-cache make gcc g++ python3 pcsc-lite pcsc-lite-dev

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and rebuild pcsclite
RUN npm install --build-from-source @pokusew/pcsclite

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]
