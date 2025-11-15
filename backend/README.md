🧠 Dynamox Challenge - Backend

Este repositório contém o backend desenvolvido em NestJS para o desafio técnico da Dynamox. O projeto implementa uma API RESTful para gerenciamento de máquinas e pontos de monitoramento, utilizando MongoDB como banco de dados e Prisma ORM para abstração.

🚀 Tecnologias

NestJS

TypeScript

Prisma ORM

MongoDB

Class Validator

Swagger

Axios

⚙️ Configuração do ambiente

Clonar o repositório git clone https://github.com/samuelbatista3rios/dynamox-backend.git cd dynamox-backend

Instalar as dependências npm install

Configurar o arquivo .env

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

DATABASE_URL="mongodb://localhost:27017/dynamox" PORT=3000

Ajuste o DATABASE_URL conforme sua instância local ou conexão remota do MongoDB.

Gerar o Prisma Client npx prisma generate
🧩 Scripts principais

Executar em modo de desenvolvimento
npm run start:dev

Executar em modo de produção
npm run start:prod

Rodar o build TypeScript
npm run build

📡 Endpoints principais 🔹 Máquinas (/machines) ➕ Criar uma nova máquina

POST /machines

{ "name": "Máquina 01", "location": "Setor A" }

🔍 Listar todas as máquinas

GET /machines

🧾 Buscar máquina por ID

GET /machines/6740acdb1a82f70af886e423

✏️ Atualizar máquina

PUT /machines/6740acdb1a82f70af886e423

{ "name": "Máquina 01 - Atualizada", "location": "Setor B" }

❌ Deletar máquina

DELETE /machines/6740acdb1a82f70af886e423

🔹 Pontos de monitoramento (/monitoring) ➕ Criar um novo ponto de monitoramento

POST /monitoring

{ "name": "Sensor 01", "machineId": "6740acdb1a82f70af886e423", "sensorModel": "DynaSens-200" }

🔍 Listar todos os pontos

GET /monitoring

🧠 Estrutura de pastas src/ ├── app.module.ts ├── main.ts ├── machines/ │ ├── machines.controller.ts │ ├── machines.service.ts │ └── dto/ ├── monitoring/ │ ├── monitoring.controller.ts │ ├── monitoring.service.ts │ └── dto/ └── prisma/ ├── schema.prisma

💬 Observações

O projeto não utiliza Docker.

O banco de dados é MongoDB, configurado via variável DATABASE_URL.

O Swagger está disponível em: 👉 http://localhost:3000/api

O Prisma ORM é usado apenas para tipagem e manipulação de dados no MongoDB.