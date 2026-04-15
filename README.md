# Brothers Kitchenware E-commerce Platform

A full-stack e-commerce application for "Brothers Kitchenware," an online kitchenware store built with React frontend and Node.js/Express backend.

## 🚀 Features

### User-Facing Features

- **Product Browsing**: Homepage with featured products, carousel, and category navigation
- **Shop Page**: Filter products by categories, search functionality
- **Product Details**: Detailed view with add-to-cart functionality
- **Shopping Cart**: Add/remove items, quantity management, checkout process
- **User Authentication**: Sign up and sign in with JWT-based authentication
- **Order Management**: View order history and status
- **Contact & Services**: Contact form submission and service information pages

### Admin Panel Features

- **Dashboard**: Overview with sales reports and analytics
- **Inventory Management**: View and manage product inventory
- **Product Management**: Create new products with details and images
- **Employee Management**: Add and manage store employees
- **Reports**: Sales and performance analytics

### Technical Features

- **Responsive Design**: Mobile-first approach with Bootstrap and Material-UI
- **Database Integration**: MySQL database with fallback to JSON data
- **Authentication**: Secure JWT-based auth for users and admins
- **API-First**: RESTful API endpoints for all operations
- **State Management**: React Context for global state
- **Protected Routes**: Route protection for authenticated areas

## 🛠 Tech Stack

### Frontend

- **React 19**: Modern React with hooks and JSX
- **Vite**: Fast build tool and development server
- **Material-UI & Bootstrap**: UI components and styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **TailwindCSS**: Utility-first CSS framework

### Backend

- **Node.js & Express**: Server-side JavaScript runtime and web framework
- **MySQL2**: Database driver with promise-based queries
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd brothers-kitchenware
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Configuration

### Database Setup

1. Create a MySQL database for the application
2. Run the initial setup script:
   ```bash
   mysql -u <username> -p <database_name> < src/sql/initial-queries.sql
   ```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
PORT=5000
JWT_SECRET=your_jwt_secret_key
USE_MEMORY=false  # Set to true to use JSON fallback instead of DB
```

## 🚀 Running the Application

1. **Start the Backend Server**

   ```bash
   cd server
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```

   The server will run on http://localhost:5000

2. **Start the Frontend**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## 📚 API Documentation

### Public Endpoints

- `GET /health` - Health check
- `GET /categories` - Get all product categories
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /landing` - Get featured/landing products
- `POST /contact` - Submit contact form

### Authentication Endpoints

- `POST /login` - User login
- `POST /signin` - User registration

### Admin Endpoints (Requires Admin Authentication)

- `GET /admin/dashboard` - Admin dashboard data
- `POST /admin/products` - Create new product
- `POST /admin/employees` - Add new employee
- `GET /admin/reports` - Sales reports

## 📁 Project Structure

```
brothers-kitchenware/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── Api/           # API configuration
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── ...
│   ├── data/              # Fallback JSON data
│   ├── package.json
│   └── server.js
└── README.md
```

## 🔮 Future Enhancements

### Planned Features

- **Payment Integration**: Stripe/PayPal integration for secure payments
-by telebirr or mpesa
- **Real-time Notifications**: WebSocket implementation for order updates
- **Advanced Search**: Elasticsearch integration for better product search
- **Wishlist**: User wishlist functionality
- **Product Reviews**: Customer reviews and ratings system
- **Inventory Alerts**: Low stock notifications for admin
- **Multi-language Support**: Internationalization (i18n)
- **Mobile App**: React Native companion app
- **Analytics Dashboard**: Advanced reporting with charts
- **Email Notifications**: Order confirmations and marketing emails
- **Social Login**: Google/Facebook authentication
- **Progressive Web App**: PWA features for better mobile experience
- **Order Tracking**: Real-time shipment status and delivery updates
- **Discounts & Coupons**: Promo codes, seasonal deals, and bundle pricing
- **Customer Support Chat**: Live chat or ticket-based support
- **Related Products & Recommendations**: Personalized suggestions for shoppers
- **Role-Based Admin Control**: Granular permissions for admin/employee users
- **SEO Optimization**: Improved metadata, crawling, and search engine visibility

### Technical Improvements

- **Testing**: Unit and integration tests with Jest
- **CI/CD**: Automated deployment pipeline
- **Docker**: Containerization for easier deployment
- **API Documentation**: Swagger/OpenAPI documentation
- **Caching**: Redis for performance optimization
- **Monitoring**: Application monitoring and error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Brothers Kitchenware Team

## 📞 Support

For support, email support@brotherskitchenware.com or create an issue in this repository.
