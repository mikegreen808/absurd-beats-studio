// ===== Helper: update track count =====
function updateTrackCount(count, longPulse = false) {
  const header = document.getElementById("output-header");
  header.textContent = `🎵 Tracks (${count})`;
  header.classList.remove("pulse", "pulse-long");
  void header.offsetWidth; // force reflow
  header.classList.add(longPulse ? "pulse-long" : "pulse");
}

// ===== Validation Helper =====
function validateField(input, type) {
  let value = input.value.trim();
  let valid = true;
  let message = "";

  switch (type) {
    case "title":
      valid = value.length > 0;
      if (!valid) message = "Title cannot be empty.";
      break;
    case "bpm":
      const bpm = parseInt(value, 10);
      valid = !isNaN(bpm) && bpm >= 40 && bpm <= 300;
      if (!valid) message = "BPM must be between 40 and 300.";
      break;
    case "key":
      valid = /^[A-G](#|b)?m?$/.test(value);
      if (!valid) message = "Key must be a valid musical key (e.g. C, G#m, Bb).";
      break;
    case "tag":
      valid = value.length > 0;
      if (!valid) message = "Existential tag cannot be empty.";
      break;
  }

  const errorEl = input.nextElementSibling;
  if (!valid) {
    input.style.borderColor = "red";
    input.style.boxShadow = "0 0 10px red";
    if (errorEl && errorEl.classList.contains("error-message")) {
      errorEl.textContent = message;
    }
  } else {
    input.style.borderColor = "#00FFFF";
    input.style.boxShadow = "0 0 10px #00FFFF";
    if (errorEl && errorEl.classList.contains("error-message")) {
      errorEl.textContent = "";
    }
  }

  return valid;
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

  // Edit (inline form with validation)
  card.querySelector(".edit-btn").addEventListener("click", () => {
    card.innerHTML = `
      <form class="edit-form">
        <input id="edit-title" value="${track.title}" placeholder="Title" />
        <div class="error-message"></div>
        <input id="edit-bpm" type="number" value="${track.bpm}" placeholder="BPM" />
        <div class="error-message"></div>
        <input id="edit-key" value="${track.key}" placeholder="Key" />
        <div class="error-message"></div>
        <input id="edit-tag" value="${track.existential_tag}" placeholder="Tag" />
        <div class="error-message"></div>
        <textarea id="edit-notes" placeholder="Notes">${track.notes || ""}</textarea>
        <div class="edit-actions">
          <button type="button" class="save-btn">💾 Save</button>
          <button type="button" class="cancel-btn">❌ Cancel</button>
        </div>
      </form>
    `;

    const titleInput = document.getElementById("edit-title");
    const bpmInput = document.getElementById("edit-bpm");
    const keyInput = document.getElementById("edit-key");
    const tagInput = document.getElementById("edit-tag");

    // Live validation
    titleInput.addEventListener("input", () => validateField(titleInput, "title"));
    bpmInput.addEventListener("input", () => validateField(bpmInput, "bpm"));
    keyInput.addEventListener("input", () => validateField(keyInput, "key"));
    tagInput.addEventListener("input", () => validateField(tagInput, "tag"));

    // Save
    card.querySelector(".save-btn").addEventListener("click", async () => {
      const validTitle = validateField(titleInput, "title");
      const validBpm = validateField(bpmInput, "bpm");
      const validKey = validateField(keyInput, "key");
      const validTag = validateField(tagInput, "tag");
      if (!validTitle || !validBpm || !validKey || !validTag) return;

      const updated = {
        ...track,
        title: titleInput.value.trim(),
        bpm: parseInt(bpmInput.value, 10),
        key: keyInput.value.trim(),
        existential_tag: tagInput.value.trim(),
        notes: document.getElementById("edit-notes").value.trim()
      };

      try {
        const res = await fetch(`http://localhost:3000/tracks/${track.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);

        Object.assign(track, updated);
        card.replaceWith(createTrackCard(track));
        updateTrackCount(document.querySelectorAll(".track-card").length);
      } catch (err) {
        alert("❌ Could not update track (" + err.message + ")");
      }
    });

    // Cancel
    card.querySelector(".cancel-btn").addEventListener("click", () => {
      card.replaceWith(createTrackCard(track));
    });
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

// ===== Init =====
window.onload = () => {
  setRandomQuote();
  setInterval(setRandomQuote, 10000);
  updateTrackCount(0, false);
};