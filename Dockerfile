# Use Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose app port
EXPOSE 3000

# Set a default version (can be overridden during build or run)
ENV VERSION="Blue v1"

# Start the app
CMD ["npm", "start"]
