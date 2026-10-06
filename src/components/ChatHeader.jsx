import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonIcon from "@mui/icons-material/Person";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

function ChatHeader({
    contact,
    onBack,
    isTyping,
    onViewProfile,
    onVoiceCall,
    onVideoCall,
    onBlockUser,
    onReportUser,
    onClearChat,
    onDeleteChat,
    onSearchInChat,
    onCloseChat,
}) {
    const [menuAnchor, setMenuAnchor] = useState(null);

    if (!contact) return null;

    return (
        <header className="chat-header-bar" id="chat-header-bar">
            {/* Left section: Back button (mobile) + Avatar + Name + Status */}
            <div className="header-left-col">
                <button
                    type="button"
                    className="header-back-btn"
                    onClick={onBack}
                    id="chat-back-btn"
                    title="Back to chats"
                >
                    <ArrowBackIcon style={{ fontSize: 20 }} />
                </button>

                <div
                    className="header-avatar-wrap"
                    onClick={onViewProfile}
                    title="View contact info"
                >
                    <img src={contact.avatar} alt={contact.name} className="header-avatar-img" />
                    <span className={`status-dot-sm ${contact.online ? "online" : "offline"}`} />
                </div>

                <div
                    className="header-info-wrap"
                    onClick={onViewProfile}
                    title="View contact info"
                >
                    <h3 className="header-contact-name">{contact.name}</h3>
                    <p className={`header-contact-status ${isTyping ? "typing-active" : ""}`}>
                        {isTyping ? "typing…" : contact.online ? "Online" : contact.lastSeen || "Offline"}
                    </p>
                </div>
            </div>

            {/* Right section: Action Buttons */}
            <div className="header-right-col">
                <button
                    type="button"
                    className="header-action-btn"
                    title="Voice call"
                    onClick={() => onVoiceCall && onVoiceCall(contact)}
                    id="header-voice-call-btn"
                >
                    <CallIcon style={{ fontSize: 19 }} />
                </button>

                <button
                    type="button"
                    className="header-action-btn"
                    title="Video call"
                    onClick={() => onVideoCall && onVideoCall(contact)}
                    id="header-video-call-btn"
                >
                    <VideocamIcon style={{ fontSize: 20 }} />
                </button>

                <button
                    type="button"
                    className="header-action-btn"
                    title="Search in chat"
                    onClick={onSearchInChat}
                    id="header-search-btn"
                >
                    <SearchIcon style={{ fontSize: 19 }} />
                </button>

                <button
                    type="button"
                    className="header-action-btn"
                    title="More options"
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    id="header-more-btn"
                >
                    <MoreVertIcon style={{ fontSize: 19 }} />
                </button>

                {/* More Options Menu with rich, valid MUI icons */}
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    PaperProps={{
                        sx: {
                            borderRadius: "10px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            minWidth: 200,
                            py: 0.5,
                        },
                    }}
                >
                    {/* ── Close Chat ── */}
                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            onCloseChat && onCloseChat();
                        }}
                        dense
                        sx={{ py: 1 }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <CloseIcon fontSize="small" sx={{ color: "#64748b" }} />
                        </ListItemIcon>
                        <ListItemText primary="Close chat" primaryTypographyProps={{ fontSize: "13px" }} />
                    </MenuItem>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            onViewProfile();
                        }}
                        dense
                        sx={{ py: 1 }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <PersonIcon fontSize="small" sx={{ color: "#6366f1" }} />
                        </ListItemIcon>
                        <ListItemText primary="View contact info" primaryTypographyProps={{ fontSize: "13px" }} />
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            onClearChat && onClearChat();
                        }}
                        dense
                        sx={{ py: 1 }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <ClearAllIcon fontSize="small" sx={{ color: "#64748b" }} />
                        </ListItemIcon>
                        <ListItemText primary="Clear conversation" primaryTypographyProps={{ fontSize: "13px" }} />
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            onDeleteChat && onDeleteChat();
                        }}
                        dense
                        sx={{ py: 1 }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                        </ListItemIcon>
                        <ListItemText primary="Delete conversation" primaryTypographyProps={{ fontSize: "13px" }} />
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            onBlockUser && onBlockUser();
                        }}
                        dense
                        sx={{ py: 1, color: "#ef4444" }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <BlockIcon fontSize="small" sx={{ color: "#ef4444" }} />
                        </ListItemIcon>
                        <ListItemText primary={`Block ${contact.name}`} primaryTypographyProps={{ fontSize: "13px", color: "#ef4444" }} />
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            onReportUser && onReportUser();
                        }}
                        dense
                        sx={{ py: 1, color: "#ef4444" }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <FlagOutlinedIcon fontSize="small" sx={{ color: "#ef4444" }} />
                        </ListItemIcon>
                        <ListItemText primary={`Report ${contact.name}`} primaryTypographyProps={{ fontSize: "13px", color: "#ef4444" }} />
                    </MenuItem>
                </Menu>
            </div>
        </header>
    );
}

export default ChatHeader;
