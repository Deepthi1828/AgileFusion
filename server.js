const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ================= MONGODB CONNECTION =================
mongoose.connect(
  "mongodb+srv://subravetideepthi_db_user:Deepthi123@cluster0.msllncb.mongodb.net/agilefusion?retryWrites=true&w=majority"
)
<<<<<<< HEAD
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));
=======
.then(() => console.log(" MongoDB Connected Successfully"))
.catch((err) => console.log(" MongoDB Connection Error:", err));
>>>>>>> 321f8b12415904aee4a2423d94cba86ac8aaf89d

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model("User", userSchema);

// ================= PROJECT SCHEMA =================
const projectSchema = new mongoose.Schema({
  name: String,
  owner: String,
  priority: String,
  status: String,
  deadline: Date,
  progress: Number
});
const Project = mongoose.model("Project", projectSchema);

// ================= TASK SCHEMA (KANBAN) =================
const taskSchema = new mongoose.Schema({
  title: String,
  owner: String,
  priority: String,
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do"
  }
});
const Task = mongoose.model("Task", taskSchema);

// ================= AUTH ROUTES =================

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid password" });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= PROJECT ROUTES =================

// ADD PROJECT
app.post("/addProject", async (req, res) => {
  try {
    const { name, owner, priority, status, deadline, progress } = req.body;

    const newProject = new Project({
      name,
      owner,
      priority,
      status,
      deadline: deadline ? new Date(deadline) : null,
      progress: Number(progress)
    });

    await newProject.save();

    res.json({ success: true, message: "Project Added Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET PROJECTS
app.get("/getProjects", async (req, res) => {
  const projects = await Project.find().sort({ deadline: 1 });
  res.json(projects);
});

// DELETE PROJECT
app.delete("/deleteProject/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================= DASHBOARD STATS =================
app.get("/dashboardStats", async (req, res) => {
  try {
    const projects = await Project.find();

    const total = projects.length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const inProgress = projects.filter(p => p.status === "In Progress").length;
    const planning = projects.filter(p => p.status === "Planning").length;

    res.json({ total, completed, inProgress, planning });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= TASK ROUTES =================

// GET TASKS
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD TASK
app.post("/addTask", async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.json({ success: true, task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE TASK STATUS (Drag & Drop)
app.put("/updateTaskStatus/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`🚀 Server running on http://localhost:${PORT}`);
=======
  console.log(` Server running on http://localhost:${PORT}`);
>>>>>>> 321f8b12415904aee4a2423d94cba86ac8aaf89d
});
