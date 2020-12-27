FROM node:14.15.1-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 4200 49153
CMD npm run start