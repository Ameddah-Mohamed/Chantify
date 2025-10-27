# Chantify


## Project Structure
```
chantify/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── db/               # Database configuration
│   ├── lib/              # Utility functions
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Application entry point
├── frontend/             # Frontend application
└── package.json          # Project dependencies
```

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Ameddah-Mohamed/Chantify.git
cd Chantify
```

### 2. Install Dependencies

Run the following command in the root directory to install all required packages:
```bash
npm install
```

This will install the following dependencies:
- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- Bcrypt.js - Password hashing
- Cloudinary - Image management
- Cookie-parser - Cookie handling
- CORS - Cross-origin resource sharing
- Dotenv - Environment variable management

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:
```env
PORT=8000
MONGODB_URI=I-will-send-it-to-you
JWT_SECRET=your_jwt_secret_key


### 4. Run the Development Server

Start the server:
```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 8000).


## Available Scripts

- `npm run dev` - Starts the development server with nodemon (auto-reload on file changes)

## API Endpoints

The application includes the following route groups:

- **Authentication Routes** (`/api/auth`) - User registration, login, logout
- **User Routes** (`/api/users`) - User management
- **Company Routes** (`/api/company`) - Company management

## Database Models

- **User Model** - User authentication and profile data
- **Company Model** - Company information
- **Invitation Model** - Company invitation system


## Troubleshooting

**Port already in use:**
If you get a port conflict error, change the PORT value in your `.env` file.

**MongoDB connection failed:**
Ensure your MongoDB instance is running and the connection string in `.env` is correct.

**Module not found errors:**
Delete `node_modules` and `package-lock.json`, then run `npm install` again.

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Test thoroughly
4. Submit a pull request



## Contact

For issues and questions, please use the [GitHub Issues](https://github.com/Ameddah-Mohamed/Chantify/issues) page.
