import { useEffect, useRef, useState } from "react";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import PushPinIcon from "@mui/icons-material/PushPin";
import ReplyIcon from "@mui/icons-material/Reply";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ForwardIcon from "@mui/icons-material/Forward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

function MessageList({
    messages,
    contacts,
    currentUser,
    onReact,
    onReply,
    onDelete,
    onPin,
    onForward,
    onToast,
}) {
    const bottomRef = useRef(null);
    const [actionAnchor, setActionAnchor] = useState(null);
    const [activeMsgId, setActiveMsgId] = useState(null);
    const [playingVoiceId, setPlayingVoiceId] = useState(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleMenuOpen = (e, msgId) => {
        e.stopPropagation();
        setActionAnchor(e.currentTarget);
        setActiveMsgId(msgId);
    };

    const handleMenuClose = () => {
        setActionAnchor(null);
        setActiveMsgId(null);
    };

    const handleCopy = (text) => {
        if (text) {
            navigator.clipboard.writeText(text);
            onToast && onToast("Copied to clipboard", "info");
        }
        handleMenuClose();
    };

    const togglePlayVoice = (id) => {
        setPlayingVoiceId((prev) => (prev === id ? null : id));
    };

    const activeMsg = messages.find((m) => m.id === activeMsgId);

    return (
        <div className="message-area-viewport" id="message-area-viewport">
            <div className="message-date-badge">
                <span>Today</span>
            </div>

            {messages.map((msg) => {
                const isOutgoing = msg.senderId === currentUser.id || msg.senderId === "me";
                const sender = contacts.find((c) => c.id === msg.senderId);
                const replyTarget = msg.replyTo ? messages.find((m) => m.id === msg.replyTo) : null;
                const isPlaying = playingVoiceId === msg.id;

                return (
                    <div
                        key={msg.id}
                        className={`message-bubble-row ${isOutgoing ? "outgoing" : "incoming"}`}
                        id={`msg-row-${msg.id}`}
                    >
                        {/* Incoming sender avatar */}
                        {!isOutgoing && sender && (
                            <img
                                src={sender.avatar}
                                alt={sender.name}
                                className="msg-sender-avatar"
                                title={sender.name}
                            />
                        )}

                        <div className="message-content-wrapper">
                            {/* Message Bubble Card */}
                            <div className={`message-bubble-card ${isOutgoing ? "bubble-out" : "bubble-in"} ${msg.pinned ? "bubble-pinned" : ""}`}>
                                {/* Pin mark */}
                                {msg.pinned && (
                                    <div className="bubble-pin-indicator" title="Pinned message">
                                        <PushPinIcon style={{ fontSize: 12 }} />
                                    </div>
                                )}

                                {/* Hover trigger for action menu */}
                                <button
                                    type="button"
                                    className="bubble-action-trigger"
                                    onClick={(e) => handleMenuOpen(e, msg.id)}
                                    title="Message options"
                                >
                                    <MoreVertIcon style={{ fontSize: 14 }} />
                                </button>

                                {/* Replying to preview */}
                                {replyTarget && (
                                    <div className={`bubble-reply-box ${isOutgoing ? "reply-out" : "reply-in"}`}>
                                        <span className="reply-sender-title">
                                            {replyTarget.senderId === "me" ? "You" : sender?.name || "Contact"}
                                        </span>
                                        <p className="reply-snippet-text">{replyTarget.text || "Attachment"}</p>
                                    </div>
                                )}

                                {/* 1. Document Attachment UI */}
                                {msg.file && (
                                    <div className="msg-file-attachment">
                                        <div className="file-icon-box">
                                            <InsertDriveFileIcon style={{ fontSize: 24, color: isOutgoing ? "#fff" : "#4f46e5" }} />
                                        </div>
                                        <div className="file-info-col">
                                            <p className="file-name-text">{msg.file.name}</p>
                                            <span className="file-meta-text">{msg.file.size} • {msg.file.type?.toUpperCase()}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="file-download-btn"
                                            title="Download document"
                                            onClick={() => onToast && onToast(`Downloaded ${msg.file.name}`, "success")}
                                        >
                                            <DownloadIcon style={{ fontSize: 16 }} />
                                        </button>
                                    </div>
                                )}

                                {/* 2. Voice Message UI */}
                                {msg.voice && (
                                    <div className="msg-voice-attachment">
                                        <button
                                            type="button"
                                            className="voice-play-toggle"
                                            onClick={() => togglePlayVoice(msg.id)}
                                            title={isPlaying ? "Pause" : "Play"}
                                        >
                                            {isPlaying ? <PauseIcon style={{ fontSize: 18 }} /> : <PlayArrowIcon style={{ fontSize: 18 }} />}
                                        </button>
                                        <div className={`voice-waveform ${isPlaying ? "playing" : ""}`}>
                                            <span style={{ height: "40%" }} />
                                            <span style={{ height: "80%" }} />
                                            <span style={{ height: "60%" }} />
                                            <span style={{ height: "100%" }} />
                                            <span style={{ height: "70%" }} />
                                            <span style={{ height: "45%" }} />
                                            <span style={{ height: "90%" }} />
                                            <span style={{ height: "60%" }} />
                                            <span style={{ height: "75%" }} />
                                            <span style={{ height: "50%" }} />
                                        </div>
                                        <span className="voice-duration-label">
                                            {isPlaying ? "0:06" : msg.voice.duration || "0:14"}
                                        </span>
                                    </div>
                                )}

                                {/* 3. Text Message */}
                                {msg.text && (
                                    <div className="bubble-text-content">
                                        {msg.text}
                                    </div>
                                )}

                                {/* Message Footer: Time + Status Checks */}
                                <div className="bubble-meta-footer">
                                    <span className="bubble-time-text">{msg.time}</span>
                                    {isOutgoing && (
                                        <span className="bubble-status-checks">
                                            {msg.status === "read" ? (
                                                <DoneAllIcon style={{ fontSize: 14, color: "#818cf8" }} />
                                            ) : (
                                                <DoneIcon style={{ fontSize: 14, opacity: 0.8 }} />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Emoji Reactions List */}
                            {msg.reactions && msg.reactions.length > 0 && (
                                <div className="bubble-reactions-row">
                                    {msg.reactions.map((r, i) => (
                                        <span
                                            key={i}
                                            className="reaction-tag"
                                            onClick={() => onReact(msg.id, r.emoji)}
                                            title="Toggle reaction"
                                        >
                                            {r.emoji}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Scroll bottom target */}
            <div ref={bottomRef} />

            {/* Action Menu (Reply, React, Copy, Forward, Delete) */}
            <Menu
                anchorEl={actionAnchor}
                open={Boolean(actionAnchor)}
                onClose={handleMenuClose}
            >
                {/* Quick emoji row */}
                <div className="menu-emoji-quick-strip">
                    {QUICK_EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            className="menu-emoji-btn"
                            onClick={() => {
                                if (activeMsgId) onReact(activeMsgId, emoji);
                                handleMenuClose();
                            }}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <MenuItem
                    onClick={() => {
                        if (activeMsgId) onReply(activeMsgId);
                        handleMenuClose();
                    }}
                    dense
                >
                    <ReplyIcon style={{ fontSize: 16, marginRight: 8, color: "#6366f1" }} />
                    Reply
                </MenuItem>

                {activeMsg?.text && (
                    <MenuItem onClick={() => handleCopy(activeMsg.text)} dense>
                        <ContentCopyIcon style={{ fontSize: 16, marginRight: 8, color: "#64748b" }} />
                        Copy
                    </MenuItem>
                )}

                <MenuItem
                    onClick={() => {
                        if (activeMsgId) onPin(activeMsgId);
                        handleMenuClose();
                    }}
                    dense
                >
                    <PushPinIcon style={{ fontSize: 16, marginRight: 8, color: "#6366f1" }} />
                    {activeMsg?.pinned ? "Unpin message" : "Pin message"}
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        if (onForward && activeMsgId) onForward(activeMsgId);
                        handleMenuClose();
                    }}
                    dense
                >
                    <ForwardIcon style={{ fontSize: 16, marginRight: 8, color: "#64748b" }} />
                    Forward
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        if (activeMsgId) onDelete(activeMsgId);
                        handleMenuClose();
                    }}
                    dense
                    sx={{ color: "#ef4444" }}
                >
                    <DeleteIcon style={{ fontSize: 16, marginRight: 8 }} />
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}

export default MessageList;
