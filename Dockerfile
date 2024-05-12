# Use the official Node.js image from Docker Hub with Node.js version 22 and Alpine Linux
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Set the PORT environment variable
ENV PORT=8080

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["npm", "start"]