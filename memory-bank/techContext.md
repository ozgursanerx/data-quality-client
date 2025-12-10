# Technical Context: Flowlytics

## Technology Stack Overview

Flowlytics is built using modern web technologies with a focus on performance, scalability, and professional user experience. The application follows industry best practices and leverages proven frameworks and libraries.

### Frontend Technologies

#### Core Framework
- **React 19.0.0**: Latest React with concurrent features
  - Hooks-based architecture
  - Functional components
  - Context API for state management
  - Suspense for code splitting

#### UI Framework
- **CoreUI React 5.5.0**: Professional React admin template
  - Comprehensive component library
  - Bootstrap 5 integration
  - Responsive design system
  - Dark/light theme support

#### Visualization Libraries
- **ReactFlow 11.11.4**: Interactive node-based visualizations
  - Data lineage graphs
  - Custom node types
  - Zoom and pan functionality
  - Minimap support

- **D3.js 7.9.0**: Advanced data visualizations
  - Custom charts and graphs
  - Performance analytics
  - Interactive data exploration
  - SVG-based rendering

- **Chart.js 4.4.9**: Standard charting library
  - Dashboard metrics
  - Time series data
  - Real-time updates
  - Responsive charts

#### Routing and Navigation
- **React Router DOM 7.1.5**: Client-side routing
  - Code splitting support
  - Nested routing
  - Protected routes
  - History management

#### HTTP Client
- **Axios 1.9.0**: HTTP request library
  - Request/response interceptors
  - Error handling
  - Request cancellation
  - TypeScript support

### Backend Technologies

#### Runtime and Framework
- **Node.js**: JavaScript runtime environment
- **Express.js 4.18.2**: Web application framework
  - RESTful API endpoints
  - Middleware support
  - CORS configuration
  - Request validation

#### Integration and Protocols
- **MCP (Model Context Protocol)**: Data analysis integration
  - Python server communication
  - Process management
  - Data flow analysis
  - Backward tracing capabilities

#### Logging and Monitoring
- **Winston 3.11.0**: Logging library
  - Structured logging
  - Multiple transports
  - Log levels and filtering
  - Error tracking

### Development Tools

#### Build System
- **Vite 6.1.0**: Next-generation build tool
  - Fast development server
  - Hot module replacement
  - Optimized production builds
  - Plugin ecosystem

#### Code Quality
- **ESLint 9.20.1**: JavaScript linting
  - React-specific rules
  - Code style enforcement
  - Error prevention
  - IDE integration

- **Prettier 3.5.1**: Code formatting
  - Consistent code style
  - Automatic formatting
  - IDE integration
  - Team collaboration

#### Styling
- **Sass 1.85.0**: CSS preprocessor
  - Variables and mixins
  - Nested rules
  - Modular stylesheets
  - CoreUI theme customization

### Data Processing

#### File Formats
- **JSON**: Configuration and data exchange
- **CSV**: Data export capabilities
- **CLOB**: Large text data handling (SQL_FULL_TEXT)

#### Data Sources
- **EDW.EDW_PROC_LOG**: Primary logging table
  - Oracle database integration
  - Real-time data processing
  - Historical data analysis
  - Performance metrics

## Architecture Patterns

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
├── pages/              # Route-based page components
├── services/           # API communication layer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles and themes
└── assets/             # Static assets
```

### Backend Architecture
```
backend/
├── server.js           # Express server setup
├── routes/             # API route definitions
├── services/           # Business logic layer
├── middleware/         # Request processing middleware
├── utils/              # Utility functions
└── logs/               # Application logs
```

### Data Flow Architecture
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │    │   Express   │    │   MCP       │
│   (React)   │◄──►│   Server    │◄──►│   Server    │
│             │    │             │    │   (Python)  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Local     │    │   Session   │    │   Database  │
│   Storage   │    │   Storage   │    │   Logs      │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Development Environment

### Prerequisites
- **Node.js 18+**: JavaScript runtime
- **npm 9+**: Package manager
- **Modern Browser**: Chrome, Firefox, Safari, Edge
- **Python 3.8+**: For MCP server (backend)

### Setup Instructions
```bash
# Clone repository
git clone https://github.com/flowlytics/flowlytics.git
cd flowlytics

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Start development servers
npm start          # Frontend (port 3000)
cd backend && npm start  # Backend (port 8080)
```

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_DEBUG=false

# Backend (.env)
PORT=8080
MCP_SERVER_PATH=./mcp-server.py
LOG_LEVEL=info
ALLOWED_ORIGINS=http://localhost:3000
```

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy loading of route components
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large data lists
- **Image Optimization**: Compressed assets and lazy loading

### Backend Optimization
- **Process Management**: Efficient MCP server handling
- **Memory Management**: Garbage collection optimization
- **Caching**: Response caching for frequent requests
- **Connection Pooling**: Database connection optimization

### Build Optimization
```javascript
// Vite configuration for optimal builds
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@coreui/react'],
          visualization: ['reactflow', 'd3', 'chart.js']
        }
      }
    }
  }
})
```

## Security Implementation

### Frontend Security
- **Input Validation**: Client-side form validation
- **XSS Prevention**: Sanitized user inputs
- **HTTPS**: Secure communication in production
- **CSP**: Content Security Policy headers

### Backend Security
- **CORS**: Cross-origin resource sharing configuration
- **Input Sanitization**: Server-side validation
- **Error Handling**: Secure error responses
- **Process Isolation**: MCP server sandboxing

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component logic testing
- **Integration Tests**: API communication testing
- **E2E Tests**: User workflow testing
- **Visual Tests**: UI consistency testing

### Backend Testing
- **API Tests**: Endpoint functionality testing
- **Integration Tests**: MCP server communication
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability scanning

### Testing Tools
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing framework
- **Supertest**: HTTP assertion library

## Deployment Configuration

### Production Build
```bash
# Create optimized production build
npm run build

# Build outputs to /build directory
# Static files ready for web server deployment
```

### Docker Configuration
```dockerfile
# Multi-stage build for optimized container
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

### Environment Deployment
- **Development**: Local development with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized build with monitoring

## Monitoring and Logging

### Application Monitoring
- **Performance Metrics**: Load times and user interactions
- **Error Tracking**: Frontend and backend error logging
- **Usage Analytics**: User behavior and feature adoption
- **System Health**: Server status and resource usage

### Log Management
```javascript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})
```

## Future Technical Considerations

### Scalability Planning
- **Microservices**: Backend service decomposition
- **CDN**: Content delivery network integration
- **Database Optimization**: Query performance tuning
- **Horizontal Scaling**: Load balancer configuration

### Technology Upgrades
- **React**: Stay current with latest React features
- **CoreUI**: Regular template updates
- **Dependencies**: Security updates and performance improvements
- **Browser Support**: Modern browser feature adoption 