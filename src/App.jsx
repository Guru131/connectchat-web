import { useState, useEffect, useCallback } from "react";
import PhoneLogin from "./components/PhoneLogin";
import Chat from "./pages/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import CloseIcon from "@mui/icons-material/Close";

// ── Duration for each toast (ms) ──
const TOAST_DURATION = 3500;

// ── Single Toast Item with progress bar + dismiss button ──
function ToastItem({ toast, onDismiss }) {
    const icons = {
        success: <CheckCircleIcon style={{ fontSize: 18 }} />,
        error:   <ErrorIcon style={{ fontSize: 18 }} />,
        warning: <WarningIcon style={{ fontSize: 18 }} />,
        info:    <InfoIcon style={{ fontSize: 18 }} />,
    };

    return (
        <div
            className={`toast-item toast-item--${toast.type} ${toast.exiting ? "toast-item--exit" : "toast-item--enter"}`}
            role="alert"
        >
            {/* Left accent bar (type color) */}
            <div className="toast-accent-bar" />

            {/* Icon */}
            <span className="toast-type-icon">
                {icons[toast.type] || icons.info}
            </span>

            {/* Message */}
            <span className="toast-message-text">{toast.message}</span>

            {/* Dismiss button */}
            <button
                type="button"
                className="toast-dismiss-btn"
                onClick={() => onDismiss(toast.id)}
                title="Dismiss"
            >
                <CloseIcon style={{ fontSize: 14 }} />
            </button>

            {/* Progress bar */}
            <div className="toast-progress-bar" style={{ animationDuration: `${TOAST_DURATION}ms` }} />
        </div>
    );
}

// ── Toast Stack (top-right) ──
function Toast({ toasts, onDismiss }) {
    return (
        <div className="toast-stack" aria-live="polite" aria-atomic="false">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

function App() {
    // Session persistence via sessionStorage:
    const [loggedIn, setLoggedIn] = useState(() => {
        return sessionStorage.getItem("cc_auth_session") === "true";
    });
    const [toasts, setToasts] = useState([]);
    const [offline, setOffline] = useState(!navigator.onLine);

    // ── Theme: restore saved preference ──
    useEffect(() => {
        const saved = localStorage.getItem("cc-theme") || "light";
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    // ── Offline detection ──
    useEffect(() => {
        function handleOnline()  { setOffline(false); }
        function handleOffline() { setOffline(true); }
        window.addEventListener("online",  handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online",  handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // ── Toast helper – auto-dismiss after TOAST_DURATION ──
    function showToast(message, type = "info") {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

        // Start exit animation 300ms before removal
        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
            );
        }, TOAST_DURATION - 300);

        // Remove after animation completes
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, TOAST_DURATION);
    }

    // ── Manual dismiss ──
    function dismissToast(id) {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 280);
    }

    function handleLogin(phone) {
        sessionStorage.setItem("cc_auth_session", "true");
        if (phone) {
            sessionStorage.setItem("cc_user_phone", phone);
        }
        setLoggedIn(true);
        showToast("Welcome to ConnectChat! 👋", "success");
    }

    function handleLogout() {
        sessionStorage.removeItem("cc_auth_session");
        sessionStorage.removeItem("cc_user_phone");
        setLoggedIn(false);
        showToast("You have been logged out.", "info");
    }

    return (
        <>
            {/* Offline banner */}
            {offline && (
                <div className="offline-banner">
                    <WifiOffIcon style={{ fontSize: 16, verticalAlign: "middle", marginRight: 6 }} />
                    You are offline – check your internet connection
                </div>
            )}

            {/* Main Application Flow: Phone + OTP -> Chat */}
            {loggedIn ? (
                <Chat onLogout={handleLogout} onToast={showToast} />
            ) : (
                <PhoneLogin onVerified={handleLogin} />
            )}

            {/* Toast notifications */}
            <Toast toasts={toasts} onDismiss={dismissToast} />
        </>
    );
}

export default App;
