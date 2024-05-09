FROM node:14

WORKDIR /app/frontend

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Install serve globally
RUN npm install -g serve

# Build the application
RUN npm run build

# Define environment variables
ENV REACT_APP_BACKEND_HOST="https://api-service-actaewxzxa-og.a.run.app"

# Write environment variables to .env file
RUN echo "REACT_APP_BACKEND_HOST=${REACT_APP_BACKEND_HOST}" > .env

# Expose port 3000
EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "build"]
