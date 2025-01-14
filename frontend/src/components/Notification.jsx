import React, { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';

const Notification = () => {
  const { notifications, setNotifications } = useSocketContext(); // Sử dụng đúng hook

  useEffect(() => {
    if (notifications.length > 0) {
        const timer = setTimeout(() => {
            setNotifications((prev) => prev.filter((_, index) => index !== 0));
        }, 3000);

        return () => clearTimeout(timer);
    }
}, [notifications, setNotifications]);

useEffect(() => {
    console.log("Notifications:", notifications);
}, [notifications]);

  useEffect(() => {
    console.log("Notifications received:", notifications); // Debug notifications
  }, [notifications]);

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
          }}
        >
          {notif.content} {/* Hiển thị nội dung thông báo */}
        </div>
      ))}
    </div>
  );
};

export default Notification;
