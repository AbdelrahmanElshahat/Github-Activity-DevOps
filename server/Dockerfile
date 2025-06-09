FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy pre-built server files 
COPY . .

# Expose API port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
