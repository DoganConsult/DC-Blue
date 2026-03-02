import plotly.graph_objects as go
import numpy as np
from app.charts.theme import NOC_COLORS, NOC_LAYOUT

HOURS = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def build_heatmap_figure():
    rng = np.random.default_rng(42)
    z = np.zeros((7, 8), dtype=int)
    for d in range(7):
        for h in range(8):
            base = 60 if 2 <= h <= 5 else 20
            weekend = -15 if d >= 5 else 0
            z[d][h] = max(0, int(base + weekend + rng.integers(0, 40)))

    fig = go.Figure(go.Heatmap(
        z=z,
        x=HOURS,
        y=DAYS,
        colorscale=[
            [0, "#0f172a"], [0.25, "#164e63"],
            [0.5, "#0e7490"], [0.75, "#f59e0b"], [1, "#ef4444"],
        ],
        zmin=0, zmax=100,
        hoverongaps=False,
        texttemplate="%{z}",
        textfont=dict(size=10, color=NOC_COLORS["text_secondary"]),
    ))
    fig.update_layout(
        **NOC_LAYOUT,
        title=dict(text="Threat Activity Heatmap", font=dict(size=14)),
        height=380,
        xaxis=dict(side="top", tickfont=dict(size=10)),
        yaxis=dict(autorange="reversed", tickfont=dict(size=10)),
    )
    return fig
