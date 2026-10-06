import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import BlockIcon from "@mui/icons-material/Block";
import FlagIcon from "@mui/icons-material/Flag";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// ─────────────────────────────────────────────────
// Base Confirmation Dialog
// ─────────────────────────────────────────────────
export function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    confirmColor = "error",
    icon,
}) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.25, pb: 1, fontSize: "16px", fontWeight: 600 }}>
                {icon && <span style={{ color: confirmColor === "error" ? "#ef4444" : "#4f46e5", display: "flex" }}>{icon}</span>}
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: "text.secondary", fontSize: 13.5 }}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={onCancel} variant="outlined" color="inherit" size="small" sx={{ textTransform: "none", borderRadius: 1.5, fontSize: "13px" }}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} variant="contained" color={confirmColor} size="small" sx={{ textTransform: "none", borderRadius: 1.5, fontSize: "13px" }}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Delete Message Dialog ──
export function DeleteMessageDialog({ open, onConfirm, onCancel }) {
    return (
        <ConfirmDialog
            open={open}
            title="Delete Message?"
            message="Are you sure you want to delete this message? This action cannot be undone."
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Delete"
            confirmColor="error"
            icon={<DeleteIcon fontSize="small" />}
        />
    );
}

// ── Delete Conversation Dialog ──
export function DeleteChatDialog({ open, onConfirm, onCancel, contactName }) {
    return (
        <ConfirmDialog
            open={open}
            title="Delete Conversation?"
            message={`Are you sure you want to delete your conversation with ${contactName || "this contact"}? All message history will be removed.`}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Delete"
            confirmColor="error"
            icon={<DeleteIcon fontSize="small" />}
        />
    );
}

// ── Clear Chat Dialog ──
export function ClearChatDialog({ open, onConfirm, onCancel }) {
    return (
        <ConfirmDialog
            open={open}
            title="Clear Conversation?"
            message="All messages will be removed from this conversation. The conversation will remain in your list."
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Clear"
            confirmColor="error"
            icon={<ClearAllIcon fontSize="small" />}
        />
    );
}

// ── Logout Dialog ──
export function LogoutDialog({ open, onConfirm, onCancel }) {
    return (
        <ConfirmDialog
            open={open}
            title="Logout?"
            message="Are you sure you want to end your current session? You will be returned to the login screen."
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Logout"
            confirmColor="error"
            icon={<LogoutIcon fontSize="small" />}
        />
    );
}

// ── Block User Dialog ──
export function BlockUserDialog({ open, onConfirm, onCancel, contactName }) {
    return (
        <ConfirmDialog
            open={open}
            title={`Block ${contactName || "User"}?`}
            message={`You will no longer receive calls or messages from ${contactName || "this contact"}.`}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Block"
            confirmColor="error"
            icon={<BlockIcon fontSize="small" />}
        />
    );
}

// ── Report User Dialog ──
const REPORT_REASONS = [
    "Spam or advertising",
    "Harassment or bullying",
    "Inappropriate content",
    "Fake account",
    "Other",
];

