FROM node:20-alpine

# Set working directory
WORKDIR /mcp-server

# Copy package.json and package-lock.json
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy only the necessary files
COPY src ./src
COPY node_modules ./node_modules

# Build the TypeScript project
RUN npm run build

RUN rm -rf ./src

# Set the command to run your application
CMD ["node", "dist/index.js", "run"]
