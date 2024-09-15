// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('./db');
// const JWT_SECRET = 'your_jwt_secret_key'; // Consider using environment variables for secrets

// // Register user
// const registerUser = (req, res) => {
//     const { username, password, role, name, birthdate, mobile, email, adharCard, address, departmentName, policeID, branchName, position, courtName } = req.body;

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
// };

// // // Login user
// // const loginUser = (req, res) => {
// //     const { username, password } = req.body;

// //     db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
// //         if (err) {
// //             return res.status(500).json({ error: err.message });
// //         }
// //         if (results.length === 0) {
// //             return res.status(400).json({ error: 'Invalid credentials' });
// //         }

// //         const user = results[0];

// //         bcrypt.compare(password, user.password, (err, isMatch) => {
// //             if (err) {
// //                 return res.status(500).json({ error: err.message });
// //             }
// //             if (!isMatch) {
// //                 return res.status(400).json({ error: 'Invalid credentials' });
// //             }

// //             const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
// //             res.cookie('token', token, { httpOnly: true });
// //             res.redirect('/dashboard.html');
// //         });
// //     });
// // };

// module.exports = { registerUser, loginUser };