export function ReportUserDialog({ open, onConfirm, onCancel, contactName }) {
    const [selected, setSelected] = useState("");

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.25, pb: 1, fontSize: "16px", fontWeight: 600 }}>
                <FlagIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                Report {contactName || "User"}?
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 1.5, fontSize: 13, color: "text.secondary" }}>
                    Select the reason for reporting this contact:
                </DialogContentText>
                {REPORT_REASONS.map((r) => (
                    <div key={r} style={{ marginBottom: 8 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: "#1e293b" }}>
                            <input
                                type="radio"
                                name="report-reason"
                                value={r}
                                checked={selected === r}
                                onChange={() => setSelected(r)}
                            />
                            {r}
                        </label>
                    </div>
                ))}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={onCancel} variant="outlined" color="inherit" size="small" sx={{ textTransform: "none", borderRadius: 1.5, fontSize: "13px" }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => { if (selected) onConfirm(selected); }}
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ textTransform: "none", borderRadius: 1.5, fontSize: "13px" }}
                    disabled={!selected}
                >
                    Report
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Attachment Menu Popover / Dialog ──
export function AttachmentDialog({ open, onSelect, onClose }) {
    const items = [
        { id: "document", label: "Document", icon: <DescriptionIcon style={{ color: "#6366f1" }} />, desc: "PDF, DOC, TXT" },
        { id: "photos", label: "Photos & Videos", icon: <PhotoLibraryIcon style={{ color: "#06b6d4" }} />, desc: "Images and media" },
        { id: "camera", label: "Camera", icon: <CameraAltIcon style={{ color: "#ec4899" }} />, desc: "Take a photo" },
        { id: "location", label: "Location", icon: <LocationOnIcon style={{ color: "#10b981" }} />, desc: "Share coordinates" },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ pb: 1, fontSize: "16px", fontWeight: 600 }}>Share Content</DialogTitle>
            <DialogContent sx={{ pb: 2 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 6 }}>
                    {items.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            className="attach-grid-item"
                            onClick={() => { onSelect(opt.id); onClose(); }}
                        >
                            <div className="attach-icon-circle">{opt.icon}</div>
                            <span className="attach-grid-label">{opt.label}</span>
                            <span className="attach-grid-sub">{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ── Voice Recording Dialog / Banner ──
export function VoiceRecordDialog({ open, onStop, onCancel }) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!open) {
            setSeconds(0);
            return;
        }
        const t = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [open]);

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ textAlign: "center", pb: 0.5, fontSize: "16px", fontWeight: 600 }}>
                Audio Message
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center", py: 2.5 }}>
                <div className="recording-wave-animation">
                    <span /><span /><span /><span /><span />
                </div>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#ef4444", margin: "12px 0 4px", fontFamily: "monospace" }}>
                    🔴 {fmt(seconds)}
                </p>
                <p style={{ fontSize: 12, color: "#64748b" }}>
                    Recording voice message (demo)
                </p>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5, justifyContent: "center" }}>
                <Button onClick={onCancel} variant="outlined" color="inherit" size="small" sx={{ textTransform: "none", borderRadius: 1.5, fontSize: "13px" }}>
                    Cancel
                </Button>
                <Button onClick={() => onStop(seconds)} variant="contained" color="error" size="small" sx={{ textTransform: "none", borderRadius: 1.5, fontSize: "13px" }}>
                    Stop &amp; Send
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Voice & Video Call Dialog ──
export function CallDialog({ open, contact, isVideo = false, onClose }) {
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState("Ringing...");

    useEffect(() => {
        if (!open) {
            setSeconds(0);
            setStatus("Ringing...");
            return;
        }
        const timer1 = setTimeout(() => {
            setStatus("Connected");
        }, 2200);

        const t = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);

        return () => {
            clearTimeout(timer1);
            clearInterval(t);
        };
    }, [open]);

    if (!contact) return null;

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden", bgcolor: "#111827", color: "#fff" } }}>
            <div style={{ padding: "32px 24px 28px", textAlign: "center", position: "relative" }}>
                <div style={{ marginBottom: 16 }}>
                    <div className="call-avatar-wrap">
                        <img
                            src={contact.avatar}
                            alt={contact.name}
                            style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", border: "3px solid #6366f1" }}
                        />
                        <div className="call-pulse-ring" />
                    </div>
                </div>

                <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: "#fff" }}>
                    {isVideo ? "Video Calling" : "Calling"} {contact.name}...
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
                    {status === "Connected" ? fmt(seconds) : status}
                </p>

                {isVideo && (
                    <div style={{ marginTop: 16, padding: "12px", background: "rgba(255,255,255,0.06)", borderRadius: 12, fontSize: 12, color: "#94a3b8" }}>
                        📹 Video feed simulated
                    </div>
                )}

                <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 16 }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="call-end-btn"
                        title="End Call"
                    >
                        <CallEndIcon style={{ fontSize: 24 }} />
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

