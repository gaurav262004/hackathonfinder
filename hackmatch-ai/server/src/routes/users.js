import express from "express";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 description: User's bio
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: User's skills
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: User's interests
 *               college:
 *                 type: string
 *                 description: User's college
 *               year:
 *                 type: string
 *                 description: User's year of study
 *               lookingForTeam:
 *                 type: boolean
 *                 description: Whether user is looking for team
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Get current user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "connections",
      "name email bio skills"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { bio, skills, interests, college, year, lookingForTeam } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        bio,
        skills,
        interests,
        college,
        year,
        lookingForTeam,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Advanced matching algorithm
/**
 * @swagger
 * /api/users/matches:
 *   get:
 *     summary: Get AI-powered user matches based on skills, interests, and profile compatibility
 *     tags: [Users, Matching]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Matches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMatches:
 *                   type: integer
 *                   description: Total number of potential matches
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       matchScore:
 *                         type: integer
 *                         minimum: 0
 *                         maximum: 100
 *                         description: Compatibility score (0-100)
 *                       matchReasons:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Reasons for the match score
 *                       compatibility:
 *                         type: string
 *                         enum: [High, Medium, Low]
 *                         description: Compatibility level
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/matches", authenticate, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all available users except current user and existing connections
    const allUsers = await User.find({
      _id: { $ne: req.userId, $nin: currentUser.connections || [] },
      isAvailable: true,
      lookingForTeam: currentUser.lookingForTeam ? { $in: [true, null] } : true
    }).select("name bio skills interests college year lookingForTeam profileImage");

    // Calculate match scores
    const matches = allUsers.map(user => {
      let score = 0;
      let reasons = [];

      // Skills matching (40% weight)
      const skillMatches = user.skills.filter(skill =>
        currentUser.skills.includes(skill)
      ).length;
      if (skillMatches > 0) {
        score += (skillMatches / Math.max(currentUser.skills.length, 1)) * 40;
        reasons.push(`${skillMatches} skill match(es)`);
      }

      // Interests matching (30% weight)
      const interestMatches = user.interests.filter(interest =>
        currentUser.interests.includes(interest)
      ).length;
      if (interestMatches > 0) {
        score += (interestMatches / Math.max(currentUser.interests.length, 1)) * 30;
        reasons.push(`${interestMatches} interest match(es)`);
      }

      // College matching (15% weight)
      if (user.college === currentUser.college && user.college) {
        score += 15;
        reasons.push("Same college");
      }

      // Year proximity (10% weight)
      if (user.year && currentUser.year) {
        const yearDiff = Math.abs(parseInt(user.year) - parseInt(currentUser.year));
        score += Math.max(0, 10 - yearDiff * 2);
        if (yearDiff === 0) reasons.push("Same year");
      }

      // Looking for team compatibility (5% weight)
      if (user.lookingForTeam === currentUser.lookingForTeam) {
        score += 5;
        reasons.push("Team compatibility");
      }

      return {
        user: user,
        matchScore: Math.round(score),
        matchReasons: reasons,
        compatibility: score > 70 ? "High" : score > 40 ? "Medium" : "Low"
      };
    });

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      totalMatches: matches.length,
      matches: matches.slice(0, 20) // Return top 20 matches
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all users for matching (except current user)
router.get("/discover", authenticate, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
      isAvailable: true,
    }).select("name bio skills interests college year lookingForTeam");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get specific user
router.get("/:userId", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add connection/send request
/**
 * @swagger
 * /api/users/connect/{userId}:
 *   post:
 *     summary: Send connection request to another user
 *     tags: [Users, Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to connect with
 *     responses:
 *       200:
 *         description: Connection request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 connections:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of connected user IDs
 *       400:
 *         description: Bad request - cannot connect with yourself or already connected
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/connect/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.connections.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Already connected with this user" });
    }

    // Add to connections
    currentUser.connections.push(userId);
    await currentUser.save();

    // Send notification to target user
    targetUser.notifications.push({
      type: "connection_request",
      from: req.userId,
      message: `${currentUser.name} sent you a connection request`,
    });
    await targetUser.save();

    res.status(200).json({
      message: "Connection request sent",
      connections: currentUser.connections,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get notifications
/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Users, Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [connection_request, project_invitation, team_join_request]
 *                       from:
 *                         $ref: '#/components/schemas/User'
 *                       project:
 *                         $ref: '#/components/schemas/Project'
 *                       message:
 *                         type: string
 *                       read:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 unreadCount:
 *                   type: integer
 *                   description: Number of unread notifications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/notifications", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("notifications.from", "name email profileImage")
      .populate("notifications.project", "title");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      notifications: user.notifications.sort((a, b) => b.createdAt - a.createdAt),
      unreadCount: user.notifications.filter(n => !n.read).length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Mark notification as read
router.put("/notifications/:notificationId/read", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const notification = user.notifications.find(
      n => n._id.toString() === req.params.notificationId
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
