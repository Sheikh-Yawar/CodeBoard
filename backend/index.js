const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const { Server } = require("socket.io");
const http = require("http");
const { ACTIONS } = require("./Actions");
const { analyzeImage, generateContent } = require("./GoogleGemini");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(fileUpload());

const userSocketMap = {};
const roomData = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
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
        selectedLanguage: "",
        text: "",
      };
    }
    userSocketMap[socket.id] = username;
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
    const clients = getAllConnectedClients(roomId);
    console.log("Clients", clients);
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
      timestamp: generateTimeStamp(),
    });
  });

  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, username, language }) => {
    if (roomData[roomId]) {
      roomData[roomId] = {
        ...roomData[roomId],
        selectedLanguage: language,
      };
    }
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, {
      username,
      language,
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      getAllConnectedClients(roomId).length === 1 && delete roomData[roomId];
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
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
