# Frontend — DynaPredict (React + Vite + TypeScript)

## Requisitos
- Node 18+
- npm

## Instalação
```bash
cd frontend
npm install
Variáveis de ambiente
Crie .env na pasta frontend:

ini
Copiar código
VITE_API_URL=http://localhost:3000
Rodar em dev
bash
Copiar código
npm run dev
Abra: http://localhost:5173

Scripts úteis
npm run dev — dev server

npm run build — build produção

npm run preview — preview do build

Observações
Login padrão: user@dynamox.com / 123456

O frontend usa Redux Toolkit + Thunks tipados (use useAppDispatch / useAppSelector)

yaml
Copiar código

---

## 9) Check-list final (faça isto localmente)
1. No `frontend` instale dependências:
```bash
npm install

Crie .env com VITE_API_URL apontando pro backend.

Start backend.

npm run dev no frontend.

Testa login, cria máquinas e abre Monitoring Points.