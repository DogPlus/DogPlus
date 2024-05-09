FROM node:14

WORKDIR /app/frontend

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Write environment variables to .env file
RUN echo "REACT_APP_BACKEND_HOST='https://api-service-actaewxzxa-og.a.run.app'" > .env

# Install serve globally
RUN npm install -g serve

# Build the application
RUN npm run build


# Expose port 3000
EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "build"]
