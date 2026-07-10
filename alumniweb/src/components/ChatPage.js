import { useState, useContext } from "react";
import ChatSidebar from "./ChatSideBar";
import ChatBox from "./ChatBox";
import { MyUserContext } from "../configs/Context";

const ChatPage = () => {
    const [user] = useContext(MyUserContext);
    const [receiverId, setReceiverId] = useState(null);

    return (
        <div className="chat-layout">
            <ChatSidebar currentUserId={user?.id?.toString()} onSelectUser={setReceiverId} />
            {receiverId ? (
                <ChatBox currentUserId={user?.id?.toString()} receiverId={receiverId} />
            ) : (
                <div className="chat-empty">
                    <div className="empty-icon">💬</div>
                    <h3>Chọn cuộc trò chuyện</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Hãy chọn một người bạn để bắt đầu nhắn tin</p>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
