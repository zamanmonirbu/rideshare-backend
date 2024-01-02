# Niye Jao Backend

Niye Jao Backend serves as the backend infrastructure for the Niye Jao ride-sharing platform. It handles user authentication, trip details processing, rider profiles, and communication with the frontend.

## Features

1. **User Authentication**: Secure login for users with JWT token generation.
2. **Trip Details Processing**: Handle user input for starting location, destination, and provide trip information.
3. **Rider Profiles**: Create, read, update, and delete rider profiles with vehicle information.
4. **Middleware**: Utilizes bcrypt for password hashing, body-parser for request body parsing, cors for Cross-Origin Resource Sharing.
5. **Environmental Variables**: Securely manage environment variables using dotenv.

## Technology Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- bcrypt, body-parser, cors, dotenv, jsonwebtoken for authentication

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `PORT`: Port on which the server will run.
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT token generation.

## Contributing

Feel free to contribute to the development of Niye Jao Backend. Create a fork, make your changes, and submit a pull request!

## Social Links

Connect with me:

- [LinkedIn](www.linkedin.com/in/mdmoniruzzamanbu)
- [Netlify](https://moniruzzamanbu.netlify.app/)
- [Medium](https://medium.com/@zamanmonirbu)
