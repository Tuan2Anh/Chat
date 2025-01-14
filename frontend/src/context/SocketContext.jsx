import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]); // Trạng thái thông báo
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const newSocket = io("https://chat-real-time-update1-1.onrender.com", {
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(newSocket);

            // Lắng nghe danh sách người dùng trực tuyến
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Lắng nghe sự kiện nhận tin nhắn mới
            newSocket.on("newMessage", (message) => {
                setNotifications((prev) => [
                    ...prev,
                    { id: Date.now(), content: message.content },
                ]);
            });

            // Dọn dẹp khi component bị hủy hoặc khi userId thay đổi
            return () => {
                newSocket.close();
                setSocket(null);
            };
        }
    }, [authUser]);

    // Xóa thông báo sau 3 giây
    useEffect(() => {
        if (notifications.length > 0) {
            const timer = setTimeout(() => {
                setNotifications((prev) => prev.slice(1));
            }, 3000);
            return () => clearTimeout(timer); // Dọn dẹp bộ đếm thời gian
        }
    }, [notifications]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                onlineUsers,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
