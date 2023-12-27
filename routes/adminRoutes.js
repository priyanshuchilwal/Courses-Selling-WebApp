import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathToAdmins = path.join(__dirname, "..", "database", "admins.txt");
const pathToCourses = path.join(__dirname, "..", "database", "courses.txt");

// Routes
router.post("/signup", (req, res) => {
  fs.readFile(pathToAdmins, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      let adminsArray = JSON.parse(data);
      adminsArray.push({
        usename: req.body.username,
        password: req.body.password,
      });

      fs.writeFile(
        pathToAdmins,
        JSON.stringify(adminsArray),
        "utf-8",
        (err) => {
          if (err) {
            throw err;
          } else {
            res.status(200).json({ message: "admin created successfully" });
          }
        }
      );
    }
  });
});

router.post("/login", (req, res) => {
  fs.readFile(pathToAdmins, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const adminsArray = JSON.parse(data);
      let isAdmin = false;
      adminsArray.some((admin) => {
        if (
          admin.username === req.headers.username &&
          admin.password === req.headers.password
        ) {
          isAdmin = true;
          return true;
        }
      });

      if (isAdmin) {
        res.status(200).json({ message: "Logged in successfully" });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    }
  });
});

router.post("/courses", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  let course = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published,
  };
  course["courseId"] = Math.floor(Math.random() * 10000000);

  fs.readFile(pathToCourses, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const coursesArray = JSON.parse(data);
      coursesArray.push(course);

      fs.writeFile(
        pathToCourses,
        JSON.stringify(coursesArray),
        "utf-8",
        (err) => {
          if (err) {
            throw err;
          } else {
            res.status(200).json({
              message: "Course created successfully",
              courseId: course.courseId,
            });
          }
        }
      );
    }
  });
});

router.put("/courses/:id", (req, res) => {
  const courseId = req.params.id;

  const username = req.headers.username;
  const password = req.headers.password;

  fs.readFile(pathToCourses, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const coursesArray = JSON.parse(data);
      let courseIndex = coursesArray.findIndex((course) => {
        return course.courseId === parseInt(courseId);
      });

      coursesArray[courseIndex] = { ...coursesArray[courseIndex], ...req.body };

      fs.writeFile(
        pathToCourses,
        JSON.stringify(coursesArray),
        "utf-8",
        (err) => {
          if (err) {
            throw err;
          } else {
            res.status(200).json({ message: "Course updated successfully" });
          }
        }
      );
    }
  });
});

router.get("/courses", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  fs.readFile(pathToCourses, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const courses = JSON.parse(data);
      res.status(200).send(courses);
    }
  });
});

export default router;
