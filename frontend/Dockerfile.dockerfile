# TGK-1/frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копирование package.json и package-lock.json
COPY ./frontend/package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов
COPY ./frontend/ .

# Сборка проекта (если нужно)
# RUN npm run build

# Запуск приложения
CMD ["npm", "start"]