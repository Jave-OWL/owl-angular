# Etapa de construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Etapa de producción  
FROM nginx:alpine

# Limpiar archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# COPIAR DESDE LA CARPETA BROWSER - Esto es clave para Angular 18
COPY --from=build /app/dist/owl-angular/browser/ /usr/share/nginx/html/

# Verificar que se copió correctamente
RUN echo "=== VERIFICANDO ARCHIVOS COPIADOS ==="
RUN ls -la /usr/share/nginx/html/
RUN echo "=== INDEX.HTML CONTENT (primeras líneas) ==="
RUN head -10 /usr/share/nginx/html/index.html

# Configuración Nginx
RUN echo 'events { worker_connections 1024; }' > /etc/nginx/nginx.conf
RUN echo 'http {' >> /etc/nginx/nginx.conf
RUN echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf
RUN echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf
RUN echo '    server {' >> /etc/nginx/nginx.conf
RUN echo '        listen 80;' >> /etc/nginx/nginx.conf
RUN echo '        server_name localhost;' >> /etc/nginx/nginx.conf
RUN echo '        root /usr/share/nginx/html;' >> /etc/nginx/nginx.conf
RUN echo '        index index.html;' >> /etc/nginx/nginx.conf
RUN echo '        ' >> /etc/nginx/nginx.conf
RUN echo '        # Configuración para Angular Router' >> /etc/nginx/nginx.conf
RUN echo '        location / {' >> /etc/nginx/nginx.conf
RUN echo '            try_files $uri $uri/ /index.html;' >> /etc/nginx/nginx.conf
RUN echo '        }' >> /etc/nginx/nginx.conf
RUN echo '        ' >> /etc/nginx/nginx.conf
RUN echo '        # Proxy para API' >> /etc/nginx/nginx.conf
RUN echo '        location /api/ {' >> /etc/nginx/nginx.conf
RUN echo '            proxy_pass http://owl-backend:8080/;' >> /etc/nginx/nginx.conf
RUN echo '            proxy_set_header Host $host;' >> /etc/nginx/nginx.conf
RUN echo '            proxy_set_header X-Real-IP $remote_addr;' >> /etc/nginx/nginx.conf
RUN echo '        }' >> /etc/nginx/nginx.conf
RUN echo '    }' >> /etc/nginx/nginx.conf
RUN echo '}' >> /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]