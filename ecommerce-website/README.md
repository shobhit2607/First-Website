# E-Commerce Website

A full-featured e-commerce website built with React frontend and Python Flask backend.

## Features

### Frontend (React)
- Modern, responsive design with Material-UI
- Product listing with search and filtering
- Product detail pages with reviews
- Shopping cart functionality
- User authentication (Login/Register)
- Checkout process
- Order management
- Mobile-friendly design

### Backend (Flask)
- RESTful API endpoints
- JWT-based authentication
- User management
- Product management
- Cart and order management
- Review system
- SQLite database

## Prerequisites

- Node.js (v14 or higher)
- Python 3.7 or higher
- pip (Python package manager)

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-website
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip3 install -r requirements.txt
```

Run the Flask application:

```bash
python3 app.py
```

The backend will be available at `http://localhost:8000`

### Quick Start (Alternative)

You can also use the provided startup script to run both backend and frontend:

```bash
./start.sh
```

This will start both the backend (port 8000) and frontend (port 3000) automatically.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

**Note**: If port 3000 is already in use, you can start the frontend on a different port:

```bash
PORT=3001 npm start
```

## Usage

1. **Browse Products**: Visit the homepage to see all available products
2. **Search & Filter**: Use the search bar and filters to find specific products
3. **View Product Details**: Click on any product to see detailed information and reviews
4. **Add to Cart**: Click "Add to Cart" to add products to your shopping cart
5. **User Authentication**: Register a new account or login with existing credentials
6. **Checkout**: Proceed to checkout to place an order
7. **View Orders**: Check your order history in the profile section

## Sample Data

The application comes with sample products including:
- Electronics (Headphones, Smart Watch, Bluetooth Speaker)
- Sports (Running Shoes, Yoga Mat)
- Home (Coffee Maker, Desk Lamp)
- Accessories (Laptop Backpack)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/<id>` - Get product details
- `GET /api/products/categories` - Get product categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/<id>` - Update cart item quantity
- `DELETE /api/cart/<id>` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders

### Reviews
- `POST /api/products/<id>/reviews` - Add product review

## Project Structure

```
ecommerce-website/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   └── ecommerce.db          # SQLite database (created on first run)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── README.md
└── README.md
```

## Technologies Used

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios
- React Hook Form

### Backend
- Python Flask
- SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- Flask-Bcrypt

### Database
- SQLite (development)
- Can be easily configured for PostgreSQL or MySQL

## Development

### Adding New Features

1. **Backend**: Add new routes in `app.py` and update database models as needed
2. **Frontend**: Create new components in the appropriate directories and update routing

### Database Migrations

The application uses SQLAlchemy with automatic table creation. For production, consider using Flask-Migrate for proper database migrations.

## Production Deployment

### Backend
1. Set up a production WSGI server (e.g., Gunicorn)
2. Configure environment variables for database and JWT secrets
3. Use a production database (PostgreSQL recommended)

### Frontend
1. Build the React app: `npm run build`
2. Serve the built files with a web server (e.g., Nginx)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.