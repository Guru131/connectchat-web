import PushPinIcon from "@mui/icons-material/PushPin";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

function ChatList({ contacts, selectedId, onSelect, searchQuery }) {
    // Filter contacts based on search query
    const filtered = contacts.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinned = filtered.filter((c) => c.pinned);
    const others = filtered.filter((c) => !c.pinned);

    if (filtered.length === 0) {
        return (
            <div className="chat-list-container">
                <p className="no-chats">No conversations found</p>
            </div>
        );
    }

    return (
        <div className="chat-list-container">
            {pinned.length > 0 && (
                <>
                    <p className="chat-list-label">📌 Pinned</p>
                    {pinned.map((contact) => (
                        <ChatListItem
                            key={contact.id}
                            contact={contact}
                            isActive={contact.id === selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </>
            )}

            {others.length > 0 && (
                <>
                    {pinned.length > 0 && <p className="chat-list-label">Recent</p>}
                    {others.map((contact) => (
                        <ChatListItem
                            key={contact.id}
                            contact={contact}
                            isActive={contact.id === selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

// ── Single row in the chat list ──
function ChatListItem({ contact, isActive, onSelect }) {
    const { name, avatar, online, lastMessage, unreadCount, muted, pinned } = contact;

    return (
        <div
            className={`chat-list-item ${isActive ? "active" : ""}`}
            onClick={() => onSelect(contact.id)}
            id={`chat-item-${contact.id}`}
        >
            {/* Avatar with online indicator */}
            <div className="chat-avatar-wrap">
                <img src={avatar} alt={name} />
                <span className={`status-dot ${online ? "online" : "offline"}`} />
            </div>

            {/* Info */}
            <div className="chat-list-info">
                {/* Row 1: name + time */}
                <div className="chat-list-row">
                    <span className="chat-list-name">{name}</span>
                    <span className={`chat-list-time ${unreadCount > 0 && !muted ? "unread" : ""}`}>
                        {lastMessage.time}
                    </span>
                </div>

                {/* Row 2: last message + badges */}
                <div className="chat-list-row" style={{ marginTop: 2 }}>
                    <span className={`chat-list-preview ${muted ? "muted-text" : ""}`}>
                        {/* Tick for my messages */}
                        {lastMessage.fromMe && (
                            unreadCount === 0
                                ? <DoneAllIcon style={{ fontSize: 13, marginRight: 3, color: "#a5b4fc" }} />
                                : <DoneIcon style={{ fontSize: 13, marginRight: 3, color: "#818cf8" }} />
                        )}
                        {lastMessage.text}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        {muted && <VolumeOffIcon className="muted-icon" />}
                        {pinned && !muted && <PushPinIcon className="pin-icon" />}
                        {unreadCount > 0 && !muted && (
                            <span className="unread-badge">{unreadCount}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatList;
