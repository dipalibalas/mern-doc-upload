require("dotenv").config();

const bcrypt = require("bcryptjs");
const connect = require("../db/db");
const User = require("../models/User");

const seedUsers = [
  {
    name: "Alice Owner",
    email: "alice@example.com",
    password: "password123",
  },
  {
    name: "Bob Collaborator",
    email: "bob@example.com",
    password: "password123",
  },
];

const seed = async () => {
  await connect();

  for (const account of seedUsers) {
    const existing = await User.findOne({ email: account.email });

    if (existing) {
      console.log(`Skipped existing user: ${account.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);
    await User.create({
      name: account.name,
      email: account.email,
      password: hashedPassword,
    });

    console.log(`Created user: ${account.email}`);
  }

  console.log("Seed complete.");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
