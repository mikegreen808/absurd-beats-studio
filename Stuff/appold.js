// ===== Helper: update track count =====
function updateTrackCount(count, longPulse = false) {
  const header = document.getElementById("output-header");
  header.textContent = `🎵 Tracks (${count})`;
  header.classList.remove("pulse", "pulse-long");
  void header.offsetWidth; // force reflow
  header.classList.add(longPulse ? "pulse-long" : "pulse");
}

// ===== Helper: create track card with Edit/Delete =====
function createTrackCard(track) {
  const card = document.createElement("div");
  card.className = "track-card";
  card.innerHTML = `
    <div class="track-title">${track.title}</div>
    <div class="track-meta">🎵 BPM: ${track.bpm}</div>
    <div class="track-meta">🎹 Key: ${track.key}</div>
    <div class="track-tag">${track.existential_tag}</div>
    <div class="track-meta">📝 ${track.notes || ""}</div>
    <div class="card-actions">
      <button class="edit-btn">✏️ Edit</button>
      <button class="delete-btn">🗑️ Delete</button>
    </div>
  `;

  // Delete
  card.querySelector(".delete-btn").addEventListener("click", async () => {
    try {
      const res = await fetch(`http://localhost:3000/tracks/${track.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      card.remove();
      updateTrackCount(document.querySelectorAll(".track-card").length, true);
    } catch (err) {
      alert("❌ Could not delete track (" + err.message + ")");
    }
  });

  // Edit
  card.querySelector(".edit-btn").addEventListener("click", async () => {
    const newTitle = prompt("Edit title:", track.title);
    if (newTitle && newTitle !== track.title) {
      const updated = { ...track, title: newTitle };
      try {
        const res = await fetch(`http://localhost:3000/tracks/${track.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        card.querySelector(".track-title").textContent = newTitle;
        updateTrackCount(document.querySelectorAll(".track-card").length);
      } catch (err) {
        alert("❌ Could not update track (" + err.message + ")");
      }
    }
  });

  return card;
}

// ===== Fetch existing tracks =====
document.getElementById("fetch-btn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.innerHTML = '<div id="output-header">🎵 Tracks (0)</div>';

  try {
    const res = await fetch("http://localhost:3000/tracks");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    updateTrackCount(data.length, false);

    data.forEach((track, index) => {
      const card = createTrackCard(track);
      card.style.opacity = 0;
      output.appendChild(card);
      setTimeout(() => {
        card.style.transition = "opacity 0.8s ease";
        card.style.opacity = 1;
      }, index * 150);
    });
  } catch (err) {
    output.innerHTML = '<div id="output-header">🎵 Tracks (0)</div>';
    alert("❌ Could not reach backend (" + err.message + ")");
  }
});

// ===== Add Record Form =====
document.getElementById("record-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const track = {
    title: document.getElementById("title").value,
    bpm: parseInt(document.getElementById("bpm").value, 10),
    key: document.getElementById("key").value,
    existential_tag: document.getElementById("existential_tag").value,
    notes: document.getElementById("notes").value
  };

  try {
    const res = await fetch("http://localhost:3000/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(track)
    });
    if (!res.ok) throw new Error("HTTP " + res.status);

    const savedTrack = await res.json();
    const output = document.getElementById("output");
    const card = createTrackCard(savedTrack);
    card.style.opacity = 0;
    output.appendChild(card);

    setTimeout(() => {
      card.style.transition = "opacity 0.8s ease";
      card.style.opacity = 1;
    }, 100);

    updateTrackCount(output.querySelectorAll(".track-card").length, true);
    e.target.reset();
  } catch (err) {
    alert("❌ Could not save track (" + err.message + ")");
  }
});

// ===== Filter/Search =====
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.toLowerCase();
  const cards = document.querySelectorAll(".track-card");
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
  });
});

document.getElementById("search-input").addEventListener("input", () => {
  const query = document.getElementById("search-input").value.toLowerCase();
  const cards = document.querySelectorAll(".track-card");
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
  });
});

// ===== Quotes rotation =====
const quotes = [
  { text: "“Man is condemned to be free.” — Sartre", type: "philosopher" },
  { text: "“The struggle itself toward the heights is enough to fill a man's heart.” — Camus", type: "philosopher" },
  { text: "“Anxiety is the dizziness of freedom.” — Kierkegaard", type: "philosopher" },
  { text: "“Hell is other people.” — Sartre", type: "philosopher" },
  { text: "“One must imagine Sisyphus happy.” — Camus", type: "philosopher" },
  { text: "“Music is a safe kind of high.” — Jimi Hendrix", type: "musician" },
  { text: "“Without music, life would be a mistake.” — Nietzsche", type: "philosopher" },
  { text: "“One good thing about music, when it hits you, you feel no pain.” — Bob Marley", type: "musician" },
  { text: "“I’m just a musical prostitute, my dear.” — Freddie Mercury", type: "musician" },
  { text: "“The beautiful thing about music is that it transcends language.” — Herbie Hancock", type: "musician" },
  { text: "“Music can change the world because it can change people.” — Bono", type: "musician" },
  { text: "“Life is what happens while you are busy making other plans.” — John Lennon", type: "musician" },
  { text: "“Imagine all the people living life in peace.” — John Lennon", type: "musician" },
  { text: "“I don't know where I'm going from here, but I promise it won't be boring.” — David Bowie", type: "musician" },
  { text: "“We can be heroes, just for one day.” — David Bowie", type: "musician" }
];

function setRandomQuote() {
  const footer = document.getElementById("quote");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const chosen = quotes[randomIndex];
  footer.style.opacity = 0;
  footer.style.animation = "none";
  setTimeout(() => {
    footer.textContent = chosen.text;
    footer.className = chosen.type;
    footer.style.opacity = 1;
    footer.style.animation = "fadeQuote 0.8s ease";
  }, 500);
}

window.onload = () => {
  setRandomQuote();
  setInterval(setRandomQuote, 10000);
  updateTrackCount(0, false);
};