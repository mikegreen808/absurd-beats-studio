import fetch from "node-fetch";

const dataset = [
  [
  {
    "id": "1",
    "title": "Absurd Groove",
    "bpm": 120,
    "key": "C minor",
    "existential_tag": "Absurdity",
    "notes": "Recorded at 2am, contemplating meaninglessness"
  },
  {
    "id": "2",
    "title": "Freedom Frequencies",
    "bpm": 95,
    "key": "E major",
    "existential_tag": "Authenticity",
    "notes": "Improvised jam exploring existential choice"
  },
  {
    "id": "3",
    "title": "Echoes of Absurdity",
    "bpm": 110,
    "key": "A minor",
    "existential_tag": "Absurdity",
    "notes": "Layered synth echoes reflecting Camus’ philosophy"
  },
  {
    "id": "4",
    "title": "Silence of Meaning",
    "bpm": 60,
    "key": "D minor",
    "existential_tag": "Nihilism",
    "notes": "Minimal ambient textures questioning the void"
  },
  {
    "id": "5",
    "title": "Groove of Freedom",
    "bpm": 100,
    "key": "G major",
    "existential_tag": "Freedom",
    "notes": "Loose rhythm tied to existential choice"
  },
  {
    "id": "6",
    "title": "Bassline of Authenticity",
    "bpm": 128,
    "key": "F minor",
    "existential_tag": "Authenticity",
    "notes": "Deep tones grounding Sartre’s call to live authentically"
  },
  {
    "id": "7",
    "title": "Echo Chamber of Angst",
    "bpm": 85,
    "key": "B minor",
    "existential_tag": "Angst",
    "notes": "Reverberant synths mirroring Kierkegaard’s dread"
  },
  {
    "id": "8",
    "title": "Tempo of Transcendence",
    "bpm": 140,
    "key": "C major",
    "existential_tag": "Transcendence",
    "notes": "Uplifting BPM striving beyond the ordinary"
  },
  {
    "id": "9",
    "title": "Loop of Nothingness",
    "bpm": 70,
    "key": "E minor",
    "existential_tag": "Nihilism",
    "notes": "Hypnotic repetition nodding to eternal return"
  },
  {
    "id": "10",
    "title": "Resonance of Responsibility",
    "bpm": 115,
    "key": "A major",
    "existential_tag": "Responsibility",
    "notes": "Harmonic layers symbolizing the weight of freedom"
  },
  {
    "id": "11",
    "title": "Drop into the Void",
    "bpm": 128,
    "key": "D# minor",
    "existential_tag": "Void",
    "notes": "Heavy beat drop, existential plunge"
  },
  {
    "id": "12",
    "title": "Harmony of Absurdity",
    "bpm": 105,
    "key": "G minor",
    "existential_tag": "Absurdity",
    "notes": "Dissonant chords balanced with playful groove"
  },
  {
    "id": "13",
    "title": "Being-toward-Bass",
    "bpm": 90,
    "key": "F# minor",
    "existential_tag": "Being",
    "notes": "Subwoofer philosophy inspired by Heidegger"
  }
]
];

async function seedData() {
  for (const track of dataset) {
    const res = await fetch("http://localhost:3000/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(track)
    });
    console.log(await res.json());
  }
}

seedData();