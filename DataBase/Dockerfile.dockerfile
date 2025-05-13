# TGK-1/backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование остальных файлов
COPY . .

# Настройка переменных окружения для PostgreSQL
ENV DATABASE_URL=postgresql://postgres:password@db:5432/tgk_db

# Запуск сервера
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]