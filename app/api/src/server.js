import express from "express";
import cors from "cors";  
import _ from "lodash";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/healthz", (req, res) => res.json({ ok: true }));

app.get("/snacks", (req, res) => {
  const snacks = [
    { name: "Chili Chips", rating: 5 },
    { name: "Seaweed Snacks", rating: 4 },
    { name: "Pretzels", rating: 3 }
  ];
  res.json(_.orderBy(snacks, ["rating"], ["desc"]));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`bugbites api listening on :${port}`));
