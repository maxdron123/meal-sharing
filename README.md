# 🍽️ Meal Sharing App

> **A community-driven platform connecting food lovers through authentic home-cooked dining experiences**

## 🌟 Overview

The Meal Sharing App transforms the way people connect through food by creating a trusted marketplace for authentic dining experiences. Whether you're a culinary enthusiast wanting to share your cooking or a food lover seeking unique local experiences, this platform brings communities together one meal at a time.

### ✨ Key Features

- **🏠 Home-Cooked Experiences**: Discover authentic meals prepared by local hosts
- **🔍 Smart Discovery**: Advanced search and filtering by cuisine, price, location, and availability
- **📱 Responsive Design**: Seamless experience across all devices with mobile-first approach
- **⭐ Trust System**: Comprehensive review and rating system for hosts and guests
- **🔐 Secure Authentication**: JWT-based authentication with persistent sessions
- **📸 Visual Experience**: High-quality meal imagery with intelligent compression
- **💬 Community Reviews**: Detailed guest feedback and host reputation building
- **📊 Real-Time Availability**: Dynamic spot calculation and instant booking confirmation

## 🎯 User Journey

### For Guests

1. **Discover** meals through intuitive browsing and smart search
2. **Explore** detailed meal pages with photos, host info, and authentic reviews
3. **Book** instantly with real-time availability and secure reservations
4. **Experience** unique dining and connect with local food culture
5. **Review** and contribute to the community trust system

### For Hosts

1. **Create** compelling meal listings with photos and descriptions
2. **Manage** availability, pricing, and guest capacity
3. **Connect** with food enthusiasts in their community
4. **Build** reputation through guest reviews and ratings
5. **Track** bookings and earnings through personal dashboard

## 🛠️ Technical Architecture

### Frontend (Next.js + React)

- **Framework**: Next.js 14+ with App Router for optimal performance
- **Styling**: CSS Modules with modern glassmorphism design
- **State Management**: React Context API with JWT authentication
- **Components**: Modular, reusable component architecture
- **Performance**: Server-side rendering, image optimization, lazy loading

### Backend (Node.js + Express)

- **API**: RESTful design with comprehensive error handling
- **Authentication**: JWT tokens with refresh mechanism
- **Database**: PostgreSQL with optimized queries and indexing
- **Security**: Input validation, SQL injection prevention, CORS configuration
- **File Handling**: Base64 image storage with compression

### Database Design

```sql
meals ↔ reservations (1:many)
meals ↔ reviews (1:many)
users ↔ meals (1:many)
users ↔ reservations (1:many)
users ↔ reviews (1:many)
```

## 🚀 Live Demo

**🌐 Production App**: [https://dist-0jkg.onrender.com](https://dist-0jkg.onrender.com)

**🔗 API Endpoint**: [https://meal-sharing-api-wpfg.onrender.com/api/meals](https://meal-sharing-api-wpfg.onrender.com/api/meals)

### Demo Credentials

- Create your own account or explore the public meal listings
- Full guest and host functionality available

### User Experience

- **Seamless Onboarding**: Quick registration with immediate access to features
- **Trust & Safety**: Comprehensive review system with verified host profiles
- **Real-Time Feedback**: Instant availability updates and booking confirmations
- **Community-Driven**: Social proof through authentic guest experiences

## 🔧 Technical Highlights

### Most Interesting Technical Challenge: Image Management

**Problem**: Creating seamless image upload without external services while maintaining performance.

**Solution**:

- Client-side image compression using HTML5 Canvas
- Base64 storage in PostgreSQL for simplicity
- Automatic image optimization and responsive display
- Fallback handling for broken images

**Implementation**: See `/app-next/app/my-meals/CreateMealForm.js`

### Complex Features Implemented

#### 1. Dynamic Availability System

```sql
SELECT m.*,
  (m.max_reservations - COALESCE(SUM(r.number_of_guests), 0)) as available_spots
FROM meals m
LEFT JOIN reservations r ON m.id = r.meal_id
GROUP BY m.id;
```

#### 2. Advanced Search & Filtering

- Multi-criteria filtering (price, location, cuisine, availability)
- Real-time search with debounced input
- SQL optimization for fast query performance

#### 3. Authentication Flow

- JWT-based authentication with refresh tokens
- Persistent sessions across page refreshes
- Protected routes with middleware
- Secure token handling with HTTP-only cookies

#### 4. Review Aggregation

- Real-time rating calculations
- Review sorting and pagination
- Spam prevention and content moderation

## 🌟 Key Learning Outcomes

### Frontend Development

- **Next.js App Router**: Modern React framework with server-side rendering
- **Component Architecture**: Reusable, maintainable component design
- **State Management**: Context API for global state with local component state
- **CSS Modules**: Scoped styling preventing conflicts and improving maintainability
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

### Backend Development

- **RESTful API Design**: Proper HTTP methods, status codes, and error handling
- **Database Optimization**: Complex queries, indexing, and relationship management
- **Authentication & Security**: JWT implementation, input validation, SQL injection prevention
- **File Handling**: Image processing, compression, and storage strategies

### Full-Stack Integration

- **API Integration**: Seamless communication between frontend and backend
- **Error Handling**: Comprehensive error management across the application
- **Performance Optimization**: Image compression, lazy loading, efficient queries
- **Deployment**: Production deployment with environment configuration

## 🚀 Production Deployment

### Live Application

- **Frontend**: Deployed on Render with optimized build
- **Backend**: Express API on Render with PostgreSQL database
- **Database**: Managed PostgreSQL with automated backups
- **CDN**: Static asset optimization and global distribution

## 🏆 Project Impact

This project demonstrates:

- **Full-Stack Expertise**: End-to-end application development with modern technologies
- **User-Centered Design**: Focus on real user needs and seamless experiences
- **Production Quality**: Deployment-ready code with proper error handling and security
- **Community Building**: Platform that genuinely connects people through shared experiences
- **Technical Excellence**: Clean code, proper architecture, and scalable design patterns

## 🤝 Contributing

This project showcases production-ready development practices:

1. **Code Quality**: ESLint and Prettier for consistent formatting
2. **Error Handling**: Comprehensive error management and user feedback
3. **Security**: Input validation, SQL injection prevention, secure authentication
4. **Performance**: Optimized queries, image compression, lazy loading
5. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

_Built with ❤️ for food lovers and community builders_
