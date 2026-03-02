DARK_BG = "rgba(2,6,23,1)"
PLOT_BG = "rgba(10,22,40,1)"
GRID = "rgba(148,163,184,0.06)"
TEXT = "#e2e8f0"
TEXT2 = "#94a3b8"
MUTED = "#64748b"
CYAN = "#38bdf8"
EMERALD = "#34d399"
PURPLE = "#c084fc"
RED = "#f87171"
AMBER = "#fbbf24"
TEAL = "#2dd4bf"
INDIGO = "#818cf8"
ORANGE = "#fb923c"
SKY = "#0ea5e9"
ROSE = "#fb7185"
LIME = "#a3e635"
PINK = "#f472b6"

PALETTE = [CYAN, EMERALD, PURPLE, RED, AMBER, TEAL, INDIGO, ORANGE, SKY, ROSE, LIME, PINK]

BASE_LAYOUT = dict(
    paper_bgcolor=DARK_BG,
    plot_bgcolor=PLOT_BG,
    font=dict(family="Inter, system-ui, sans-serif", color=TEXT, size=12),
    margin=dict(l=50, r=30, t=60, b=50),
    hoverlabel=dict(bgcolor="rgba(15,23,42,0.95)", bordercolor=CYAN, font=dict(color=TEXT, size=11)),
)

def solution_layout(title, **kwargs):
    layout = {**BASE_LAYOUT, "title": dict(text=title, font=dict(size=16, color=TEXT), x=0.02, y=0.97)}
    layout.update(kwargs)
    return layout
