const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { Server } = require("socket.io");
const http = require("http");

const { YSocketIO } = require("y-socket.io/dist/server");
const Y = require("yjs");
const ws = require("ws");
const fs = require("fs");
const path = require("path");
const userSocketMapFilePath = path.join(__dirname, "userSocketMap.json");

const { ACTIONS } = require("./Actions");
const { analyzeImage, generateContent } = require("./GoogleGemini");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const ysocketio = new YSocketIO(io, {
  gcEnabled: false,
});
ysocketio.initialize();

// ysocketio.on("document-update", (update) => {
//   console.log(
//     "Document updated",
//     ysocketio.documents.get("demo1").getText("monaco").toString()
//   );
// });

// ysocketio.on("document-loaded", (doc) => {
//   console.log("Document loadedd demo1", ysocketio.documents.get("demo1").getText("monaco"));
// });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(fileUpload());

let userSocketMap = {};
const roomData = {};

// try {
//   const data = fs.readFileSync(userSocketMapFilePath, "utf8");
//   if (data) {
//     userSocketMap = JSON.parse(data);
//   }
//   console.log("User socket map is found", userSocketMap);
// } catch (err) {
//   if (err.code !== "ENOENT") {
//     console.error("Error reading userSocketMap.json:", err);
//   }
// }

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId].username,
        userColor: userSocketMap[socketId].userColor,
      };
    }
  );
}

function generateTimeStamp() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const timestamp = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  return timestamp;
}

function getRandomColor() {
  let r = Math.floor(Math.random() * 128) + 128;
  let g = Math.floor(Math.random() * 128) + 128;
  let b = Math.floor(Math.random() * 128) + 128;

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    if (!roomData[roomId]) {
      code = `function sayHello() {
        console.log("Hello, World!");
  }`;
      roomData[roomId] = {
        code,
        messages: [],
        text: "",
      };
    }
    userSocketMap[socket.id] = {
      username: username,
      userColor: getRandomColor(),
    };
    // fs.writeFileSync(
    //   userSocketMapFilePath,
    //   JSON.stringify(userSocketMap, null, 2)
    // );
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach((client) => {
      io.to(client.socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: client.socketId,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    //Send to all users except the sender
    roomData[roomId] = { ...roomData[roomId], code };
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.TEXT_CHANGE, ({ roomId, text }) => {
    roomData[roomId] = { ...roomData[roomId], text };

    socket.in(roomId).emit(ACTIONS.TEXT_CHANGE, { text });
  });

  socket.on(ACTIONS.SYNC_CHANGES, ({ roomId, socketId }) => {
    //Send to just newly joined user.
    io.to(socketId).emit(ACTIONS.SYNC_CHANGES, { roomData: roomData[roomId] });
  });

  socket.on(ACTIONS.MESSAGE, ({ roomId, message }) => {
    if (roomData[roomId]) {
      roomData[roomId] = {
        ...roomData[roomId],
        messages: [
          ...roomData[roomId].messages,
          {
            message,
            id: Date.now(),
            username: userSocketMap[socket.id],
            timestamp: generateTimeStamp(),
          },
        ],
      };
    }
    //Emit even to all users including the sender
    io.in(roomId).emit(ACTIONS.MESSAGE, {
      message,
      id: Date.now(),
      username: userSocketMap[socket.id],
      socketId: socket.id,
      timestamp: generateTimeStamp(),
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      const remainingClients = getAllConnectedClients(roomId);

      // Emit a disconnect event to others in the room
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id].username,
      });

      // If this was the last client, clean up the room and Yjs doc
      if (remainingClients.length === 1) {
        delete roomData[roomId];

        // Access the Yjs document and destroy it
        const doc = ysocketio.documents.get(roomId); // Fetch the Yjs doc by roomId
        if (doc) {
          doc.destroy(); // Destroy the document
          console.log(`Destroyed Yjs document for room: ${roomId}`);
        }
      }
    });

    // Clean up user mappings from memory and file
    delete userSocketMap[socket.id];

    // Update the JSON file with the removed user
    // fs.writeFileSync(
    //   userSocketMapFilePath,
    //   JSON.stringify(userSocketMap, null, 2)
    // );

    socket.leave();
  });
});

app.post("/analyze-image", async (req, res) => {
  try {
    const { file } = req.files;
    const result = await analyzeImage(file);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error Analyzing Image" });
    console.error("Error Analyzing Image:", error);
  }
});
app.post("/generate-content", async (req, res) => {
  try {
    const { userInstructions } = req.body;
    const result = await generateContent(userInstructions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error generating content" });
    console.error("Error generating content:", error);
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server has started listening on port " + PORT);
});
