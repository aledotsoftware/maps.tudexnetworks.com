# Dockerfile para el Frontend de Maps Tudex
FROM node:20-slim

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite (5173 por defecto)
EXPOSE 5173

# Comando para iniciar en modo desarrollo con host expuesto
CMD ["npx", "vite", "--host"]
