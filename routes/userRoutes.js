import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathToUsers = path.join(__dirname, "..", "database", "users.txt");
const pathToCourses = path.join(__dirname, "..", "database", "courses.txt");

router.post("/signup", (req, res) => {
  fs.readFile(pathToUsers, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      let usersArray = JSON.parse(data);
      usersArray.push({
        username: req.body.username,
        password: req.body.password,
        purchasedCourses: [],
      });

      fs.writeFile(pathToUsers, JSON.stringify(usersArray), "utf-8", (err) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json({ message: "User created successfully" });
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  fs.readFile(pathToUsers, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const usersArray = JSON.parse(data);
      let isUser = false;
      usersArray.some((user) => {
        if (
          user.username === req.headers.username &&
          user.password === req.headers.password
        ) {
          isUser = true;
          return true;
        }
      });

      if (isUser) {
        res.status(200).json({ message: "Logged in successfully" });
      } else {
        res.status(404).json({ message: "Not found" });
      }
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

router.post("/courses/:courseId", (req, res) => {
  fs.readFile(pathToUsers, "utf-8", (err, users) => {
    if (err) {
      throw err;
    } else {
      const usersArray = JSON.parse(users);

      let userIndex = usersArray.findIndex((user) => {
        return user.username === req.headers.username;
      });

      if (userIndex) {
        if (usersArray[userIndex].password === req.headers.password) {
          fs.readFile(pathToCourses, "utf-8", (err, courses) => {
            if (err) {
              throw err;
            } else {
              let coursesArray = JSON.parse(courses);

              let courseIndex = coursesArray.findIndex((course) => {
                return course.courseId === parseInt(req.params.courseId);
              });
              if (courseIndex) {
                usersArray[userIndex].purchasedCourses.push(
                  coursesArray[courseIndex]
                );

                fs.writeFile(
                  pathToUsers,
                  JSON.stringify(usersArray),
                  "utf-8",
                  (err) => {
                    if (err) {
                      throw err;
                    } else {
                      res
                        .status(200)
                        .json({ message: "Course purchased successfully" });
                    }
                  }
                );
              } else {
                res.status(404).json({ error: "Course not found" });
              }
            }
          });
        } else {
          res.status(401).json({ error: "Invlaid password" });
        }
      } else {
        res.status(404).json({ error: "Invalid username" });
      }
    }
  });
});

router.get("/purchasedCourses", (req, res) => {
  fs.readFile(pathToUsers, "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const usersArray = JSON.parse(data);
      let userIndex = usersArray.findIndex((user) => {
        return (
          user.username === req.headers.username &&
          user.password === req.headers.password
        );
      });
      if (userIndex) {
        res
          .status(200)
          .send("Purchased courses: " + usersArray[userIndex].purchasedCourses);
      } else {
        res.status(404).json({ error: "Invalid Username or Password" });
      }
    }
  });
});

export default router;
