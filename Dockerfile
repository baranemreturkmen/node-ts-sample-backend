FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Sertifika kullanmıyorsanız eğer bu satırı kaldırabilirsiniz
COPY certs certs

# .env dosyasını production'da dışarıdan vereceğiz, localde varsa kopyalanır
COPY .env .env

EXPOSE 3000

CMD ["npm", "run","dev"]