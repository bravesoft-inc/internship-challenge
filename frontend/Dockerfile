FROM node:22.11-alpine

RUN npm install -g pnpm
RUN pnpm config set store-dir /tmp/pnpm/store

# Set working directory
WORKDIR /app

# Expose port 3030
EXPOSE 3030

# Start the application
# CMD ["npm", "run", "dev"]
