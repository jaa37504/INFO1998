import express, { Express, Request, Response, NextFunction } from 'express';
import axios from "axios";
import cors from "cors";
import { db } from "./firebase";


const app: Express = express();
const port = 8080;


app.use(cors());
app.use(express.json());

// app.get("/api/", (req, res) => {
//   res.send("hello world!");
// });

// app.post("/api/", async (req, res) => {
//   const key = req.body.key;
//   console.log(key);
//   // Do something with the key
//   res.json({ message: "Hello, world!" });
// });

// List all palettes
app.get("/api/palettes", async (_req, res, next) => {
    try {
      const snap = await db.collection("palettes").get();
      const palettes = snap.docs.map(d => ({ id: d.id, ...d.data() }));   // <-- spread operator
      res.json(palettes);
    } catch (err) {
      next(err);
    }
  });
  
  // Get one palette
  app.get("/api/palettes/:id", async (req, res, next) => {
    try {
      const doc = await db.doc(`palettes/${req.params.id}`).get();
      if (!doc.exists) return res.status(404).json({ error: "Not found" });
      res.json({ id: doc.id, ...doc.data() });  // <-- spread operator
    } catch (err) {
      next(err);
    }
  });
  
  // Create a palette
  app.post("/api/palettes", async (req, res, next) => {
    try {
      const ref = await db.collection("palettes").add(req.body);
      const created = await ref.get();
      res.status(201).json({ id: ref.id, ...created.data() });  // <-- spread operator
    } catch (err) {
      next(err);
    }
  });

// Update a palette
app.put("/api/palettes/:id", async (req, res, next) => {
  try {
    const ref = db.doc(`palettes/${req.params.id}`);
    await ref.update(req.body);
    const updated = await ref.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    next(err);
  }
});

// Delete a palette
app.delete("/api/palettes/:id", async (req, res, next) => {
  try {
    await db.doc(`palettes/${req.params.id}`).delete();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

