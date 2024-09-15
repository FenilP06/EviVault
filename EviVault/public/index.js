// Load required modules
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const http = require('http');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(fileUpload());
app.use(express.json());

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// app.get("/index.html", (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"));
// });

// Upload data route
app.post("/dashboard/uploadData", async (req, res) => {
    const filename = req.files.file1.name;
    const sampleFile = req.files.file1;
    const productNumber = req.body.productNumber;

    // Move the file to the server
    async function moveFileToServer() {
        return new Promise((resolve, reject) => {
            sampleFile.mv(path.join(__dirname, filename), err => {
                if (err) {
                    reject(err);
                } else {
                    console.log("File added to the server successfully !!!");
                    resolve();
                }
            });
        });
    }


    async function uploadDataToIPFS() {
        const filePath = path.join(__dirname, filename);
        const file = fs.readFileSync(filePath);

        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const requestBody = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="file"; filename="' + filename + '"',
            'Content-Type: application/octet-stream',
            '',
            file,
            `--${boundary}--`
        ].join('\r\n');

        const options = {
            hostname: '127.0.0.1',
            port: 5001,
            path: '/api/v0/add',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const jsonData = JSON.parse(data);
                            console.log(`IPFS CID: ${jsonData.Hash}`);
                            resolve(jsonData.Hash);
                        } catch (e) {
                            reject(new Error(`Failed to parse IPFS response: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`Failed to upload file to IPFS: ${data}`));
                    }
                });
            });

            req.on('error', (e) => {
                reject(new Error(`Request error: ${e.message}`));
            });

            req.write(requestBody);
            req.end();
        });
    }

    // Store data in the blockchain
    async function storeDataInBlockchain(hash) {
        const API_URL = 'https://sepolia.infura.io/v3/0118b15ca7ac462cb5275348eb01ee4a'; // Your Infura endpoint
        const PRIVATE_KEY = process.env.PRIVATE_KEY;
        const CONTRACT_ADDRESS_1 = process.env.CONTRACT_ADDRESS;

        const abi = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "fileName",
                        "type": "string"
                    }
                ],
                "name": "getIPFSHash",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "fileName",
                        "type": "string"
                    }
                ],
                "name": "getProductNumber",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "fileName",
                        "type": "string"
                    }
                ],
                "name": "isFileStored",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "fileName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "productNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsHash",
                        "type": "string"
                    }
                ],
                "name": "upload",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];

        try {
            // const provider = new ethers.providers.JsonRpcProvider(API_URL);
            const provider = new ethers.providers.Web3Provider(window.ethereum);


            await window.ethereum.request({ method: 'eth_requestAccounts' });
            await window.ethereum.request({
                method: "eth_requestAccounts"
            })

            // const signer = new ethers.Wallet(PRIVATE_KEY, provider);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS_1, abi, signer)


            // const contractInstance = new ethers.Contract(CONTRACT_ADDRESS_1, abi, signer);

            const isStored = await contractInstance.isFileStored(filename);

            if (!isStored) {
                console.log("Storing the IPFS hash...");
                const tx = await contractInstance.upload(filename, productNumber, hash);
                await tx.wait(); // Wait for the transaction to be mined
                const storedHash = await contractInstance.getIPFSHash(filename);
                res.send(`IPFS hash is stored in the smart contract: ${storedHash}`);
            } else {
                console.log("Data is already stored for this file name");
                const IPFShash = await contractInstance.getIPFSHash(filename);
                res.send(`The stored hash is: ${IPFShash}`);
            }
        } catch (error) {
            console.error(`Error interacting with the blockchain: ${error.message}`);
            res.status(500).send(`Error storing data in blockchain: ${error.message}`);
        }
    }

    try {
        await moveFileToServer();
        const hash = await uploadDataToIPFS();
        await storeDataInBlockchain(hash);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading file");
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
