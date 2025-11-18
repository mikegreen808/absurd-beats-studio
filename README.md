# 🎧 Absurd Beats Studio

A full‑stack project fusing **existential philosophy** with **music production**.  
Absurd Beats Studio lets you create, read, update, delete, and filter tracks — all wrapped in a neon‑themed front end with rotating quotes from philosophers and musicians.

---

## ✨ Features

- **Create** → Add new tracks with title, BPM, key, existential tag, and notes  
- **Read** → Fetch and display all tracks in a responsive grid  
- **Update** → Edit track details inline (currently title, extendable to other fields)  
- **Delete** → Remove tracks instantly with a glowing delete button  
- **Filter** → Search bar filters tracks live by text content  
- **UI Polish** → Neon‑styled cards, pulsing track counter, animated quote ticker  

---

## 🛠️ Tech Stack

- **Frontend** → HTML, CSS, Vanilla JS (`app.js`)  
- **Backend** → Express.js with RESTful routes (`/tracks`, `/tracks/:id`)  
- **Data** → JSON objects seeded into the API (extendable to DynamoDB/Terraform)  
- **Dev Tools** → Nodemon for hot reload, GitHub for version control  

---

## Project Structure
absurd-beats-studio/
├── index.html        # Frontend entry point
├── style.css         # Neon-themed styles
├── app.js            # CRUD-F logic + UI interactions
├── controllers/      # Express controllers
├── routes/           # Express router
├── server.js         # Backend entry point
└── README.md         # Project documentation

Philosophy Meets Music

Absurd Beats Studio isn’t just CRUD — it’s a mash‑up of existential thought and rhythm.  
Expect quotes from Sartre, Camus, Kierkegaard, Nietzsche, Bowie, Marley, and more, pulsing alongside your tracks.