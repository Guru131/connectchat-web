import { useState, useEffect } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import Profile from "../components/Profile";
import {
    ConfirmDialog,
    DeleteMessageDialog,
    DeleteChatDialog,
    ClearChatDialog,
    BlockUserDialog,
    ReportUserDialog,
    CallDialog,
    StatusViewerDialog,
    ProfileDialog,
    NewChatDialog,
} from "../components/Dialogs";
import {
    contacts as initialContacts,
    currentUser as defaultUser,
    chatMessages as initialMessages,
    initialCalls,
    initialStatuses,
} from "../data/chatData";

const TYPING_TIMEOUT = 2200;

function Chat({ onLogout, onToast }) {
    // ── Session Storage Initialization ──
    const [contacts, setContacts] = useState(() => {
        const saved = sessionStorage.getItem("cc_contacts");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.map((c) => (c.id === "1" ? { ...c, name: "GuruMohan Raju" } : c));
            } catch (e) {
                return initialContacts;
            }
        }
        return initialContacts;
    });

    const [messages, setMessages] = useState(() => {
        const saved = sessionStorage.getItem("cc_messages");
        return saved ? JSON.parse(saved) : initialMessages;
    });

    const [selectedId, setSelectedId] = useState(() => {
        return sessionStorage.getItem("cc_selected_id") || "1";
    });

    const [calls, setCalls] = useState(() => {
        const saved = sessionStorage.getItem("cc_calls");
        return saved ? JSON.parse(saved) : initialCalls;
    });

    const [statuses, setStatuses] = useState(() => {
        const saved = sessionStorage.getItem("cc_statuses");
        return saved ? JSON.parse(saved) : initialStatuses;
    });

    const [activeTab, setActiveTab] = useState("chats");
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [typingMap, setTypingMap] = useState({});
    const [showProfile, setShowProfile] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return (localStorage.getItem("cc-theme") || document.documentElement.getAttribute("data-theme")) === "dark";
    });

    // ── Dialog States ──
    const [callDialog, setCallDialog] = useState({ open: false, contact: null, isVideo: false });
    const [statusViewer, setStatusViewer] = useState({ open: false, item: null });
    const [contactInfoDialog, setContactInfoDialog] = useState({ open: false, contact: null });
    const [deleteMsgDialog, setDeleteMsgDialog] = useState({ open: false, msgId: null });
    const [deleteChatDialog, setDeleteChatDialog] = useState({ open: false, contactId: null });
    const [clearChatDialog, setClearChatDialog] = useState({ open: false, contactId: null });
    const [blockDialog, setBlockDialog] = useState({ open: false, contact: null });
    const [reportDialog, setReportDialog] = useState({ open: false, contact: null });
    const [newChatOpen, setNewChatOpen] = useState(false);

    const [currentUser, setCurrentUser] = useState(() => {
        const phone = sessionStorage.getItem("cc_user_phone");
        return phone ? { ...defaultUser, phone } : defaultUser;
    });

    // ── Save to sessionStorage ──
    useEffect(() => {
        sessionStorage.setItem("cc_contacts", JSON.stringify(contacts));
    }, [contacts]);

    useEffect(() => {
        sessionStorage.setItem("cc_messages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (selectedId) {
            sessionStorage.setItem("cc_selected_id", selectedId);
        }
    }, [selectedId]);

    // ── Mobile detection ──
    const isMobile = () => window.innerWidth <= 768;

    // ── Select Contact ──
    function selectContact(id) {
        setSelectedId(id);
        setReplyTo(null);

        // Clear unread count
        setContacts((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
        );

        // Mobile: Show chat area, hide sidebar
        if (isMobile()) {
            const sidebar = document.getElementById("sidebar-wrapper");
            const chatArea = document.getElementById("main-chat-area");
            if (sidebar) sidebar.classList.add("hidden-on-mobile");
            if (chatArea) chatArea.classList.add("show-on-mobile");
        }
    }

    // ── Back to list on Mobile ──
    function goBackToList() {
        if (isMobile()) {
            const sidebar = document.getElementById("sidebar-wrapper");
            const chatArea = document.getElementById("main-chat-area");
            if (sidebar) sidebar.classList.remove("hidden-on-mobile");
            if (chatArea) chatArea.classList.remove("show-on-mobile");
        }
    }

    // ── Send Message ──
    function sendMessage(text, extra = {}) {
        if (!selectedId) return;

        const newMsg = {
            id: `msg-${Date.now()}`,
            senderId: "me",
            text: text || "",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "delivered",
            reactions: [],
            replyTo: replyTo,
            pinned: false,
            ...extra,
        };

        setMessages((prev) => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), newMsg],
        }));

        const lastPreview = extra.file
            ? `📄 ${extra.file.name}`
            : extra.voice
            ? "🎤 Voice message"
            : text;

        setContacts((prev) =>
            prev.map((c) =>
                c.id === selectedId
                    ? { ...c, lastMessage: { text: lastPreview, time: newMsg.time, fromMe: true } }
                    : c
            )
        );

        setReplyTo(null);
        simulateReply(selectedId);
    }

    // ── Auto-reply simulation ──
    function simulateReply(contactId) {
        const contact = contacts.find((c) => c.id === contactId);
        if (!contact) return;

        setTypingMap((prev) => ({ ...prev, [contactId]: true }));

        setTimeout(() => {
            setTypingMap((prev) => ({ ...prev, [contactId]: false }));

            const replies = [
                "Got it! Thanks for sharing 👍",
                "Sounds perfect. Let's proceed with that.",
                "Reviewing it now, will ping you shortly.",
                "Confirmed! Great work team 🚀",
                "Appreciate the quick update!",
                "Looks clean and well structured.",
            ];
            const replyText = replies[Math.floor(Math.random() * replies.length)];

            const autoReply = {
                id: `msg-${Date.now()}`,
                senderId: contactId,
                text: replyText,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "delivered",
                reactions: [],
                replyTo: null,
                pinned: false,
            };

            setMessages((prev) => ({
                ...prev,
                [contactId]: [...(prev[contactId] || []), autoReply],
            }));

            setContacts((prev) =>
                prev.map((c) =>
                    c.id === contactId
                        ? {
                              ...c,
                              lastMessage: {
                                  text: replyText,
                                  time: autoReply.time,
                                  fromMe: false,
                              },
                          }
                        : c
                )
            );
        }, 1800);
    }

    // ── Reactions ──
    function handleReact(msgId, emoji) {
        if (!selectedId) return;
        setMessages((prev) => {
            const list = prev[selectedId] || [];
            return {
                ...prev,
                [selectedId]: list.map((m) => {
                    if (m.id !== msgId) return m;
                    const exists = m.reactions?.find((r) => r.userId === "me" && r.emoji === emoji);
                    const reactions = exists
                        ? m.reactions.filter((r) => !(r.userId === "me" && r.emoji === emoji))
                        : [...(m.reactions || []), { emoji, userId: "me" }];
                    return { ...m, reactions };
                }),
            };
        });
    }

    // ── Delete Message ──
    function confirmDeleteMessage(msgId) {
        setDeleteMsgDialog({ open: true, msgId });
    }

    function executeDeleteMessage() {
        const msgId = deleteMsgDialog.msgId;
        if (!selectedId || !msgId) return;
        setMessages((prev) => ({
            ...prev,
            [selectedId]: (prev[selectedId] || []).filter((m) => m.id !== msgId),
        }));
        setDeleteMsgDialog({ open: false, msgId: null });
        onToast && onToast("Message deleted", "info");
    }

    // ── Pin / Unpin Message ──
    function handlePinMessage(msgId) {
        if (!selectedId) return;
        setMessages((prev) => ({
            ...prev,
            [selectedId]: (prev[selectedId] || []).map((m) =>
                m.id === msgId ? { ...m, pinned: !m.pinned } : m
            ),
        }));
    }

    // ── Pin / Unpin Contact ──
    function handlePinToggle(contactId) {
        setContacts((prev) =>
            prev.map((c) => (c.id === contactId ? { ...c, pinned: !c.pinned } : c))
        );
        const contact = contacts.find((c) => c.id === contactId);
        onToast && onToast(contact?.pinned ? "Chat unpinned" : "Chat pinned to top", "info");
    }

    // ── Clear Chat ──
    function handleClearChat(contactId = selectedId) {
        setClearChatDialog({ open: true, contactId });
    }

    function executeClearChat() {
        const contactId = clearChatDialog.contactId;
        if (!contactId) return;
        setMessages((prev) => ({
            ...prev,
            [contactId]: [],
        }));
        setContacts((prev) =>
            prev.map((c) =>
                c.id === contactId
                    ? { ...c, lastMessage: { text: "Conversation cleared", time: "", fromMe: false } }
                    : c
            )
        );
        setClearChatDialog({ open: false, contactId: null });
        onToast && onToast("Conversation cleared", "info");
    }

    // ── Delete Chat ──
    function handleDeleteChat(contactId = selectedId) {
        setDeleteChatDialog({ open: true, contactId });
    }

    function executeDeleteChat() {
        const contactId = deleteChatDialog.contactId;
        if (!contactId) return;
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        setMessages((prev) => {
            const next = { ...prev };
            delete next[contactId];
            return next;
        });
        if (selectedId === contactId) {
            setSelectedId(null);
            goBackToList();
        }
        setDeleteChatDialog({ open: false, contactId: null });
        onToast && onToast("Chat deleted", "info");
    }

    // ── Block / Report ──
    function handleBlockContact() {
        const contact = contacts.find((c) => c.id === selectedId);
        if (contact) setBlockDialog({ open: true, contact });
    }

    function executeBlock() {
        onToast && onToast(`${blockDialog.contact?.name} has been blocked`, "warning");
        setBlockDialog({ open: false, contact: null });
    }

    function handleReportContact() {
        const contact = contacts.find((c) => c.id === selectedId);
        if (contact) setReportDialog({ open: true, contact });
    }

    function executeReport(reason) {
        onToast && onToast(`Report submitted for ${reportDialog.contact?.name}`, "info");
        setReportDialog({ open: false, contact: null });
    }

    const selectedContact = contacts.find((c) => c.id === selectedId);
    const activeMessages = selectedId ? messages[selectedId] || [] : [];
    const isTyping = selectedId ? !!typingMap[selectedId] : false;

    return (
        <div className="app-shell" id="app-shell">
            {/* ── Left Sidebar (Rail + Section Panel) ── */}
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                contacts={contacts}
                selectedId={selectedId}
                onSelect={selectContact}
                currentUser={currentUser}
                darkMode={darkMode}
                onToggleDark={() => {
                    const next = !darkMode;
                    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
                    localStorage.setItem("cc-theme", next ? "dark" : "light");
                    setDarkMode(next);
                }}
                onOpenProfile={() => setShowProfile(true)}
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onPinToggle={handlePinToggle}
                onDeleteChat={handleDeleteChat}
                onClearChat={handleClearChat}
                calls={calls}
                onStartCall={(contact, isVideo) => setCallDialog({ open: true, contact, isVideo })}
                statuses={statuses}
                onViewStatus={(item) => setStatusViewer({ open: true, item })}
                onNewChat={() => setNewChatOpen(true)}
                filter={filter}
                onFilterChange={setFilter}
            />

            {/* ── Main Chat Area (Pure White) ── */}
            <main className="main-chat-area" id="main-chat-area">
                {selectedContact ? (
                    <>
                        {/* Pure White Chat Header */}
                        <ChatHeader
                            contact={selectedContact}
                            onBack={goBackToList}
                            isTyping={isTyping}
                            onViewProfile={() => setContactInfoDialog({ open: true, contact: selectedContact })}
                            onVoiceCall={(contact) => setCallDialog({ open: true, contact, isVideo: false })}
                            onVideoCall={(contact) => setCallDialog({ open: true, contact, isVideo: true })}
                            onBlockUser={handleBlockContact}
                            onReportUser={handleReportContact}
                            onClearChat={() => handleClearChat(selectedId)}
                            onDeleteChat={() => handleDeleteChat(selectedId)}
                            onSearchInChat={() => onToast && onToast("Search in chat triggered", "info")}
                            onCloseChat={() => {
                                setSelectedId(null);
                                goBackToList();
                            }}
                        />

                        {/* Typing indicator alert */}
                        {isTyping && (
                            <div className="typing-status-ribbon">
                                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                                <span>{selectedContact.name} is typing…</span>
                            </div>
                        )}

                        {/* Pure White Message List */}
                        <MessageList
                            messages={activeMessages}
                            contacts={contacts}
                            currentUser={currentUser}
                            onReact={handleReact}
                            onReply={(msgId) => setReplyTo(msgId)}
                            onDelete={confirmDeleteMessage}
                            onPin={handlePinMessage}
                            onForward={(msgId) => onToast && onToast("Forwarding message...", "info")}
                            onToast={onToast}
                        />

                        {/* Pure White Sticky Message Composer */}
                        <MessageInput
                            onSend={(txt) => sendMessage(txt)}
                            onSendDocument={(fileData) => sendMessage("", { file: fileData })}
                            onSendVoice={(duration) => sendMessage("", { voice: { duration } })}
                            replyTo={replyTo}
                            onCancelReply={() => setReplyTo(null)}
                            messages={activeMessages}
                            contacts={contacts}
                        />
                    </>
                ) : (
                    /* Pure White Empty Welcome Screen */
                    <div className="empty-chat-welcome">
                        <div className="welcome-brand-badge">
                            <ChatIcon style={{ fontSize: 36, color: "#6366f1" }} />
                        </div>
                        <h2 className="welcome-title">Welcome to ConnectChat</h2>
                        <p className="welcome-subtitle">
                            Select a conversation from the sidebar to start chatting.
                            All conversations are private, protected and secure.
                        </p>
                    </div>
                )}
            </main>

            {/* ── Dialogs ── */}
            <CallDialog
                open={callDialog.open}
                contact={callDialog.contact}
                isVideo={callDialog.isVideo}
                onClose={() => setCallDialog({ open: false, contact: null, isVideo: false })}
            />

            <StatusViewerDialog
                open={statusViewer.open}
                statusItem={statusViewer.item}
                onClose={() => setStatusViewer({ open: false, item: null })}
            />

            <ProfileDialog
                open={contactInfoDialog.open}
                contact={contactInfoDialog.contact}
                onClose={() => setContactInfoDialog({ open: false, contact: null })}
            />

            <DeleteMessageDialog
                open={deleteMsgDialog.open}
                onConfirm={executeDeleteMessage}
                onCancel={() => setDeleteMsgDialog({ open: false, msgId: null })}
            />

            <DeleteChatDialog
                open={deleteChatDialog.open}
                contactName={contacts.find((c) => c.id === deleteChatDialog.contactId)?.name}
                onConfirm={executeDeleteChat}
                onCancel={() => setDeleteChatDialog({ open: false, contactId: null })}
            />

            <ClearChatDialog
                open={clearChatDialog.open}
                onConfirm={executeClearChat}
                onCancel={() => setClearChatDialog({ open: false, contactId: null })}
            />

            <BlockUserDialog
                open={blockDialog.open}
                contactName={blockDialog.contact?.name}
                onConfirm={executeBlock}
                onCancel={() => setBlockDialog({ open: false, contact: null })}
            />

            <ReportUserDialog
                open={reportDialog.open}
                contactName={reportDialog.contact?.name}
                onConfirm={executeReport}
                onCancel={() => setReportDialog({ open: false, contact: null })}
            />

            <NewChatDialog
                open={newChatOpen}
                contacts={contacts}
                onClose={() => setNewChatOpen(false)}
                onSelectContact={(id) => {
                    selectContact(id);
                    setActiveTab("chats");
                }}
            />

            {/* Profile Drawer */}
            {showProfile && (
                <Profile
                    user={currentUser}
                    onClose={() => setShowProfile(false)}
                    onLogout={onLogout}
                    onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
                    onToast={onToast}
                />
            )}
        </div>
    );
}

export default Chat;
