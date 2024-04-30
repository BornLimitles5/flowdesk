FROM node

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application

CMD ["npm", "run" , "start"]

#Build Project : docker build -t my-node-app .

#Start Project : docker run -p 3000:3000 my-node-app npm run dev
