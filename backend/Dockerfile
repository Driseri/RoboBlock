FROM python:3.11-slim

# Установка arduino-cli
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz && \
    tar -xzf arduino-cli_latest_Linux_64bit.tar.gz && \
    mv arduino-cli /usr/local/bin/ && \
    rm arduino-cli_latest_Linux_64bit.tar.gz

# Установка Python-зависимостей
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходников
COPY app ./app

# Инициализация платформы Arduino Uno
RUN arduino-cli core update-index && \
    arduino-cli core install arduino:avr

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 