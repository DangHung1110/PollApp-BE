# Sử dụng image Node chính thức
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /Pollapp

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependency
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Mở cổng (ví dụ 3000)
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["npx", "nodemon", "index.js"]

