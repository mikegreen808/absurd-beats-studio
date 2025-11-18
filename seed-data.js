import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const dataset = [
  {
    id: "1",
    title: "Absurd Groove",
    bpm: 120,
    key: "C minor",
    existential_tag: "Absurdity",
    notes: "Recorded at 2am, contemplating meaninglessness"
  },
  {
    id: "2",
    title: "Freedom Frequencies",
    bpm: 95,
    key: "E major",
    existential_tag: "Authenticity",
    notes: "Improvised jam exploring existential choice"
  },
  {
    id: "3",
    title: "Echoes of Absurdity",
    bpm: 110,
    key: "A minor",
    existential_tag: "Absurdity",
    notes: "Layered synth echoes reflecting Camus’ philosophy"
  },
  {
    id: "4",
    title: "Silence of Meaning",
    bpm: 60,
    key: "D minor",
    existential_tag: "Nihilism",
    notes: "Minimal ambient textures questioning the void"
  },
  {
    id: "5",
    title: "Groove of Freedom",
    bpm: 100,
    key: "G major",
    existential_tag: "Freedom",
    notes: "Loose rhythm tied to existential choice"
  },
  {
    id: "6",
    title: "Bassline of Authenticity",
    bpm: 128,
    key: "F minor",
    existential_tag: "Authenticity",
    notes: "Deep tones grounding Sartre’s call to live authentically"
  },
  {
    id: "7",
    title: "Echo Chamber of Angst",
    bpm: 85,
    key: "B minor",
    existential_tag: "Angst",
    notes: "Reverberant synths mirroring Kierkegaard’s dread"
  },
  {
    id: "8",
    title: "Tempo of Transcendence",
    bpm: 140,
    key: "C major",
    existential_tag: "Transcendence",
    notes: "Uplifting BPM striving beyond the ordinary"
  },
  {
    id: "9",
    title: "Loop of Nothingness",
    bpm: 70,
    key: "E minor",
    existential_tag: "Nihilism",
    notes: "Hypnotic repetition nodding to eternal return"
  },
  {
    id: "10",
    title: "Resonance of Responsibility",
    bpm: 115,
    key: "A major",
    existential_tag: "Responsibility",
    notes: "Harmonic layers symbolizing the weight of freedom"
  },
  {
    id: "11",
    title: "Drop into the Void",
    bpm: 128,
    key: "D# minor",
    existential_tag: "Void",
    notes: "Heavy beat drop, existential plunge"
  },
  {
    id: "12",
    title: "Harmony of Absurdity",
    bpm: 105,
    key: "G minor",
    existential_tag: "Absurdity",
    notes: "Dissonant chords balanced with playful groove"
  },
  {
    id: "13",
    title: "Being-toward-Bass",
    bpm: 90,
    key: "F# minor",
    existential_tag: "Being",
    notes: "Subwoofer philosophy inspired by Heidegger"
  }
];

// Helper: split array into chunks of size n
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function batchWriteWithRetry(requestItems, tableName) {
  let unprocessed = requestItems;

  while (unprocessed.length > 0) {
    try {
      const res = await client.send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName]: unprocessed.map(track => ({
              PutRequest: { Item: track }
            }))
          }
        })
      );

      if (res.UnprocessedItems && res.UnprocessedItems[tableName]) {
        // Retry only the unprocessed items
        unprocessed = res.UnprocessedItems[tableName].map(req => req.PutRequest.Item);
        console.warn("⚠️ Retrying", unprocessed.length, "items...");
        // Optional: add a small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        unprocessed = [];
      }
    } catch (err) {
      console.error("❌ Error inserting batch:", err);
      break;
    }
  }
}

async function seedData() {
  const chunks = chunkArray(dataset, 25); // DynamoDB limit
  for (const chunk of chunks) {
    await batchWriteWithRetry(chunk, "Tracks");
    console.log("✅ Batch inserted:", chunk.length, "items");
  }
}

seedData();