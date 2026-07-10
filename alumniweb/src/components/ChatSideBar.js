import { ref, onValue } from "firebase/database";
import { db } from "../configs/firebaseConfig";
import { useEffect, useState } from "react";

const ChatSidebar = ({ currentUserId, onSelectUser }) => {
    const [chatUsers, setChatUsers] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const chatRef = ref(db, 'chats');
        onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            const users = new Set();
            Object.keys(data).forEach(chatId => {
                const [uid1, uid2] = chatId.split('_');
                if (uid1 === currentUserId) users.add(uid2);
                else if (uid2 === currentUserId) users.add(uid1);
            });

            setChatUsers(Array.from(users));
        });
    }, [currentUserId]);

    const handleSelect = (uid) => {
        setSelected(uid);
        onSelectUser(uid);
    };

    return (
        <div className="chat-sidebar">
            <div className="chat-sidebar-header">
                <h2>💬 Tin nhắn</h2>
            </div>

            <div className="chat-search">
                <input type="text" placeholder="Tìm kiếm cuộc trò chuyện..." />
            </div>

            <div className="chat-user-list">
                {chatUsers.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                        Chưa có cuộc trò chuyện nào
                    </div>
                ) : (
                    chatUsers.map(uid => (
                        <div
                            key={uid}
                            className={`chat-user-item ${selected === uid ? 'active' : ''}`}
                            onClick={() => handleSelect(uid)}
                        >
                            <div className="avatar-wrapper">
                                <img
                                    src="https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png"
                                    alt=""
                                />
                                <div className="online-dot" />
                            </div>
                            <div className="chat-preview">
                                <div className="chat-name">Người dùng #{uid}</div>
                                <div className="chat-last-msg">Nhấn để xem tin nhắn</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
