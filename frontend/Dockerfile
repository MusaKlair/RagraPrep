FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

# The frontend runs on 3001 to avoid conflict with backend
CMD ["npm", "run", "dev", "--", "-p", "3001"]
