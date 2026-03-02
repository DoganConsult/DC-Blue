NOC_COLORS = {
    "bg_primary": "rgba(2,6,23,1)",
    "bg_secondary": "rgba(10,22,40,1)",
    "text_primary": "#e2e8f0",
    "text_secondary": "#94a3b8",
    "text_muted": "#64748b",
    "cyan": "#38bdf8",
    "emerald": "#34d399",
    "purple": "#c084fc",
    "red": "#f87171",
    "amber": "#fbbf24",
    "teal": "#2dd4bf",
    "indigo": "#818cf8",
    "orange": "#fb923c",
    "sky": "#0ea5e9",
    "green_dark": "#059669",
    "red_dark": "#dc2626",
    "blue_dark": "#0284c7",
    "purple_dark": "#7c3aed",
    "grid_color": "rgba(148,163,184,0.06)",
    "border_color": "rgba(56,189,248,0.15)",
}

NOC_SERIES = [
    "#38bdf8", "#34d399", "#c084fc", "#f87171",
    "#fbbf24", "#2dd4bf", "#818cf8", "#fb923c",
]

NOC_LAYOUT = dict(
    paper_bgcolor=NOC_COLORS["bg_primary"],
    plot_bgcolor=NOC_COLORS["bg_secondary"],
    font=dict(family="JetBrains Mono, monospace", color=NOC_COLORS["text_primary"], size=11),
    margin=dict(l=50, r=30, t=50, b=50),
)
