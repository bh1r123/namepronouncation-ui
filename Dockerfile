# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY Server.js ./
#RUN npm install --silent
RUN npm install --slient
#RUN npm i express
# add app
COPY . ./

# start app
# RUN npm run build
CMD ["node", "Server.js"]