// ── Status Story Viewer Modal ──
export function StatusViewerDialog({ open, statusItem, onClose }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!open || !statusItem) {
            setProgress(0);
            return;
        }
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onClose();
                    return 100;
                }
                return prev + 2;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [open, statusItem, onClose]);

    if (!statusItem) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#09090b",
                    color: "#fff",
                    m: 2,
                    maxHeight: "85vh",
                },
            }}
        >
            <div style={{ position: "relative", minHeight: 460, display: "flex", flexDirection: "column" }}>
                {/* Progress bar */}
                <div style={{ position: "absolute", top: 12, left: 16, right: 16, height: 3, background: "rgba(255,255,255,0.3)", borderRadius: 3, zIndex: 10, overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "#fff", transition: "width 0.1s linear" }} />
                </div>

                {/* Header */}
                <div style={{ position: "absolute", top: 22, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                            src={statusItem.avatar}
                            alt={statusItem.name}
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #6366f1" }}
                        />
                        <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff" }}>{statusItem.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{statusItem.time}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", color: "#fff", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                        <CloseIcon style={{ fontSize: 18 }} />
                    </button>
                </div>

                {/* Media Image */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#18181b" }}>
                    <img
                        src={statusItem.media}
                        alt="Status update"
                        style={{ width: "100%", height: "100%", minHeight: 380, objectFit: "cover" }}
                    />
                </div>

                {/* Caption footer */}
                {statusItem.caption && (
                    <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.75)", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: 13.5, color: "#f8fafc" }}>{statusItem.caption}</p>
                    </div>
                )}
            </div>
        </Dialog>
    );
}

// ── Profile View Dialog ──
export function ProfileDialog({ open, onClose, contact }) {
    if (!contact) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, fontSize: "16px", fontWeight: 600 }}>
                <span>Contact Details</span>
                <button
                    type="button"
                    onClick={onClose}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}
                >
                    <CloseIcon style={{ fontSize: 18 }} />
                </button>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
                <div style={{ textAlign: "center", paddingBottom: 16 }}>
                    <img
                        src={contact.avatar}
                        alt={contact.name}
                        style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #6366f1" }}
                    />
                    <h3 style={{ margin: "10px 0 2px", fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{contact.name}</h3>
                    <p style={{ color: "#64748b", fontSize: 12.5, margin: "0 0 6px" }}>{contact.phone}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: contact.online ? "#10b981" : "#94a3b8", display: "inline-block" }} />
                        <span style={{ fontSize: 12, color: contact.online ? "#10b981" : "#64748b" }}>
                            {contact.online ? "Online" : contact.lastSeen || "Offline"}
                        </span>
                    </div>
                </div>
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>About</p>
                    <p style={{ fontSize: 13, color: "#334155", margin: 0 }}>{contact.about}</p>
                </div>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="contained" size="small" sx={{ textTransform: "none", borderRadius: 1.5, background: "#6366f1", fontSize: "13px" }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── New Chat Dialog ──
export function NewChatDialog({ open, contacts, onClose, onSelectContact }) {
    const [search, setSearch] = useState("");

    // Reset search every time dialog opens
    useEffect(() => {
        if (open) setSearch("");
    }, [open]);

    const filtered = contacts.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, fontSize: "16px", fontWeight: 600 }}>
                <span>New Conversation</span>
                <button
                    type="button"
                    onClick={onClose}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}
                >
                    <CloseIcon style={{ fontSize: 18 }} />
                </button>
            </DialogTitle>
            <DialogContent sx={{ pt: 1, px: 2 }}>
                <div style={{ marginBottom: 12 }}>
                    <input
                        type="text"
                        placeholder="Search contact name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                        className="new-chat-search-input"
                    />
                </div>
                <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {filtered.map((c) => (
                        <div
                            key={c.id}
                            className="new-chat-contact-row"
                            onClick={() => { onSelectContact(c.id); onClose(); }}
                        >
                            <img src={c.avatar} alt={c.name} className="new-chat-row-avatar" />
                            <div className="new-chat-row-info">
                                <p className="new-chat-row-name">{c.name}</p>
                                <p className="new-chat-row-phone">{c.phone}</p>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, padding: "16px 0" }}>No contacts found</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
