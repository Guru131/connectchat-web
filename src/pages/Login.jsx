import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ──────────────────────────────────────────────────────
// Login form
// ──────────────────────────────────────────────────────
function LoginForm({ onLogin, onGoRegister, onGoForgot }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function validate() {
        const e = {};
        if (!email.trim()) e.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
        if (!password) e.password = "Password is required.";
        else if (password.length < 6) e.password = "At least 6 characters.";
        return e;
    }

    async function handleSubmit(evt) {
        evt.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setLoading(true);

        // TODO: Replace with real API call to Spring Boot
        // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email, password }),
        //     credentials: "include",   // use httpOnly cookie for JWT
        // });

        // Simulated delay for demo
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        onLogin();
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="auth-form-group">
                <label htmlFor="login-email">Email address</label>
                <div className="auth-input-wrap">
                    <EmailIcon className="input-icon" />
                    <input
                        id="login-email"
                        type="email"
                        className={`auth-input ${errors.email ? "error" : ""}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>
                {errors.email && <p className="auth-error-text">{errors.email}</p>}
            </div>

            <div className="auth-form-group">
                <label htmlFor="login-password">Password</label>
                <div className="auth-input-wrap">
                    <LockIcon className="input-icon" />
                    <input
                        id="login-password"
                        type={showPwd ? "text" : "password"}
                        className={`auth-input ${errors.password ? "error" : ""}`}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setShowPwd(!showPwd)}
                        aria-label="Toggle password visibility"
                    >
                        {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                </div>
                {errors.password && <p className="auth-error-text">{errors.password}</p>}
            </div>

            <div style={{ textAlign: "right", marginBottom: "12px" }}>
                <button type="button" className="auth-link" onClick={onGoForgot}>
                    Forgot password?
                </button>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} id="login-submit-btn">
                {loading ? "Signing in…" : "Sign In"}
            </button>

            <p className="auth-footer">
                Don't have an account?{" "}
                <button type="button" className="auth-link" onClick={onGoRegister}>
                    Create one
                </button>
            </p>
        </form>
    );
}

// ──────────────────────────────────────────────────────
// Register form
// ──────────────────────────────────────────────────────
function RegisterForm({ onLogin, onGoLogin }) {
    const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function set(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (!form.phone.trim()) e.phone = "Phone is required.";
        if (!form.email.trim()) e.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
        if (!form.password) e.password = "Password is required.";
        else if (form.password.length < 6) e.password = "At least 6 characters.";
        return e;
    }

    async function handleSubmit(evt) {
        evt.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setLoading(true);

        // TODO: POST to /auth/register
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        onLogin();
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="auth-form-group">
                <label htmlFor="reg-name">Full name</label>
                <div className="auth-input-wrap">
                    <PersonIcon className="input-icon" />
                    <input
                        id="reg-name"
                        type="text"
                        className={`auth-input ${errors.name ? "error" : ""}`}
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                    />
                </div>
                {errors.name && <p className="auth-error-text">{errors.name}</p>}
            </div>

            <div className="auth-form-group">
                <label htmlFor="reg-phone">Phone number</label>
                <div className="auth-input-wrap">
                    <PhoneIcon className="input-icon" />
                    <input
                        id="reg-phone"
                        type="tel"
                        className={`auth-input ${errors.phone ? "error" : ""}`}
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                    />
                </div>
                {errors.phone && <p className="auth-error-text">{errors.phone}</p>}
            </div>

            <div className="auth-form-group">
                <label htmlFor="reg-email">Email address</label>
                <div className="auth-input-wrap">
                    <EmailIcon className="input-icon" />
                    <input
                        id="reg-email"
                        type="email"
                        className={`auth-input ${errors.email ? "error" : ""}`}
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                    />
                </div>
                {errors.email && <p className="auth-error-text">{errors.email}</p>}
            </div>

            <div className="auth-form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="auth-input-wrap">
                    <LockIcon className="input-icon" />
                    <input
                        id="reg-password"
                        type={showPwd ? "text" : "password"}
                        className={`auth-input ${errors.password ? "error" : ""}`}
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                    />
                    <button type="button" className="eye-toggle" onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                </div>
                {errors.password && <p className="auth-error-text">{errors.password}</p>}
            </div>

            <button type="submit" className="auth-btn" disabled={loading} id="register-submit-btn">
                {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="auth-footer">
                Already have an account?{" "}
                <button type="button" className="auth-link" onClick={onGoLogin}>
                    Sign in
                </button>
            </p>
        </form>
    );
}

// ──────────────────────────────────────────────────────
// Forgot Password
// ──────────────────────────────────────────────────────
function ForgotPasswordForm({ onGoLogin, onGoReset }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(evt) {
        evt.preventDefault();
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError("Enter a valid email address.");
            return;
        }
        setError("");
        setLoading(true);
        // TODO: POST to /auth/forgot-password
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        setSent(true);
    }

    if (sent) {
        return (
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>Check your inbox</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                    We sent a reset link to <strong>{email}</strong>
                </p>
                <button className="auth-btn" onClick={onGoReset} style={{ marginBottom: 12 }}>
                    Enter reset code
                </button>
                <button type="button" className="auth-link" onClick={onGoLogin}>
                    Back to login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <button type="button" className="back-link" onClick={onGoLogin}>
                <ArrowBackIcon style={{ fontSize: 16 }} /> Back to login
            </button>

            <div className="auth-form-group">
                <label htmlFor="forgot-email">Email address</label>
                <div className="auth-input-wrap">
                    <EmailIcon className="input-icon" />
                    <input
                        id="forgot-email"
                        type="email"
                        className={`auth-input ${error ? "error" : ""}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {error && <p className="auth-error-text">{error}</p>}
            </div>

            <button type="submit" className="auth-btn" disabled={loading} id="forgot-submit-btn">
                {loading ? "Sending…" : "Send Reset Link"}
            </button>
        </form>
    );
}

// ──────────────────────────────────────────────────────
// Reset Password
// ──────────────────────────────────────────────────────
function ResetPasswordForm({ onGoLogin }) {
    const [form, setForm] = useState({ code: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    function set(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function validate() {
        const e = {};
        if (!form.code.trim()) e.code = "Code is required.";
        if (!form.password || form.password.length < 6) e.password = "At least 6 characters.";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
        return e;
    }

    async function handleSubmit(evt) {
        evt.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setLoading(true);
        // TODO: POST to /auth/reset-password
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        setDone(true);
    }

    if (done) {
        return (
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>Password reset!</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                    You can now sign in with your new password.
                </p>
                <button className="auth-btn" onClick={onGoLogin}>Sign In</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <button type="button" className="back-link" onClick={onGoLogin}>
                <ArrowBackIcon style={{ fontSize: 16 }} /> Back to login
            </button>

            <div className="auth-form-group">
                <label htmlFor="reset-code">Reset code</label>
                <div className="auth-input-wrap">
                    <LockIcon className="input-icon" />
                    <input
                        id="reset-code"
                        type="text"
                        className={`auth-input ${errors.code ? "error" : ""}`}
                        placeholder="Enter the code from your email"
                        value={form.code}
                        onChange={(e) => set("code", e.target.value)}
                    />
                </div>
                {errors.code && <p className="auth-error-text">{errors.code}</p>}
            </div>

            <div className="auth-form-group">
                <label htmlFor="reset-pwd">New password</label>
                <div className="auth-input-wrap">
                    <LockIcon className="input-icon" />
                    <input
                        id="reset-pwd"
                        type="password"
                        className={`auth-input ${errors.password ? "error" : ""}`}
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                    />
                </div>
                {errors.password && <p className="auth-error-text">{errors.password}</p>}
            </div>

            <div className="auth-form-group">
                <label htmlFor="reset-confirm">Confirm password</label>
                <div className="auth-input-wrap">
                    <LockIcon className="input-icon" />
                    <input
                        id="reset-confirm"
                        type="password"
                        className={`auth-input ${errors.confirm ? "error" : ""}`}
                        placeholder="Repeat new password"
                        value={form.confirm}
                        onChange={(e) => set("confirm", e.target.value)}
                    />
                </div>
                {errors.confirm && <p className="auth-error-text">{errors.confirm}</p>}
            </div>

            <button type="submit" className="auth-btn" disabled={loading} id="reset-submit-btn">
                {loading ? "Resetting…" : "Reset Password"}
            </button>
        </form>
    );
}

// ──────────────────────────────────────────────────────
// Main Login page – controls which auth sub-form is shown
// ──────────────────────────────────────────────────────
function Login({ onLogin }) {
    // view: "login" | "register" | "forgot" | "reset"
    const [view, setView] = useState("login");

    const titles = {
        login: { heading: "Welcome back", sub: "Sign in to continue to ConnectChat" },
        register: { heading: "Create account", sub: "Join ConnectChat today – it's free" },
        forgot: { heading: "Forgot password?", sub: "We'll send a reset link to your email" },
        reset: { heading: "Reset password", sub: "Set a new secure password" },
    };

    const { heading, sub } = titles[view];

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Brand */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <ChatIcon style={{ fontSize: 26 }} />
                    </div>
                    <span className="auth-logo-name">ConnectChat</span>
                </div>

                <h2 className="auth-title">{heading}</h2>
                <p className="auth-subtitle">{sub}</p>

                {view === "login" && (
                    <LoginForm
                        onLogin={onLogin}
                        onGoRegister={() => setView("register")}
                        onGoForgot={() => setView("forgot")}
                    />
                )}

                {view === "register" && (
                    <RegisterForm onLogin={onLogin} onGoLogin={() => setView("login")} />
                )}

                {view === "forgot" && (
                    <ForgotPasswordForm
                        onGoLogin={() => setView("login")}
                        onGoReset={() => setView("reset")}
                    />
                )}

                {view === "reset" && (
                    <ResetPasswordForm onGoLogin={() => setView("login")} />
                )}
            </div>
        </div>
    );
}

export default Login;
