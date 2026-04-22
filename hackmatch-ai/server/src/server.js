import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HackMatch AI API",
      version: "1.0.0",
      description: "API for HackMatch AI - Hackathon Partner Matching Platform",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            bio: {
              type: "string",
              description: "User's bio",
            },
            skills: {
              type: "array",
              items: {
                type: "string",
              },
              description: "User's skills",
            },
            interests: {
              type: "array",
              items: {
                type: "string",
              },
              description: "User's interests",
            },
            college: {
              type: "string",
              description: "User's college",
            },
            year: {
              type: "string",
              description: "Year of study",
            },
            lookingForTeam: {
              type: "boolean",
              description: "Whether user is looking for team",
            },
            connections: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of connected user IDs",
            },
            profileImage: {
              type: "string",
              description: "Profile image URL",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
        Project: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Project ID",
            },
            title: {
              type: "string",
              description: "Project title",
            },
            description: {
              type: "string",
              description: "Project description",
            },
            requiredSkills: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Skills required for the project",
            },
            category: {
              type: "string",
              description: "Project category",
            },
            hackathon: {
              type: "string",
              description: "Associated hackathon",
            },
            status: {
              type: "string",
              enum: ["Open", "Closed", "Completed"],
              description: "Project status",
            },
            createdBy: {
              type: "string",
              description: "ID of user who created the project",
            },
            teamMembers: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of team member user IDs",
            },
            applications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                    description: "Applicant user ID",
                  },
                  status: {
                    type: "string",
                    enum: ["Pending", "Accepted", "Rejected"],
                    description: "Application status",
                  },
                  appliedAt: {
                    type: "string",
                    format: "date-time",
                    description: "Application timestamp",
                  },
                },
              },
              description: "Project applications",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Project creation timestamp",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later."
  },
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API documentation route
app.get("/api/docs", (req, res) => {
  res.json(swaggerSpec);
});

// Basic route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "HackMatch AI Backend is running! 🚀",
    version: "1.0.0",
    docs: "/api-docs",
    health: "/api/health",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "Connected",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log(`📊 API Docs: Check README.md for documentation`);
});
