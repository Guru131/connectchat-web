import { useState, useRef, useEffect } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

const DEMO_OTP_LENGTH = 6;

const COUNTRIES = [
    { name: "India", code: "+91", flag: "🇮🇳", maxLen: 10, regex: /^[6-9]\d{9}$/, placeholder: "98765 43210" },
    { name: "United States", code: "+1", flag: "🇺🇸", maxLen: 10, regex: /^\d{10}$/, placeholder: "202 555 0123" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧", maxLen: 10, regex: /^\d{10}$/, placeholder: "7911 123456" },
    { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", maxLen: 9, regex: /^\d{9}$/, placeholder: "50 123 4567" },
    { name: "Australia", code: "+61", flag: "🇦🇺", maxLen: 9, regex: /^\d{9}$/, placeholder: "412 345 678" },
    { name: "Singapore", code: "+65", flag: "🇸🇬", maxLen: 8, regex: /^\d{8}$/, placeholder: "8123 4567" },
];

function PhoneLogin({ onVerified }) {
    const [country, setCountry] = useState(COUNTRIES[0]);
    const [showCountryDrop, setShowCountryDrop] = useState(false);
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [sending, setSending] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const dropdownRef = useRef(null);

    // Close country dropdown on outside click
    useEffect(() => {
        function handleOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowCountryDrop(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    function validatePhone() {
        const digits = phone.replace(/\D/g, "");
        if (!digits) {
            setPhoneError("Please enter your mobile number");
            return false;
        }
        if (!country.regex.test(digits)) {
            setPhoneError(`Please enter a valid ${country.maxLen}-digit number for ${country.name}`);
            return false;
        }
        setPhoneError("");
        return true;
    }

    async function handleContinue() {
        if (!validatePhone()) return;
        setSending(true);
        await new Promise((r) => setTimeout(r, 800));
        setSending(false);
        setShowOtp(true);
    }

    const displayPhone = `${country.code} ${phone}`;

    if (showOtp) {
        return (
            <OtpVerification
                phone={displayPhone}
                onVerified={() => onVerified(displayPhone)}
                onBack={() => setShowOtp(false)}
            />
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Brand */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <ChatIcon style={{ fontSize: 24 }} />
                    </div>
                    <span className="auth-logo-name">ConnectChat</span>
                </div>

                <h2 className="auth-title">Welcome to ConnectChat</h2>
                <p className="auth-subtitle">
                    Enter your mobile number to receive a verification code
                </p>

                {/* ── Single Unified Country Code + Phone Input Bar ── */}
                <div className="unified-phone-wrapper" ref={dropdownRef}>
                    <label className="unified-input-label">PHONE NUMBER</label>
                    <div className={`unified-phone-box ${phoneError ? "input-has-error" : ""}`}>
                        {/* Country Trigger */}
                        <button
                            type="button"
                            className="unified-country-trigger"
                            onClick={() => setShowCountryDrop((v) => !v)}
                            title="Select country code"
                        >
                            <span className="country-flag-icon">{country.flag}</span>
                            <span className="country-code-text">{country.code}</span>
                            <KeyboardArrowDownIcon style={{ fontSize: 18, color: "#64748b" }} />
                        </button>

                        <div className="unified-input-divider" />

                        {/* Direct Number Input */}
                        <input
                            id="phone-number-field"
                            type="tel"
                            className="unified-number-input"
                            placeholder={country.placeholder}
                            value={phone}
                            maxLength={country.maxLen}
                            onChange={(e) => {
                                setPhone(e.target.value.replace(/\D/g, ""));
                                setPhoneError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                            autoFocus
                        />

                        {/* Country Dropdown Menu */}
                        {showCountryDrop && (
                            <div className="unified-country-menu">
                                {COUNTRIES.map((c) => (
                                    <div
                                        key={c.code}
                                        className={`country-menu-item ${c.code === country.code ? "selected" : ""}`}
                                        onClick={() => {
                                            setCountry(c);
                                            setShowCountryDrop(false);
                                            setPhone("");
                                            setPhoneError("");
                                        }}
                                    >
                                        <span className="c-item-flag">{c.flag}</span>
                                        <span className="c-item-name">{c.name}</span>
                                        <span className="c-item-code">{c.code}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {phoneError && <p className="auth-error-text">{phoneError}</p>}
                </div>

                {/* Submit Action */}
                <button
                    type="button"
                    className="auth-btn"
                    onClick={handleContinue}
                    disabled={sending}
                    id="phone-continue-btn"
                >
                    {sending ? "Sending OTP Code…" : "Continue with Mobile"}
                </button>

                {/* Security Note */}
                <div className="auth-security-note">
                    <ShieldOutlinedIcon style={{ fontSize: 16, color: "#10b981" }} />
                    <span>End-to-end encrypted • No spam</span>
                </div>
            </div>
        </div>
    );
}

// ── 6-Digit OTP Verification Screen ──
function OtpVerification({ phone, onVerified, onBack }) {
    const [otp, setOtp] = useState(Array(DEMO_OTP_LENGTH).fill(""));
    const [verifying, setVerifying] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    function handleOtpChange(index, value) {
        if (!/^\d?$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        setOtpError("");

        if (value && index < DEMO_OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleOtpKeyDown(index, e) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter") handleVerify();
    }

    function handlePaste(e) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
        e.preventDefault();
    }

    async function handleVerify() {
        const entered = otp.join("");
        if (entered.length < DEMO_OTP_LENGTH) {
            setOtpError("Please enter the complete 6-digit verification code");
            return;
        }

        setVerifying(true);
        await new Promise((r) => setTimeout(r, 700));
        setVerifying(false);
        setShowSuccess(true);
    }

    function resendOtp() {
        setOtp(Array(DEMO_OTP_LENGTH).fill(""));
        setOtpError("");
        setResendCooldown(30);
        inputRefs.current[0]?.focus();
    }

    if (showSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ textAlign: "center" }}>
                    <div className="otp-success-icon-wrap">
                        <CheckCircleIcon style={{ fontSize: 60, color: "#10b981" }} />
                    </div>
                    <h2 className="auth-title" style={{ marginTop: 14 }}>Verified Successfully!</h2>
                    <p className="auth-subtitle">
                        Your phone number <strong>{phone}</strong> is authenticated.
                    </p>
                    <button
                        type="button"
                        className="auth-btn"
                        id="otp-success-continue-btn"
                        onClick={onVerified}
                    >
                        Open ConnectChat
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <button type="button" className="auth-back-link" onClick={onBack} id="otp-back-btn">
                    <ArrowBackIcon style={{ fontSize: 16 }} /> Change Number
                </button>

                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <ChatIcon style={{ fontSize: 24 }} />
                    </div>
                    <span className="auth-logo-name">ConnectChat</span>
                </div>

                <h2 className="auth-title">Enter 6-Digit Code</h2>
                <p className="auth-subtitle">
                    We sent a code to <strong>{phone}</strong>
                    <br />
                    <span style={{ fontSize: 12, color: "#6366f1" }}>
                        (Demo: any 6 digits e.g. 123456)
                    </span>
                </p>

                {/* OTP Boxes */}
                <div className="otp-boxes-row" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            id={`otp-box-${i}`}
                            ref={(el) => (inputRefs.current[i] = el)}
                            type="tel"
                            inputMode="numeric"
                            maxLength={1}
                            className={`otp-digit-box ${otpError ? "otp-error" : ""}`}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        />
                    ))}
                </div>

                {otpError && <p className="auth-error-text" style={{ textAlign: "center" }}>{otpError}</p>}

                <button
                    type="button"
                    className="auth-btn"
                    onClick={handleVerify}
                    disabled={verifying}
                    id="otp-verify-btn"
                    style={{ marginTop: 16 }}
                >
                    {verifying ? "Verifying…" : "Verify Code"}
                </button>

                <div className="auth-resend-row">
                    <span>Didn't receive code?</span>{" "}
                    {resendCooldown > 0 ? (
                        <span style={{ color: "#64748b", fontWeight: 500 }}>Resend in {resendCooldown}s</span>
                    ) : (
                        <button type="button" className="auth-resend-btn" onClick={resendOtp}>
                            Resend OTP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PhoneLogin;
