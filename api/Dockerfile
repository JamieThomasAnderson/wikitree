# Dockerfile-backend
# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install && npm install -g nodemon

# Copy the rest of the application code to the working directory
COPY . .

# Make port 3001 available outside the container
EXPOSE 3001

# Define the command to run the application
CMD [ "nodemon", "start" ]