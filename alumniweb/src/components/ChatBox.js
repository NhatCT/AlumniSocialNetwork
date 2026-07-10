import { ref, onValue, push } from "firebase/database";
import { db } from "../configs/firebaseConfig";
import { useEffect, useState, useRef } from "react";

const ChatBox = ({ currentUserId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const messagesEndRef = useRef(null);

    const chatId = [currentUserId, receiverId].sort().join('_');

    useEffect(() => {
        const msgRef = ref(db, `chats/${chatId}/messages`);
        onValue(msgRef, snapshot => {
            const msgs = snapshot.val();
            if (msgs) {
                setMessages(Object.values(msgs).sort((a, b) => a.timestamp - b.timestamp));
            } else {
                setMessages([]);
            }
        });
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e?.preventDefault();
        if (!newMsg.trim()) return;

        const msgRef = ref(db, `chats/${chatId}/messages`);
        await push(msgRef, {
            senderId: currentUserId,
            content: newMsg,
            timestamp: Date.now()
        });

        setNewMsg("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-box">
            {/* Header */}
            <div className="chat-box-header">
                <img
                    src="https://res.cloudinary.com/dlnru7sj1/image/upload/v1753591841/wu5x3zqqgl7vgt4jgkxm.png"
                    alt=""
                />
                <div>
                    <div className="chat-header-name">Người dùng #{receiverId}</div>
                    <div className="chat-header-status">● Trực tuyến</div>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px', fontSize: '14px' }}>
                        👋 Hãy gửi tin nhắn đầu tiên!
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
                        <div>
                            <div className="message-bubble">
                                {msg.content}
                            </div>
                            <div className="message-time">
                                {formatTime(msg.timestamp)}
                                {msg.senderId === currentUserId && ' ✓✓'}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                />
                <button type="submit" className="chat-send-btn" disabled={!newMsg.trim()}>
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
