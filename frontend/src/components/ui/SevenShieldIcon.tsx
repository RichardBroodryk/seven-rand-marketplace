import styles from "./SevenShieldIcon.module.css";

interface SevenShieldIconProps {
    status?: "verified" | "pending" | "unverified";
    size?: "small" | "medium" | "large";
    className?: string;
}

export default function SevenShieldIcon({
    status = "verified",
    size = "medium",
    className = "",
}: SevenShieldIconProps) {
    const sizeMap = {
        small: 32,
        medium: 48,
        large: 64,
    };

    const colorMap = {
        verified: {
            main: "#10b981",
            glow: "rgba(16, 185, 129, 0.3)",
            bg: "rgba(16, 185, 129, 0.1)",
        },
        pending: {
            main: "#f59e0b",
            glow: "rgba(245, 158, 11, 0.3)",
            bg: "rgba(245, 158, 11, 0.1)",
        },
        unverified: {
            main: "#ef4444",
            glow: "rgba(239, 68, 68, 0.3)",
            bg: "rgba(239, 68, 68, 0.1)",
        },
    };

    const sizePx = sizeMap[size];
    const colors = colorMap[status];

    return (
        <div
            className={`${styles.container} ${styles[size]} ${className}`}
            style={{
                width: sizePx + 12,
                height: sizePx + 12,
                background: colors.bg,
            }}
        >
            <svg
                width={sizePx}
                height={sizePx}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                {/* Shield Shape - Unique design with curved top and pointed bottom */}
                <path
                    d="M50 4L12 20V44C12 68 28 86 50 96C72 86 88 68 88 44V20L50 4Z"
                    fill="white"
                    stroke={colors.main}
                    strokeWidth="4"
                    strokeLinejoin="round"
                />
                {/* Inner shield glow */}
                <path
                    d="M50 12L20 25V44C20 63 33 78 50 86C67 78 80 63 80 44V25L50 12Z"
                    fill={colors.main}
                    opacity="0.1"
                />
                {/* Shield border accent */}
                <path
                    d="M50 4L12 20V44C12 68 28 86 50 96"
                    stroke={colors.main}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                />
                {/* Number 7 - Modern bold style */}
                <text
                    x="50"
                    y="62"
                    textAnchor="middle"
                    fontSize="44"
                    fontWeight="800"
                    fill={colors.main}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    style={{ letterSpacing: '-2px' }}
                >
                    7
                </text>
                {/* Status dot */}
                <circle
                    cx="78"
                    cy="22"
                    r="8"
                    fill={colors.main}
                    stroke="white"
                    strokeWidth="3"
                />
                {/* Checkmark for verified */}
                {status === "verified" && (
                    <path
                        d="M74 22L77 25L82 18"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}
                {/* Question mark for pending */}
                {status === "pending" && (
                    <text
                        x="78"
                        y="26"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill="white"
                        fontFamily="system-ui, sans-serif"
                    >
                        ?
                    </text>
                )}
                {/* X for unverified */}
                {status === "unverified" && (
                    <path
                        d="M73 18L83 26M83 18L73 26"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                )}
                {/* Glow effect */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill={colors.main}
                    opacity="0.05"
                />
            </svg>
        </div>
    );
}