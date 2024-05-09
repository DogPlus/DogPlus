FROM node:14

WORKDIR /app/frontend

COPY package.json .

RUN npm install

COPY . .

# Define environment variables
ENV REACT_APP_BACKEND_HOST="https://api-service-actaewxzxa-og.a.run.app"
# Add any other environment variables here if needed

# Write environment variables to .env file
RUN echo "REACT_APP_BACKEND_HOST=${REACT_APP_BACKEND_HOST}" > .env
# Add any other environment variables if needed

EXPOSE 3000

CMD ["npm", "start"]
