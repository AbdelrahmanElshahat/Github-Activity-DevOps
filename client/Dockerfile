FROM nginx:alpine

# Copy pre-built client files directly (Jenkins already built them)
COPY build/ /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]