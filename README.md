# 🎧 Absurd Beats Studio

Full‑stack project fusing **existential philosophy** with **music production**.  
A CRUD application powered by Node.js/Express, DynamoDB, and Docker Compose.  
This project serves both an API and a static frontend, with full seeding support for test data.

<img width="3352" height="1301" alt="image" src="https://github.com/user-attachments/assets/8e7a416f-f7a0-4e4c-bc67-90af8ef0ab46" />



---

## ✨ Features

- **Create** → Add new tracks with title, BPM, key, existential tag, and notes  
- **Read** → Fetch and display all tracks in a responsive grid  
- **Update** → Edit track details inline 
- **Delete** → Remove tracks instantly with a glowing delete button  
- **Filter** → Search bar filters tracks live by text content  
- **Node.js/Express API** running on port `3000`
- **Python static server** serving frontend files on port `8080`
- **DynamoDB integration** for persistent track storage
- **Seeding script** to batch insert existential test tracks with retry logic
- **Docker Compose orchestration** for clean multi-service setup

---

## 🐳 Dockerisation

### Build & Run
```bash
docker-compose up --build
  
Services

•  API → http://localhost:3000
•  Frontend → http://localhost:8080

Compose File

•  api service builds from the provided Dockerfile (Node 18 Alpine).
•  web service uses Python to serve the frontend/ directory.
---
📦 DynamoDB Seeding

Install Dependencies
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
--
Run Seeder
node seed-data.js
--
Inside Docker
docker-compose run --rm api node seed-data.js
---
## Project Structure
absurd-beats-studio/
├── Dockerfile              # Node API container
├── docker-compose.yml      # Multi-service orchestration
├── seed-data.js            # DynamoDB seeding script
├── frontend/               # Static frontend files
├── package.json
└── src/                    # Express API source

---

🛠 Development Notes

•  Ensure AWS credentials are configured (~/.aws/credentials or env vars).
•  Table name: Tracks
•  Region: set in seed-data.js or via environment (AWS_REGION).
•  Logs will show ✅ for successful inserts and ⚠️ for retries.

---

🌐 Future Enhancements

•  Add Nginx reverse proxy to unify API (/api) and frontend (/).
•  CI/CD pipeline for container builds and DynamoDB migrations.
•  Expand seeding dataset with more existential tracks.


Philosophy Meets Music

Absurd Beats Studio isn’t just CRUD — it’s a mash‑up of existential thought and rhythm.  
Expect quotes from Sartre, Camus, Kierkegaard, Nietzsche, Bowie, Marley, and more, pulsing alongside your tracks.
