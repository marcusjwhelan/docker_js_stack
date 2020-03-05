FROM node:13.8.0-alpine3.11

# change working directory to the app directory
WORKDIR /app

# copy all files in current directory to working directory
COPY package*.json ./

# install npm
RUN npm install -qy

COPY . .

# expose Port to network
EXPOSE 8000

# run on
CMD ["npm", "run", "start"]