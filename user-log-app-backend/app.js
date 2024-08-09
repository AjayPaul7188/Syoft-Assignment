const express = require("express");
const app = express();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
app.use(express.json());
const path = require('path');
const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

let cors = require("cors");
const { request } = require("http");
app.use(cors());

const dbPath = path.join(__dirname, "userDetails.db");

let db = null

initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server is Running at http://localhost:3000/");
        })
    } catch (e) {
        console.log(`Db Error: ${e.message}`);
        process.exit(1);
      }

    //   const createUserTableQuery = `
    //     CREATE TABLE IF NOT EXISTS user (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     first_name TEXT NOT NULL,
    //     last_name TEXT NOT NULL,
    //     email TEXT NOT NULL UNIQUE,
    //     password TEXT NOT NULL,
    //     phone_number TEXT NOT NULL,
    //     city TEXT NOT NULL,
    //     zip_code TEXT NOT NULL
    //   )`;

    // await db.run(createUserTableQuery);

    // const getTables = async () => {
    //     const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    //     console.log('Existing tables:', tables);
    //     return tables;
    // };

    // // Function to get schema of a specific table
    // const getTableSchema = async (tableName) => {
    //     const schema = await db.all(`PRAGMA table_info(${tableName})`);
    //     console.log(`Schema of table ${tableName}:`, schema);
    //     return schema;
    // };

    // // Check existing tables and print their schemas
    // const tables = await getTables();
    // for (const table of tables) {
    //     await getTableSchema(table.name);
    // }
};

initializeDBAndServer();


app.post('/Api/user_registeration/api/user_registeration', async (request, response) => {
    const { firstName, lastName, email, password, phoneNumber, city, zipCode } = request.body;
    // console.log('Request body:', request.body);

    if (password.length < 5) {
        response.status(400).json({ error: "Password is too short" });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const selectUserQuery = `SELECT * FROM user WHERE email = ?`;
        const dbUser = await db.get(selectUserQuery, [email]);

        if (!dbUser) {
            const createUserQuery = `
                INSERT INTO user (first_name, last_name, email, password, phone_number, city, zip_code)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            await db.run(createUserQuery, [firstName, lastName, email, hashedPassword, phoneNumber, city, zipCode]);
            response.json({ message: "User created successfully" });
        } else {
            response.status(400).json({ error: "User already exists" });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get rows from the user table
app.get('/Api/user_registeration/api/users', async (req, res) => {
    try {
        const users = await db.all('SELECT * FROM user');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/Api/userlogin/api/userlogin', async (request, response) => {
    const { email, password } = request.body;
    // console.log('Login request body:', request.body);

    try {
        const selectUserQuery = `SELECT * FROM user WHERE email = ?`;
        const dbUser = await db.get(selectUserQuery, [email]);

        console.log(dbUser)

        if (dbUser) {
            const isPasswordValid = await bcrypt.compare(password, dbUser.password);
            if (isPasswordValid) {
                const payload = {email: email};
                const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN")
                response.json({data: dbUser, jwtToken: jwtToken})
            } else {
                response.status(400).json({ error: "Invalid password" });
            }
        } else {
            response.status(400).json({ error: "User does not exist" });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});