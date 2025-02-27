import { Readable } from "stream";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get('/api/streams', (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  const data = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 },
    { name: "Jim", age: 40 },
    { name: "Jill", age: 35 },
    { name: "Jack", age: 50 },
    { name: "Jenny", age: 45 },
    { name: "Joe", age: 60 },
    { name: "Jen", age: 55 },
  ];

  const arrayStream = new Readable({
    objectMode: true,
    read() {
      if (data.length === 0) {
        this.push(null); // End the stream
      } else {
        setTimeout(() => {
          this.push(JSON.stringify(data.shift()) + '\n'); // Send one object at a time
        }, 1000); // Delay of 1 second per line
      }
    }
  });

  arrayStream.pipe(res); // Pipe data directly to the response
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
