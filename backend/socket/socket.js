import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://chat-real-time-update1-1.onrender.com"],
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // {userId: socketId}

// Hàm lấy socketId của người nhận
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId] || null;
};

// Xử lý các sự kiện của socket
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;

    // Kiểm tra và ánh xạ userId với socketId
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;

        // Gửi danh sách người dùng trực tuyến đến tất cả các client
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Lắng nghe sự kiện nhận tin nhắn và gửi đến người nhận
    socket.on("sendMessage", ({ senderId, receiverId, content }) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", {
				senderId,
				content,
				timestamp: new Date(),
			});
			console.log("Sent newMessage event:", { senderId, content });
		}
	});
	

    // Lắng nghe sự kiện ngắt kết nối
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // Xóa userId khỏi userSocketMap
        for (const id in userSocketMap) {
            if (userSocketMap[id] === socket.id) {
                delete userSocketMap[id];
                break;
            }
        }

        // Gửi lại danh sách người dùng trực tuyến sau khi ngắt kết nối
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
