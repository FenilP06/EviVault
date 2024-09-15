// const express = require('express');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const multer = require('multer');
// const bcrypt = require('bcryptjs');
// const db = require('./db');

// const app = express();
// const port = 3000;
// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(express.static('public'));

// // Register user
// app.post('/auth/register', upload.fields([
//     { name: 'departmentLetter', maxCount: 1 },
//     { name: 'idCard', maxCount: 1 },
//     { name: 'proof', maxCount: 1 }
// ]), (req, res) => {
//     const { username, password, role, name, birthdate, mobile, email, adharCard, address, departmentName, policeID, branchName, position, courtName } = req.body;

//     if (!role) {
//         return res.status(400).json({ error: 'Role is required' });
//     }

//     db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         if (results.length > 0) {
//             return res.status(400).json({ error: 'Username already exists' });
//         }

//         bcrypt.hash(password, 10, (err, hashedPassword) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }

//             const query = `
//                 INSERT INTO users (username, password, role, name, birthdate, mobile, email, adharCard, address, departmentName, policeID, branchName, position, courtName) 
//                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `;
//             const values = [username, hashedPassword, role, name, birthdate, mobile, email, adharCard, address, departmentName || null, policeID || null, branchName || null, position || null, courtName || null];

//             db.query(query, values, (err) => {
//                 if (err) {
//                     return res.status(500).json({ error: err.message });
//                 }
//                 res.redirect('/login.html'); 
//             });
//         });
//     });
// });


// // Login user
// // app.post('/auth/login', (req, res) => {
// //     const { username, password } = req.body;

// //     db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
// //         if (err) {
// //             return res.status(500).json({ error: err.message });
// //         }
// //         if (results.length === 0) {
// //             return res.status(400).json({ error: 'Invalid credentials' });
// //         }

// //         const user = results[0];

// //         // bcrypt.compare(password, user.password, (err, isMatch) => {
// //         //     if (err) {
// //         //         return res.status(500).json({ error: err.message });
// //         //     }
// //         //     if (!isMatch) {
// //         //         return res.status(400).json({ error: 'Invalid credentials' });
// //         //     }

// //         //     // Remove JWT-related code
// //         //     
// //         // });
        
// //     });
// //     res.redirect('/dashboard.html');
// // });

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });
