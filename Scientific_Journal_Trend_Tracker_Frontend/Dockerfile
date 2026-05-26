# Stage 1: Build the Vite React App
FROM node:18-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
# (Note: .env file will be copied and used by Vite to bake the VITE_API_BASE_URL into the build)
RUN npm run build

# Stage 2: Serve the App using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration to handle React Router SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
