# ══════════════ STAGE 1: BUILD ══════════════
# Uses Node to install the dependencies and build the static files
# This stage is discarded after the build (multi-stage build)
FROM node:22-alpine AS build

WORKDIR /app

# Copy the package files first — Docker caches this layer
# Dependencies only re-install when package-lock.json changes
COPY package.json package-lock.json ./
RUN npm ci

# Copy the source and build the production files into /app/dist
COPY . .
RUN npm run build

# ══════════════ STAGE 2: RUN ══════════════
# Uses nginx to serve the built files — no Node, no source code
# Final image is ~80MB instead of ~800MB
FROM nginx:alpine

# Replace the default site with the one that knows the router and the API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the built files from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Document that nginx serves on port 80
EXPOSE 80

# Run nginx in the foreground so it receives SIGTERM properly
CMD ["nginx", "-g", "daemon off;"]
