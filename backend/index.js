import "dotenv/config";
import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
// import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/KalakritiChatbot");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// ImageKit configuration
const imagekit = new ImageKit({
  urlEndpoint: "https://ik.imagekit.io/uwb4jy2lf",
  publicKey: "public_HZcPaJmx+e/xXknVfQSnKNy+1mM=",
  privateKey: "private_gl2nKR1wRnx6By0lGu6YG1pegU0=",
});

// // Clerk configuration
// app.use(
//   ClerkExpressRequireAuth({
//     apiKey: "sk_test_vEg05hrNJZ37Rc2ceZcgtplef5om1ttiOExBaaaQbt", // Your Clerk secret key
//     frontendApi: "pk_test_ZXRlcm5hbC1ncmlmZm9uLTE2LmNsZXJrLmFjY291bnRzLmRldiQ", // Your Clerk publishable key
//   })
// );

// Routes
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});
app.use(ClerkExpressRequireAuth());
// // Protected route example
// app.get("/api/t", ClerkExpressRequireAuth(), (req, res) => {
//   console.log("Success");
//   res.send("Success!");
// });

// Chat POST route
app.post("/api/chats", async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;
  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    const userChats = await UserChats.find({ userId: userId });
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [{ _id: savedChat.id, title: text.substring(0, 40) }],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: { _id: savedChat._id, title: text.substring(0, 40) },
          },
        }
      );
    }
    res.status(201).send(newChat._id);
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).send("Error saving chat");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userchats = await UserChats.find({ userId: userId });
    res.status(200).send(userchats[0].chats);
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  console.log("Requested chat ID:", req.params.id); // Log the ID
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) {
      return res.status(404).send("Chat not found");
    }
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching chat");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  console.log("Updating chat ID:", req.params.id); // Log the ID

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );

    if (updatedChat.matchedCount === 0) {
      return res.status(404).send("Chat not found or not authorized to update");
    }

    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

// Start the server
app.listen(port, () => {
  connect();
  console.log(`Server running on port ${port}`);
});
