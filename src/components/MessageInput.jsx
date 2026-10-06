import { useState, useRef, useEffect } from "react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import StopIcon from "@mui/icons-material/Stop";
import DescriptionIcon from "@mui/icons-material/Description";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Popover from "@mui/material/Popover";

const EMOJIS = [
    "😀","😁","😂","🤣","😊","😍","🥰","😎","🤔","😢",
    "👍","👎","❤️","🔥","🎉","✅","⭐","🙌","💪","🤝",
    "💼","🚀","💡","📢","⚡","🏆","🎯","💬","💯","✨"
];

function MessageInput({
    onSend,
    onSendDocument,
    onSendVoice,
    replyTo,
    onCancelReply,
    messages = [],
    contacts = [],
}) {
    const [text, setText] = useState("");
    const [emojiAnchor, setEmojiAnchor] = useState(null);
    const [attachAnchor, setAttachAnchor] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordSeconds, setRecordSeconds] = useState(0);
    const textareaRef = useRef(null);

    // Recording timer
    useEffect(() => {
        let timer;
        if (isRecording) {
            timer = setInterval(() => {
                setRecordSeconds((s) => s + 1);
            }, 1000);
        } else {
            setRecordSeconds(0);
        }
        return () => clearInterval(timer);
    }, [isRecording]);

    // Focus input on reply
    useEffect(() => {
        if (replyTo) {
            textareaRef.current?.focus();
        }
    }, [replyTo]);

    const handleTextChange = (e) => {
        setText(e.target.value);
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = "auto";
            ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setText("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const insertEmoji = (emoji) => {
        setText((prev) => prev + emoji);
        textareaRef.current?.focus();
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        const durationStr = `0:${String(recordSeconds).padStart(2, "0")}`;
        onSendVoice && onSendVoice(durationStr);
    };

    const handleCancelRecording = () => {
        setIsRecording(false);
        setRecordSeconds(0);
    };

    const handleAttachSelect = (type) => {
        setAttachAnchor(null);
        if (type === "document") {
            onSendDocument && onSendDocument({
                name: "Project_Proposal_2026.pdf",
                size: "2.4 MB",
                type: "pdf",
            });
        } else if (type === "photos") {
            onSendDocument && onSendDocument({
                name: "Wireframe_Mockups.png",
                size: "1.2 MB",
                type: "png",
            });
        } else if (type === "location") {
            onSend("📍 Shared location: Hyderabad, Telangana, India");
        } else {
            onSend("📷 Camera snapshot captured");
        }
    };

    // Find the message we are replying to
    const replyTarget = replyTo ? messages.find((m) => m.id === replyTo) : null;
    const replySender = replyTarget
        ? replyTarget.senderId === "me"
            ? { name: "You" }
            : contacts.find((c) => c.id === replyTarget.senderId)
        : null;

    const fmt = (s) => `0:${String(s).padStart(2, "0")}`;

    return (
        <div className="composer-container" id="composer-container">
            {/* Replying strip */}
            {replyTarget && (
                <div className="composer-reply-strip">
                    <div className="reply-strip-left-bar" />
                    <div className="reply-strip-info">
                        <span className="reply-strip-name">Replying to {replySender?.name || "Contact"}</span>
                        <p className="reply-strip-desc">{replyTarget.text || "Attachment"}</p>
                    </div>
                    <button
                        type="button"
                        className="reply-strip-close"
                        onClick={onCancelReply}
                        title="Cancel reply"
                    >
                        <CloseIcon style={{ fontSize: 16 }} />
                    </button>
                </div>
            )}

            {/* Composer Bar */}
            <div className="composer-bar">
                {isRecording ? (
                    /* Inline Voice Recording UI */
                    <div className="composer-recording-bar">
                        <div className="rec-live-indicator">
                            <span className="rec-red-pulse" />
                            <span className="rec-text-label">Recording {fmt(recordSeconds)}</span>
                        </div>
                        <div className="rec-action-buttons">
                            <button
                                type="button"
                                className="rec-cancel-btn"
                                onClick={handleCancelRecording}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="rec-stop-btn"
                                onClick={handleStopRecording}
                                title="Stop and send"
                            >
                                <StopIcon style={{ fontSize: 18 }} />
                                Send Audio
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Normal Composer controls */
                    <>
                        {/* Emoji Button */}
                        <button
                            type="button"
                            className="composer-icon-btn"
                            title="Emoji"
                            onClick={(e) => setEmojiAnchor(e.currentTarget)}
                            id="emoji-picker-btn"
                        >
                            <SentimentSatisfiedAltIcon style={{ fontSize: 21 }} />
                        </button>

                        {/* Attachment Button */}
                        <button
                            type="button"
                            className="composer-icon-btn"
                            title="Attach"
                            onClick={(e) => setAttachAnchor(e.currentTarget)}
                            id="attachment-btn"
                        >
                            <AttachFileIcon style={{ fontSize: 21 }} />
                        </button>

                        {/* Text input area */}
                        <div className="composer-textarea-wrap">
                            <textarea
                                ref={textareaRef}
                                id="message-input-textarea"
                                className="composer-textarea"
                                placeholder="Type a message..."
                                rows={1}
                                value={text}
                                onChange={handleTextChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Send or Mic button */}
                        {text.trim() ? (
                            <button
                                type="button"
                                className="composer-send-btn"
                                onClick={handleSend}
                                title="Send message"
                                id="send-msg-btn"
                            >
                                <SendIcon style={{ fontSize: 17 }} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="composer-mic-btn"
                                onClick={() => setIsRecording(true)}
                                title="Record voice message"
                                id="record-voice-btn"
                            >
                                <MicIcon style={{ fontSize: 20 }} />
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Emoji Picker Popover */}
            <Popover
                open={Boolean(emojiAnchor)}
                anchorEl={emojiAnchor}
                onClose={() => setEmojiAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <div className="compact-emoji-grid">
                    {EMOJIS.map((e) => (
                        <button
                            key={e}
                            type="button"
                            className="emoji-grid-cell"
                            onClick={() => insertEmoji(e)}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </Popover>

            {/* Attachment Menu Popover */}
            <Popover
                open={Boolean(attachAnchor)}
                anchorEl={attachAnchor}
                onClose={() => setAttachAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <div className="attach-popup-menu">
                    <button
                        type="button"
                        className="attach-menu-item"
                        onClick={() => handleAttachSelect("photos")}
                    >
                        <div className="attach-pop-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                            <PhotoLibraryIcon style={{ fontSize: 18 }} />
                        </div>
                        <span>Photos &amp; Videos</span>
                    </button>

                    <button
                        type="button"
                        className="attach-menu-item"
                        onClick={() => handleAttachSelect("document")}
                    >
                        <div className="attach-pop-icon" style={{ background: "#ede9fe", color: "#6366f1" }}>
                            <DescriptionIcon style={{ fontSize: 18 }} />
                        </div>
                        <span>Document</span>
                    </button>

                    <button
                        type="button"
                        className="attach-menu-item"
                        onClick={() => handleAttachSelect("camera")}
                    >
                        <div className="attach-pop-icon" style={{ background: "#fce7f3", color: "#db2777" }}>
                            <CameraAltIcon style={{ fontSize: 18 }} />
                        </div>
                        <span>Camera</span>
                    </button>

                    <button
                        type="button"
                        className="attach-menu-item"
                        onClick={() => handleAttachSelect("location")}
                    >
                        <div className="attach-pop-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
                            <LocationOnIcon style={{ fontSize: 18 }} />
                        </div>
                        <span>Location</span>
                    </button>
                </div>
            </Popover>
        </div>
    );
}

export default MessageInput;
