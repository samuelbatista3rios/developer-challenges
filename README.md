Dynamox Full-Stack Developer Challenge

This project is a full-stack application developed for the Dynamox Technical Challenge, covering authentication, machine management, monitoring points, and sensor assignment — all following the challenge’s business rules.


⚠️ Important Note About Deployment (Render.com)

If you're testing the backend deployed on Render.com, be aware that:

Render free-tier services automatically "sleep" after ~15 minutes of inactivity.
The first request after downtime may take 30–60 seconds to wake the server.

This is normal behavior, not a bug in the code.

🚀 Technologies
Frontend

React

TypeScript

Vite

Material UI v5

Redux Toolkit

Redux Thunk

Axios

React Router DOM

Backend

Node.js

Express

TypeScript

MongoDB

Mongoose

📂 Project Structure
developer-challenges/
│
├── backend/        # REST API (Node + Express + TS + MongoDB)
│
├── frontend/       # React Application (Vite + TS + Redux + MUI)
│
└── README.md

🏗️ How to Run
Requirements

Node.js 16+

MongoDB

npm or yarn

▶️ Backend
cd backend
npm install
npm run dev

🖥️ Frontend
cd frontend
npm install
npm run dev

📋 Implemented Features
🔐 Authentication

Login via fixed credentials

Private routes

Logout

🏭 Machine Management

Create machine

Edit machine

Delete machine

🎯 Monitoring Points & Sensors

Create 2+ monitoring points per machine

Sensor assignment with rules

Sensor models: TcAg, TcAs, HF+

Pumps cannot use TcAg or TcAs

📑 Pagination & Sorting

5 items per page

Sorting ASC/DESC for all columns

🧩 Assumptions

Single fixed user for login

Machine types restricted to Pump and Fan

Sensor IDs validated

User is redirected to machines after login

Server-side pagination

🔌 API Routes
Auth

POST /auth/login

Machines

GET /machines
POST /machines
PUT /machines/:id
DELETE /machines/:id

Monitoring Points

GET /monitoring-points
POST /monitoring-points
PUT /monitoring-points/:id
DELETE /monitoring-points/:id

Sensors

POST /monitoring-points/:id/sensor

👨‍💻 Author

Developed by Samuel Batista
GitHub: https://github.com/samuelbatista3rios

🇧🇷 Desafio Full-Stack Dynamox










Aplicação fullstack construída para o Desafio Técnico da Dynamox, implementando autenticação, máquinas, pontos de monitoramento, sensores e regras de negócio.

🧩 Visão da Arquitetura

(mesmo diagrama acima)

⚠️ Nota sobre Deploy (Render.com)

Se você estiver testando o backend hospedado no Render:

Render free-tier hiberna após ~15 minutos sem uso, e o primeiro acesso fica lento enquanto o servidor “acorda”.

Esse comportamento é normal da plataforma.

🚀 Tecnologias, Execução, Funcionalidades, Assumptions e Endpoints

(mesmo conteúdo da versão em inglês acima)

👨‍💻 Autor

Desenvolvido por Samuel Batista
GitHub: https://github.com/samuelbatista3rios
