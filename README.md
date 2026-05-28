# Parte-4---CACA
Trabalho Realizado por:
- António Freitas
- Miguel Medeiros
- Sara Freire


---

Descrição
Refatorização da aplicação web do Centro Académico Clínico dos Açores (CACA), consolidando os projetos anteriores (PEI1, PEI2, PEI3) numa aplicação moderna com React no frontend e Node.js/Express no backend, com uma API de gestão de utilizadores integrada.

---

Tecnologias Utilizadas
Frontend
React (Create React App)
Three.js (animação do logótipo)
GSAP (animações de scroll)
Leaflet + OpenStreetMap (mapas)
Open-Meteo API (meteorologia)
IndexedDB (armazenamento local de eventos e newsletter)

Backend
Node.js + Express
MongoDB Atlas (base de dados)
Mongoose (ODM)
bcryptjs (hashing de passwords)
JSON Web Tokens / JWT (autenticação)
dotenv (variáveis de ambiente)
Funcionalidades Implementadas
Frontend (React)
Refatorização completa da landing page em componentes React
Animação 3D do logótipo com Three.js
Animações de scroll com GSAP
Gestão de eventos com previsão meteorológica e mapa
Armazenamento local de eventos e subscritores via IndexedDB
Formulário de newsletter e contactos
Interface de login e registo com modal (componente Auth)
Botão "Entrar"/"Sair" no header com gestão de sessão via localStorage

Backend (API REST)
POST /api/auth/register — registo de novo utilizador com hashing de password (bcrypt, salt 10)
POST /api/auth/login — autenticação com devolução de token JWT (validade 2 horas)
GET /api/auth/perfil — consulta de perfil do utilizador autenticado (requer token)
PUT /api/auth/perfil — edição de perfil do utilizador autenticado (requer token)
Sistema de permissões: utilizador (padrão) e administrador
Middleware de autenticação JWT reutilizável

---

Como Correr a Aplicação
Pré-requisitos
Node.js instalado
Conta no MongoDB Atlas com cluster ativo

Backend
cd backend
npm install


Criar ficheiro .env na pasta backend/ com:
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<chave_secreta>
Iniciar o servidor:
node server.js


O servidor fica disponível em http://localhost:5000.

Frontend
cd CACA---PARTE-4-none/caca4
npm install
npm start


A aplicação fica disponível em http://localhost:3000.

O backend deve estar a correr antes de iniciar o frontend.

---

Segurança
Passwords nunca guardadas em texto simples — hashing com bcrypt (salt 10)
Autenticação stateless via JWT
Validação de campos obrigatórios em todos os endpoints
Rotas protegidas com middleware de verificação de token
Emails normalizados para minúsculas e verificados por unicidade

---
APIs Externas
| API                       | Utilização                             |
|                           |                                        |
| Open-Meteo                | Previsão meteorológica para os eventos |
| Nominatim (OpenStreetMap) | Geocodificação de locais               |
| Leaflet + OpenStreetMap   | Renderização de mapas interativos      |