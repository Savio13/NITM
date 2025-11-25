FROM node:18

WORKDIR /app

# Install deps early
COPY package*.json ./
RUN npm ci --production=false || true

# Copy rest of app
COPY . .

# Generate prisma client (if prisma is available in the image)
RUN npx prisma generate || true

EXPOSE 4000

CMD ["npm", "run", "dev"]
