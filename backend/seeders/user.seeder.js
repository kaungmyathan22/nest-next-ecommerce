// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/your-database-name', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// const seedData = [
//   { name: 'John Doe', email: 'john@example.com' },
//   { name: 'Jane Smith', email: 'jane@example.com' },
//   // Add more sample data
// ];

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');

//   // Insert the data using the db connection
//   db.collection('users').insertMany(seedData, (err, result) => {
//     if (err) {
//       console.error('Error seeding database:', err);
//     } else {
//       console.log('Database seeded successfully');
//     }

//     // Close the database connection
//     db.close();
//   });
// });
const { faker } = require("@faker-js/faker");
const axios = require("axios");
// import { faker } from "@faker-js/faker";
// import axios from "axios";
const URL = "http://localhost:8080/api/v1/users/address";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImttQGdtYWlsLmNvbSIsImlhdCI6MTY5ODAzMDUxMywiZXhwIjoxNjk4NjM1MzEzfQ.8zF1s5-x2mH6Thcsix8z9Sg49TXMGL7elQAOBmGl8VY";
function seedUsers() {
  const addresses = [];
  for (let index = 0; index < 300; index++) {
    const payload = {
      name: faker.location.street(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      country_region: faker.location.country(),
      companyName: faker.company.bs(),
      streetAddress: faker.location.streetAddress(),
      apartment_suite_unit: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      phone: faker.phone.number(),
    };

    const res = axios.post(URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    addresses.push(res);
  }
  Promise.all(addresses).then((res) => {
    console.log(`created ${res.length}`);
  });
}
seedUsers();
