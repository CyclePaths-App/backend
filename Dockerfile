# https://www.docker.com/blog/how-to-dockerize-react-app/
# https://medium.com/@robinviktorsson/containerizing-a-typescript-node-js-application-with-docker-a-step-by-step-guide-be7fc87191f8

# Build Stage
FROM node:24-alpine AS builder
# Make the working directory inside the container
WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force
# Move code into container
COPY . .
# Build the app.
RUN npm run build

# Main Stage
FROM node:24-alpine
# Init working directory.
WORKDIR /app
# Install dependencies to main stage.
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
# Copy compiled JavaScript from builder.
COPY --from=builder /app/dist ./
# Open up the port. TODO: flexible exposed port.
EXPOSE 8000
# Run Backend.
CMD ["node", "src/index.js"]