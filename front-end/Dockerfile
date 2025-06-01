# Multi-stage build for production
FROM node:23.11-alpine AS builder

WORKDIR /app

# Configure Alpine repositories and npm for better reliability
RUN echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main" > /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/community" >> /etc/apk/repositories && \
    echo "http://mirrors.edge.kernel.org/alpine/latest-stable/main" >> /etc/apk/repositories && \
    echo "http://mirrors.edge.kernel.org/alpine/latest-stable/community" >> /etc/apk/repositories

# Configure npm for better reliability
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-timeout 300000 && \
    npm config set maxsockets 10

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with retry logic
RUN for i in 1 2 3 4 5; do \
    echo "Attempt $i: Installing npm packages..." && \
    npm ci --timeout=300000 && break || \
    (echo "Retry $i: Failed to install npm packages, cleaning cache and retrying in 20s..." && \
     npm cache clean --force && rm -rf node_modules && sleep 20); \
    done

# Verify dependencies installed (but don't fail if some devDependencies are missing)
RUN npm list --depth=0 || true

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Copy production environment
COPY .env.production .env

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist/

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 3000;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # CORS headers for API calls
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization, X-Requested-With" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        application/javascript
        application/json
        text/css
        text/javascript
        text/xml
        text/plain;
}
EOF

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]