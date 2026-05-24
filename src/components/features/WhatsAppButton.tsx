// ============================================================
// WhatsAppButton - Fixed Floating WhatsApp Support Button
// with auto-show tooltip and smooth animations
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

const WHATSAPP_NUMBER = "8801309407154";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "আস-সালামু আলাইকুম! আমি গাজীর চট মদিনাতুল উলুম মাদরাসার ওয়েবসাইট থেকে যোগাযোগ করছি।"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const AUTO_SHOW_DELAY = 4000;  // 4s after mount
const AUTO_HIDE_DELAY = 5000;  // visible for 5s then fades

function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
  }, []);

  const showTooltip = useCallback(() => {
    setTooltipVisible(true);
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  const scheduleAutoHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setTooltipVisible(false);
    }, AUTO_HIDE_DELAY);
  }, []);

  // Auto-show 4s after mount, then auto-hide after 5s
  useEffect(() => {
    showTimerRef.current = setTimeout(() => {
      setTooltipVisible(true);
      scheduleAutoHide();
    }, AUTO_SHOW_DELAY);

    return () => { clearTimers(); };
  }, []);

  // On desktop hover: show tooltip, cancel auto-hide
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setTooltipVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    scheduleAutoHide();
  }, [scheduleAutoHide]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimers();
    hideTooltip();
  }, [clearTimers, hideTooltip]);

  return (
    <div
      className="fixed z-50"
      style={{ bottom: "24px", right: "20px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Tooltip ── */}
      <div
        aria-hidden={!tooltipVisible}
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          right: 0,
          minWidth: "210px",
          opacity: tooltipVisible ? 1 : 0,
          transform: tooltipVisible ? "translateY(0) scale(1)" : "translateY(6px) scale(0.97)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: tooltipVisible ? "auto" : "none",
          background: "rgba(7,20,12,0.96)",
          border: "1px solid rgba(37,211,102,0.25)",
          borderRadius: "14px",
          padding: "10px 14px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.45), 0 2px 8px rgba(37,211,102,0.12)",
          backdropFilter: "blur(12px)",
          color: "#f8f4e8",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close tooltip"
          style={{
            position: "absolute",
            top: "6px",
            right: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(248,244,232,0.35)",
            fontSize: "14px",
            lineHeight: 1,
            padding: "2px 4px",
            borderRadius: "4px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(248,244,232,0.8)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(248,244,232,0.35)"; }}
        >
          ×
        </button>

        {/* WhatsApp icon row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", paddingRight: "16px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg, #25d366, #128c7e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <WhatsAppIcon size={16} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#f8f4e8", lineHeight: 1.3 }}>
            Need Help?
          </span>
        </div>

        <p style={{ fontSize: "11.5px", color: "rgba(248,244,232,0.6)", margin: 0, lineHeight: 1.5 }}>
          Contact Developer
        </p>

        {/* Caret */}
        <div style={{
          position: "absolute",
          bottom: "-6px",
          right: "20px",
          width: "10px",
          height: "10px",
          background: "rgba(7,20,12,0.96)",
          border: "1px solid rgba(37,211,102,0.25)",
          borderTop: "none",
          borderLeft: "none",
          transform: "rotate(45deg)",
        }} />
      </div>

      {/* ── WhatsApp Button ── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp-এ যোগাযোগ করুন"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25d366, #128c7e)",
          boxShadow: isHovered
            ? "0 6px 28px rgba(37,211,102,0.55), 0 3px 10px rgba(0,0,0,0.35)"
            : "0 4px 20px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.3)",
          color: "#fff",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          textDecoration: "none",
          position: "relative",
        }}
      >
        <WhatsAppIcon size={26} />

        {/* Pulse ring when tooltip is visible */}
        {tooltipVisible && !isHovered && (
          <span
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              border: "2px solid rgba(37,211,102,0.4)",
              animation: "wa-pulse 1.6s ease-out infinite",
              pointerEvents: "none",
            }}
          />
        )}
      </a>

      {/* Keyframe injection */}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
