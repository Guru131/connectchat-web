import { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPinIcon from "@mui/icons-material/PushPin";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import VideocamIcon from "@mui/icons-material/Videocam";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// ─────────────────────────────────────────────────────────────
// Sidebar component containing:
// 1. Left Navigation Rail (64px dark purple/navy)
// 2. Main Section Panel (Chats / Calls / Status / Contacts)
// ─────────────────────────────────────────────────────────────

function Sidebar({
    activeTab,
    onTabChange,
    contacts,
    selectedId,
    onSelect,
    currentUser,
    darkMode,
    onToggleDark,
    onOpenProfile,
    searchQuery,
    onSearch,
    onPinToggle,
    onDeleteChat,
    onClearChat,
    calls = [],
    onStartCall,
    statuses = [],
    onViewStatus,
    onNewChat,
    filter = "all",
    onFilterChange,
    hiddenOnMobile = false,
}) {
    const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);

    // ── Filtering Contacts for Chats ──
    const searchLower = searchQuery.toLowerCase();
    const searchedContacts = contacts.filter((c) =>
        c.name.toLowerCase().includes(searchLower) ||
        (c.lastMessage?.text || "").toLowerCase().includes(searchLower)
    );

    const filteredContacts = searchedContacts.filter((c) => {
        if (filter === "unread") return c.unreadCount > 0;
        if (filter === "pinned") return c.pinned;
        if (filter === "groups") return false; // Demo doesn't have groups yet
        return true;
    });

    const pinned = filteredContacts.filter((c) => c.pinned);
    const recent = filteredContacts.filter((c) => !c.pinned);

    // ── Filtering Calls ──
    const filteredCalls = calls.filter((c) =>
        c.name.toLowerCase().includes(searchLower)
    );

    // ── Contacts Tab: Alphabetical sorting ──
    const sortedContacts = [...contacts]
        .filter((c) => c.name.toLowerCase().includes(searchLower) || c.phone.includes(searchLower))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <aside className={`sidebar-wrapper ${hiddenOnMobile ? "hidden-on-mobile" : ""}`} id="sidebar-wrapper">
            {/* ── 1. Compact Left Navigation Rail (64px) ── */}
            <nav className="nav-rail" aria-label="Main Navigation">
                <div className="nav-rail-top">
                    {/* Brand Icon */}
                    <div className="nav-brand-icon" title="ConnectChat">
                        <ChatIcon style={{ fontSize: 22, color: "#fff" }} />
                    </div>

                    {/* Nav tabs */}
                    <button
                        type="button"
                        className={`nav-tab-btn ${activeTab === "chats" ? "active" : ""}`}
                        onClick={() => onTabChange("chats")}
                        title="Chats"
                        id="nav-tab-chats"
                    >
                        <ChatIcon className="nav-tab-icon" />
                        <span className="nav-tab-label">Chats</span>
                    </button>

                    <button
                        type="button"
                        className={`nav-tab-btn ${activeTab === "calls" ? "active" : ""}`}
                        onClick={() => onTabChange("calls")}
                        title="Calls"
                        id="nav-tab-calls"
                    >
                        <CallIcon className="nav-tab-icon" />
                        <span className="nav-tab-label">Calls</span>
                    </button>

                    <button
                        type="button"
                        className={`nav-tab-btn ${activeTab === "status" ? "active" : ""}`}
                        onClick={() => onTabChange("status")}
                        title="Status"
                        id="nav-tab-status"
                    >
                        <DonutLargeIcon className="nav-tab-icon" />
                        <span className="nav-tab-label">Status</span>
                    </button>

                    <button
                        type="button"
                        className={`nav-tab-btn ${activeTab === "contacts" ? "active" : ""}`}
                        onClick={() => onTabChange("contacts")}
                        title="Contacts"
                        id="nav-tab-contacts"
                    >
                        <PeopleIcon className="nav-tab-icon" />
                        <span className="nav-tab-label">Contacts</span>
                    </button>
                </div>

                {/* Bottom rail actions */}
                <div className="nav-rail-bottom">
                    <button
                        type="button"
                        className="nav-tab-btn"
                        onClick={onToggleDark}
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                        id="nav-theme-toggle"
                    >
                        {darkMode ? <LightModeIcon className="nav-tab-icon" /> : <DarkModeIcon className="nav-tab-icon" />}
                        <span className="nav-tab-label">{darkMode ? "Light" : "Dark"}</span>
                    </button>

                    <button
                        type="button"
                        className="nav-profile-btn"
                        onClick={onOpenProfile}
                        title={`Profile: ${currentUser.name}`}
                        id="nav-profile-btn"
                    >
                        <img src={currentUser.avatar} alt={currentUser.name} className="nav-profile-avatar" />
                        <span className="nav-online-indicator" />
                    </button>
                </div>
            </nav>

            {/* ── 2. Section Panel (Chats / Calls / Status / Contacts) ── */}
            <div className="section-panel" id="section-panel">
                {/* ────── TAB 1: CHATS ────── */}
                {activeTab === "chats" && (
                    <>
                        <div className="panel-header">
                            <h2 className="panel-title">Chats</h2>
                            <div className="panel-header-actions">
                                <button
                                    type="button"
                                    className="panel-icon-btn"
                                    title="New conversation"
                                    onClick={onNewChat}
                                    id="new-chat-btn"
                                >
                                    <AddIcon style={{ fontSize: 20 }} />
                                </button>
                                <button
                                    type="button"
                                    className="panel-icon-btn"
                                    title="Menu"
                                    onClick={(e) => setHeaderMenuAnchor(e.currentTarget)}
                                    id="chats-menu-btn"
                                >
                                    <MoreVertIcon style={{ fontSize: 20 }} />
                                </button>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="panel-search-bar">
                            <div className="search-input-wrap">
                                <SearchIcon className="search-icon-svg" />
                                <input
                                    id="chats-search-input"
                                    type="text"
                                    placeholder="Search or start a new chat"
                                    value={searchQuery}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter chips */}
                        <div className="filter-chips-row">
                            {["all", "unread", "pinned", "groups"].map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    className={`filter-chip ${filter === f ? "active" : ""}`}
                                    onClick={() => onFilterChange(f)}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Chat Rows List */}
                        <div className="panel-scroll-content">
                            {filteredContacts.length === 0 ? (
                                <div className="empty-panel-state">
                                    <p>No conversations found</p>
                                </div>
                            ) : (
                                <>
                                    {/* Pinned section */}
                                    {pinned.length > 0 && (
                                        <div className="chat-section-group">
                                            <div className="chat-section-heading">
                                                <PushPinIcon style={{ fontSize: 13, marginRight: 4 }} />
                                                PINNED
                                            </div>
                                            {pinned.map((c) => (
                                                <ChatRowItem
                                                    key={c.id}
                                                    contact={c}
                                                    isActive={c.id === selectedId}
                                                    onSelect={onSelect}
                                                    onPinToggle={onPinToggle}
                                                    onDeleteChat={onDeleteChat}
                                                    onClearChat={onClearChat}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Recent section */}
                                    {recent.length > 0 && (
                                        <div className="chat-section-group">
                                            {pinned.length > 0 && (
                                                <div className="chat-section-heading">RECENT</div>
                                            )}
                                            {recent.map((c) => (
                                                <ChatRowItem
                                                    key={c.id}
                                                    contact={c}
                                                    isActive={c.id === selectedId}
                                                    onSelect={onSelect}
                                                    onPinToggle={onPinToggle}
                                                    onDeleteChat={onDeleteChat}
                                                    onClearChat={onClearChat}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* ────── TAB 2: CALLS ────── */}
                {activeTab === "calls" && (
                    <>
                        <div className="panel-header">
                            <h2 className="panel-title">Calls</h2>
                            <div className="panel-header-actions">
                                <button
                                    type="button"
                                    className="panel-icon-btn"
                                    title="New call"
                                    onClick={onNewChat}
                                >
                                    <AddIcon style={{ fontSize: 20 }} />
                                </button>
                            </div>
                        </div>

                        <div className="panel-search-bar">
                            <div className="search-input-wrap">
                                <SearchIcon className="search-icon-svg" />
                                <input
                                    type="text"
                                    placeholder="Search calls..."
                                    value={searchQuery}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="panel-scroll-content">
                            {filteredCalls.length === 0 ? (
                                <div className="empty-panel-state">
                                    <p>No call logs found</p>
                                </div>
                            ) : (
                                <div className="call-list-wrap">
                                    {filteredCalls.map((call) => {
                                        const contact = contacts.find((c) => c.id === call.contactId) || {
                                            avatar: call.avatar,
                                            name: call.name,
                                        };
                                        return (
                                            <div key={call.id} className="call-row-item">
                                                <div className="avatar-pos-wrap">
                                                    <img src={call.avatar} alt={call.name} className="row-avatar" />
                                                </div>
                                                <div className="call-info-col">
                                                    <span className="row-name">{call.name}</span>
                                                    <div className="call-type-indicator">
                                                        {call.type === "incoming" && (
                                                            <CallReceivedIcon style={{ fontSize: 14, color: "#10b981", flexShrink: 0 }} />
                                                        )}
                                                        {call.type === "outgoing" && (
                                                            <CallMadeIcon style={{ fontSize: 14, color: "#4f46e5", flexShrink: 0 }} />
                                                        )}
                                                        {call.type === "missed" && (
                                                            <CallMissedIcon style={{ fontSize: 14, color: "#ef4444", flexShrink: 0 }} />
                                                        )}
                                                        <span className={`call-type-text ${call.type === "missed" ? "missed" : ""}`}>
                                                            {call.type.charAt(0).toUpperCase() + call.type.slice(1)} {call.isVideo ? "video" : ""} call
                                                        </span>
                                                        <span className="call-time-dot">•</span>
                                                        <span className="call-time-str">{call.time}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="call-action-trigger"
                                                    title={`Call ${call.name}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onStartCall(contact, call.isVideo);
                                                    }}
                                                >
                                                    {call.isVideo ? (
                                                        <VideocamIcon style={{ fontSize: 19, color: "#4f46e5" }} />
                                                    ) : (
                                                        <CallIcon style={{ fontSize: 19, color: "#10b981" }} />
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ────── TAB 3: STATUS ────── */}
                {activeTab === "status" && (
                    <>
                        <div className="panel-header">
                            <h2 className="panel-title">Status</h2>
                            <div className="panel-header-actions">
                                <button
                                    type="button"
                                    className="panel-icon-btn"
                                    title="Add status"
                                    onClick={() => alert("Status upload simulation")}
                                >
                                    <AddIcon style={{ fontSize: 20 }} />
                                </button>
                            </div>
                        </div>

                        <div className="panel-scroll-content">
                            {/* My Status */}
                            <div className="status-row-item my-status" onClick={() => alert("Status upload simulation")}>
                                <div className="status-avatar-ring my-status-ring">
                                    <img src={currentUser.avatar} alt="My Status" className="row-avatar" />
                                    <span className="add-status-badge">+</span>
                                </div>
                                <div className="status-info-col">
                                    <span className="row-name">My Status</span>
                                    <span className="row-desc">Tap to add status update</span>
                                </div>
                            </div>

                            {/* Recent Updates */}
                            <div className="chat-section-heading" style={{ marginTop: 16 }}>
                                RECENT UPDATES
                            </div>
                            {statuses.filter((s) => !s.viewed).map((item) => (
                                <div
                                    key={item.id}
                                    className="status-row-item"
                                    onClick={() => onViewStatus(item)}
                                >
                                    <div className="status-avatar-ring active-ring">
                                        <img src={item.avatar} alt={item.name} className="row-avatar" />
                                    </div>
                                    <div className="status-info-col">
                                        <span className="row-name">{item.name}</span>
                                        <span className="row-desc">{item.time}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Viewed Updates */}
                            <div className="chat-section-heading" style={{ marginTop: 16 }}>
                                VIEWED UPDATES
                            </div>
                            {statuses.filter((s) => s.viewed).map((item) => (
                                <div
                                    key={item.id}
                                    className="status-row-item viewed"
                                    onClick={() => onViewStatus(item)}
                                >
                                    <div className="status-avatar-ring viewed-ring">
                                        <img src={item.avatar} alt={item.name} className="row-avatar" />
                                    </div>
                                    <div className="status-info-col">
                                        <span className="row-name">{item.name}</span>
                                        <span className="row-desc">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ────── TAB 4: CONTACTS ────── */}
                {activeTab === "contacts" && (
                    <>
                        <div className="panel-header">
                            <h2 className="panel-title">Contacts</h2>
                            <div className="panel-header-actions">
                                <button
                                    type="button"
                                    className="panel-icon-btn"
                                    title="New contact"
                                    onClick={onNewChat}
                                >
                                    <AddIcon style={{ fontSize: 20 }} />
                                </button>
                            </div>
                        </div>

                        <div className="panel-search-bar">
                            <div className="search-input-wrap">
                                <SearchIcon className="search-icon-svg" />
                                <input
                                    type="text"
                                    placeholder="Search contacts..."
                                    value={searchQuery}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="panel-scroll-content">
                            {sortedContacts.map((c) => (
                                <div
                                    key={c.id}
                                    className={`contact-directory-row ${c.id === selectedId ? "active" : ""}`}
                                    onClick={() => {
                                        onSelect(c.id);
                                        onTabChange("chats");
                                    }}
                                >
                                    <div className="avatar-pos-wrap">
                                        <img src={c.avatar} alt={c.name} className="row-avatar" />
                                        <span className={`status-dot-sm ${c.online ? "online" : "offline"}`} />
                                    </div>
                                    <div className="contact-details-col">
                                        <span className="row-name">{c.name}</span>
                                        <span className="row-desc">{c.about || c.phone}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Header More Menu */}
            <Menu
                anchorEl={headerMenuAnchor}
                open={Boolean(headerMenuAnchor)}
                onClose={() => setHeaderMenuAnchor(null)}
            >
                <MenuItem onClick={() => { onNewChat(); setHeaderMenuAnchor(null); }} dense>
                    New Chat
                </MenuItem>
                <MenuItem onClick={() => { onOpenProfile(); setHeaderMenuAnchor(null); }} dense>
                    Profile Settings
                </MenuItem>
            </Menu>
        </aside>
    );
}

// ─────────────────────────────────────────────────────────────
// Exact Chat Row Item with strict alignment requirement:
// Avatar: Fixed 40x40px
// Name: Aligned at identical left X position
// Description/Last message: Directly below the name
// Time: Right-aligned
// Unread badge / Pin / Mute: Right-aligned
// 3-dot menu: Revealed on hover or click
// ─────────────────────────────────────────────────────────────
function ChatRowItem({
    contact,
    isActive,
    onSelect,
    onPinToggle,
    onDeleteChat,
    onClearChat,
}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = (e) => {
        if (e) e.stopPropagation();
        setAnchorEl(null);
    };

    const isFromMe = contact.lastMessage?.fromMe;

    return (
        <div
            className={`chat-row-item ${isActive ? "active" : ""}`}
            onClick={() => onSelect(contact.id)}
            id={`chat-item-${contact.id}`}
        >
            {/* Fixed Avatar (40px x 40px) */}
            <div className="avatar-pos-wrap">
                <img src={contact.avatar} alt={contact.name} className="row-avatar" />
                <span className={`status-dot-sm ${contact.online ? "online" : "offline"}`} />
            </div>

            {/* Information Column (Name + Last Message) */}
            <div className="chat-row-center">
                <div className="chat-row-topline">
                    <span className="row-name">{contact.name}</span>
                    <span className="row-time">{contact.lastMessage?.time || ""}</span>
                </div>

                <div className="chat-row-bottomline">
                    <div className="row-desc-wrap">
                        {isFromMe && (
                            <DoneAllIcon style={{ fontSize: 13, marginRight: 3, color: "#6366f1" }} />
                        )}
                        <span className="row-desc">
                            {contact.lastMessage?.text || "No messages yet"}
                        </span>
                    </div>

                    <div className="row-meta-wrap">
                        {contact.muted && (
                            <VolumeOffIcon style={{ fontSize: 14, color: "#94a3b8", marginRight: 4 }} />
                        )}
                        {contact.pinned && (
                            <PushPinIcon style={{ fontSize: 13, color: "#6366f1", marginRight: 4 }} />
                        )}
                        {contact.unreadCount > 0 && (
                            <span className="unread-badge">{contact.unreadCount}</span>
                        )}
                        {/* 3-dot action button appears on hover */}
                        <button
                            type="button"
                            className="row-hover-btn"
                            onClick={handleMenuOpen}
                            title="Chat options"
                        >
                            <MoreVertIcon style={{ fontSize: 16 }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Context menu for this chat */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
            >
                <MenuItem
                    onClick={(e) => {
                        handleMenuClose(e);
                        onPinToggle(contact.id);
                    }}
                    dense
                >
                    {contact.pinned ? "Unpin chat" : "Pin chat"}
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleMenuClose(e);
                        onClearChat(contact.id);
                    }}
                    dense
                >
                    Clear messages
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleMenuClose(e);
                        onDeleteChat(contact.id);
                    }}
                    dense
                    sx={{ color: "#ef4444" }}
                >
                    Delete chat
                </MenuItem>
            </Menu>
        </div>
    );
}

export default Sidebar;
