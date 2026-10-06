import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { LogoutDialog } from "./Dialogs";

const SETTINGS_SECTIONS = [
    { id: "account", icon: <PersonIcon fontSize="small" />, label: "Account", desc: "Security, change number" },
    { id: "privacy", icon: <LockOutlinedIcon fontSize="small" />, label: "Privacy", desc: "Blocklist, disappearing messages" },
    { id: "notifications", icon: <NotificationsNoneIcon fontSize="small" />, label: "Notifications", desc: "Message and call alerts" },
    { id: "appearance", icon: <PaletteOutlinedIcon fontSize="small" />, label: "Theme & Wallpaper", desc: "Dark mode, chat wallpaper" },
    { id: "security", icon: <SecurityOutlinedIcon fontSize="small" />, label: "Security & Encryption", desc: "End-to-end encryption status" },
    { id: "help", icon: <HelpIcon fontSize="small" />, label: "Help & Feedback", desc: "Contact support, FAQs" },
];

function Profile({ user, onClose, onLogout, onUpdateUser, onToast }) {
    const [editingName, setEditingName] = useState(false);
    const [editingAbout, setEditingAbout] = useState(false);
    const [name, setName] = useState(user.name);
    const [about, setAbout] = useState(user.about);
    const [logoutOpen, setLogoutOpen] = useState(false);

    function saveName() {
        if (name.trim()) {
            onUpdateUser({ name: name.trim() });
            onToast && onToast("Name updated successfully", "success");
        }
        setEditingName(false);
    }

    function saveAbout() {
        if (about.trim()) {
            onUpdateUser({ about: about.trim() });
            onToast && onToast("Status updated", "success");
        }
        setEditingAbout(false);
    }

    return (
        <>
            {/* Backdrop — click outside to close */}
            <div
                className="profile-drawer-backdrop"
                onClick={onClose}
                aria-hidden="true"
            />

            <aside className="profile-drawer-panel" id="profile-drawer-panel">
                {/* ── Top Header ── */}
                <div className="profile-drawer-header">
                    <button
                        type="button"
                        className="profile-back-btn"
                        onClick={onClose}
                        id="close-profile-btn"
                        title="Close"
                    >
                        <ArrowBackIcon style={{ fontSize: 20 }} />
                    </button>
                    <h3 className="profile-drawer-title">Profile &amp; Settings</h3>
                    <button
                        type="button"
                        className="profile-close-x-btn"
                        onClick={onClose}
                        title="Close drawer"
                        style={{ marginLeft: "auto" }}
                    >
                        <CloseIcon style={{ fontSize: 18 }} />
                    </button>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="profile-drawer-scroll">
                    {/* Avatar Section */}
                    <div className="profile-avatar-card">
                        <div
                            className="profile-avatar-wrapper"
                            onClick={() => onToast && onToast("Avatar upload feature (demo)", "info")}
                            title="Change photo"
                        >
                            <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
                            <div className="profile-avatar-badge">
                                <PhotoCameraIcon style={{ fontSize: 16 }} />
                            </div>
                        </div>
                        <h4 className="profile-display-name">{user.name}</h4>
                        <span className="profile-display-phone">{user.phone}</span>
                    </div>

                    {/* Name Edit Card */}
                    <div className="profile-info-group">
                        <span className="profile-field-label">YOUR NAME</span>
                        <div className="profile-field-row">
                            {editingName ? (
                                <div className="profile-edit-input-wrap">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && saveName()}
                                        autoFocus
                                        maxLength={40}
                                    />
                                    <button type="button" onClick={saveName} className="profile-save-check" title="Save">
                                        <CheckIcon style={{ fontSize: 18 }} />
                                    </button>
                                </div>
                            ) : (
                                <div className="profile-value-display">
                                    <span className="profile-value-text">{user.name}</span>
                                    <button
                                        type="button"
                                        className="profile-edit-trigger"
                                        onClick={() => setEditingName(true)}
                                        title="Edit name"
                                    >
                                        <EditOutlinedIcon style={{ fontSize: 17 }} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* About Edit Card */}
                    <div className="profile-info-group">
                        <span className="profile-field-label">ABOUT</span>
                        <div className="profile-field-row">
                            {editingAbout ? (
                                <div className="profile-edit-input-wrap">
                                    <input
                                        type="text"
                                        value={about}
                                        onChange={(e) => setAbout(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && saveAbout()}
                                        autoFocus
                                        maxLength={80}
                                    />
                                    <button type="button" onClick={saveAbout} className="profile-save-check" title="Save">
                                        <CheckIcon style={{ fontSize: 18 }} />
                                    </button>
                                </div>
                            ) : (
                                <div className="profile-value-display">
                                    <span className="profile-value-text">{user.about}</span>
                                    <button
                                        type="button"
                                        className="profile-edit-trigger"
                                        onClick={() => setEditingAbout(true)}
                                        title="Edit about"
                                    >
                                        <EditOutlinedIcon style={{ fontSize: 17 }} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings Navigation List */}
                    <div className="profile-settings-group">
                        <span className="profile-field-label" style={{ padding: "0 16px 6px" }}>SETTINGS</span>
                        {SETTINGS_SECTIONS.map((item) => (
                            <div
                                key={item.id}
                                className="profile-setting-row"
                                onClick={() => onToast && onToast(`${item.label} settings`, "info")}
                            >
                                <div className="setting-icon-box">{item.icon}</div>
                                <div className="setting-text-col">
                                    <p className="setting-title-text">{item.label}</p>
                                    <span className="setting-desc-text">{item.desc}</span>
                                </div>
                                <ChevronRightIcon style={{ fontSize: 18, color: "#94a3b8" }} />
                            </div>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div className="profile-logout-wrap">
                        <button
                            type="button"
                            className="profile-logout-btn"
                            onClick={() => setLogoutOpen(true)}
                            id="profile-logout-trigger"
                        >
                            <LogoutIcon style={{ fontSize: 18 }} />
                            <span>Log out of ConnectChat</span>
                        </button>
                    </div>
                </div>

                {/* Logout Confirmation Dialog */}
                <LogoutDialog
                    open={logoutOpen}
                    onConfirm={() => {
                        setLogoutOpen(false);
                        onLogout();
                    }}
                    onCancel={() => setLogoutOpen(false)}
                />
            </aside>
        </>
    );
}

export default Profile;
