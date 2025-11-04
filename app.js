const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 💡 Set version and environment dynamically
const version = process.env.APP_VERSION || 'v1.0';
const environment = process.env.ENVIRONMENT || 'Blue'; // Blue or Green

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Blue-Green Deployment</title>
            <style>
                body {
                    margin: 0;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, ${
                        environment === 'Blue'
                            ? '#1E90FF, #00BFFF'
                            : '#2ecc71, #27ae60'
                    });
                    color: white;
                    text-align: center;
                    transition: all 0.5s ease;
                }

                h1 {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                    text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
                }

                h2 {
                    font-size: 1.8rem;
                    font-weight: 400;
                    margin-bottom: 1.5rem;
                }

                .card {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 2rem 3rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(8px);
                    transition: transform 0.3s ease;
                }

                .card:hover {
                    transform: scale(1.05);
                }

                .btn {
                    padding: 10px 20px;
                    background-color: white;
                    border: none;
                    border-radius: 8px;
                    color: ${
                        environment === 'Blue' ? '#007BFF' : '#27ae60'
                    };
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
                    transition: background-color 0.3s, transform 0.2s;
                }

                .btn:hover {
                    background-color: #f5f5f5;
                    transform: translateY(-2px);
                }

                footer {
                    position: absolute;
                    bottom: 20px;
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 ${environment} Environment</h1>
                <h2>Blue-Green Deployment Demo</h2>
                <p style="font-size:1.3rem;">Currently running <strong>Version ${version}</strong></p>
                <button class="btn" onclick="location.reload()">🔄 Refresh</button>
            </div>
            <footer>Developed by <strong>Rahulji V</strong></footer>
        </body>
        </html>
    `);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ ${environment} Environment running on port ${port} (version: ${version})`);
});

