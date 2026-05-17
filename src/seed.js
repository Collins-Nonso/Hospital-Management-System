require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./models/User");
const Department = require(
  "./models/Department"
);

const connectDB = require(
  "./config/db"
);

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();

    await Department.deleteMany();

    const adminUser =
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      });

    const department =
      await Department.create({
        name: "Cardiology",
        description:
          "Heart treatment department"
      });

    console.log(
      "Database seeded successfully"
    );

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedData();