import express from "express";
import Project from "../models/Project.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Advanced project search and filtering
/**
 * @swagger
 * /api/projects/search:
 *   get:
 *     summary: Search and filter projects with advanced options
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for title or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Project category filter
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Required skills filter (comma-separated)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: Open
 *         description: Project status filter
 *       - in: query
 *         name: hackathon
 *         schema:
 *           type: string
 *         description: Hackathon filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalProjects:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/search", authenticate, async (req, res) => {
  try {
    const {
      q, // search query
      category,
      skills,
      status = "Open",
      hackathon,
      page = 1,
      limit = 10
    } = req.query;

    let query = { status };

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Hackathon filter
    if (hackathon) {
      query.hackathon = { $regex: hackathon, $options: 'i' };
    }

    // Skills filter
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillArray };
    }

    const projects = await Project.find(query)
      .populate("createdBy", "name email skills profileImage")
      .populate("teamMembers", "name email skills")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProjects: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create project
/**
 * @swagger
 * /api/projects/create:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *               description:
 *                 type: string
 *                 description: Project description
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Skills required for the project
 *               category:
 *                 type: string
 *                 description: Project category
 *               hackathon:
 *                 type: string
 *                 description: Associated hackathon
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/create", authenticate, async (req, res) => {
  try {
    const { title, description, requiredSkills, category, hackathon } =
      req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const project = await Project.create({
      title,
      description,
      requiredSkills,
      category,
      hackathon,
      createdBy: req.userId,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all projects
router.get("/", authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ status: "Open" })
      .populate("createdBy", "name email skills")
      .populate("teamMembers", "name email skills");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single project
router.get("/:projectId", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("createdBy", "name email bio skills")
      .populate("teamMembers", "name email bio skills");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Apply to project
/**
 * @swagger
 * /api/projects/{projectId}/apply:
 *   post:
 *     summary: Apply to join a project
 *     tags: [Projects, Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project to apply for
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request - already applied
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.post("/:projectId/apply", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if already applied
    const alreadyApplied = project.applications.find(
      (app) => app.userId.toString() === req.userId.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this project" });
    }

    project.applications.push({
      userId: req.userId,
      status: "Pending",
    });

    await project.save();

    res.status(200).json({
      message: "Application submitted successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update application status (by project creator)
router.put("/:projectId/application/:appId", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only project creator can update applications" });
    }

    const application = project.applications.find(
      (app) => app._id.toString() === req.params.appId
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;

    if (status === "Accepted") {
      project.teamMembers.push(application.userId);
    }

    await project.save();

    res.status(200).json({
      message: "Application status updated",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's projects
router.get("/user/my-projects", authenticate, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.userId }, { teamMembers: req.userId }],
    }).populate("createdBy teamMembers", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
