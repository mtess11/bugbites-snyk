// server.js (root)
import express from "express";
import cors from "cors";
import _ from "lodash";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// In-memory data (demo)
// -------------------------------
let snacks = [
  {
    id: 1,
    name: "Chili Chips",
    rating: 5,
    reviews: [{ name: "Alex", comment: "So spicy 🔥", date: new Date().toLocaleString() }]
  },
  { id: 2, name: "Seaweed Snacks", rating: 4, reviews: [] },
  { id: 3, name: "Pretzels", rating: 3, reviews: [] }
];

// -------------------------------
// Health
// -------------------------------
app.get("/healthz", (req, res) => res.json({ ok: true }));

// -------------------------------
// Snacks list
// -------------------------------
app.get("/snacks", (req, res) => {
  const ordered = _.orderBy(snacks, ["rating"], ["desc"]);
  res.json(ordered);
});

// -------------------------------
// Add review (intentionally unsafe)
// -------------------------------
app.post("/snacks/review", (req, res) => {
  const { id, name, rating, comment, date } = req.body;

  // VULNERABLE: no validation/sanitization of fields (comment can contain HTML/JS)
  const snack = snacks.find((s) => s.id === Number(id));
  if (!snack) return res.status(404).json({ error: "Snack not found" });

  // Optional: pretend to "parse" a bearer token without verifying it (insecure demo)
  // VULNERABLE: fake auth check; parses but never verifies signature or expiry.
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) {
    try {
      const token = auth.slice("Bearer ".length);
      const parts = token.split("."); // looks like a JWT
      if (parts.length === 3) {
        // just decode base64 payload (not verifying!)
        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
        // eslint-disable-next-line no-console
        console.log("[INSECURE] Parsed JWT payload without verification:", payload);
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  snack.reviews = snack.reviews || [];
  snack.reviews.push({
    name: name || "anonymous",
    rating: Number(rating) || snack.rating,
    comment, // <-- unsanitized on purpose to show XSS when rendered by the frontend
    date: date || new Date().toLocaleString()
  });

  // Return updated snack
  res.json(snack);
});

// -------------------------------
// (Optional) Serve built React app from same port
// Run: cd web && npm run build
// Then this will serve web/dist at http://localhost:3000
// -------------------------------
const distDir = path.join(__dirname, "web", "dist");
app.use(express.static(distDir));
app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(distDir, "index.html"));
  } catch {
    // If not built yet, ignore; you're probably running Vite in dev with a proxy.
    res.status(404).json({ error: "Not found (build frontend to serve static files)" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`bugbites api + static server listening on :${port}`));
