import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
from app.charts.solutions._theme import *

def build_support_diagram():
    rng = np.random.default_rng(42)

    hours = list(range(24))
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    z = []
    for d in range(7):
        row = []
        for h in range(24):
            base = 5 if d < 5 else 2
            if 8 <= h <= 17 and d < 5:
                base = 25
            if 9 <= h <= 12 and d < 5:
                base = 40
            row.append(max(0, base + rng.integers(-3, 8)))
        z.append(row)

    fig = make_subplots(rows=1, cols=2,
        specs=[[{"type": "heatmap"}, {"type": "bar"}]],
        subplot_titles=["Incident Volume by Day/Hour", "Resolution by Priority Level"],
        horizontal_spacing=0.12, column_widths=[0.6, 0.4])

    fig.add_trace(go.Heatmap(
        z=z, x=[f"{h:02d}:00" for h in hours], y=days,
        colorscale=[[0, "#020617"], [0.2, "#164e63"], [0.5, "#0ea5e9"], [0.8, "#fbbf24"], [1, "#f87171"]],
        hovertemplate="<b>%{y} %{x}</b><br>Incidents: %{z}<extra></extra>",
        showscale=True,
        colorbar=dict(title="Count", titlefont=dict(size=10, color=TEXT2),
                      tickfont=dict(size=9, color=MUTED), len=0.8),
    ), row=1, col=1)

    priorities = ["P1 — Critical", "P2 — High", "P3 — Medium", "P4 — Low"]
    mttr = [12, 45, 180, 480]
    sla_target = [15, 60, 240, 720]
    colors = [RED, AMBER, CYAN, TEAL]

    for i, (prio, val, target, color) in enumerate(zip(priorities, mttr, sla_target, colors)):
        fig.add_trace(go.Bar(
            x=[prio], y=[val], name=prio,
            marker=dict(color=color, opacity=0.8, line=dict(width=1, color=color)),
            hovertemplate=f'<b>{prio}</b><br>MTTR: {val} min<br>SLA: {target} min<extra></extra>',
            showlegend=False,
        ), row=1, col=2)
        fig.add_trace(go.Scatter(
            x=[prio], y=[target], mode="markers",
            marker=dict(size=12, color="rgba(0,0,0,0)", line=dict(width=2, color="#fff"), symbol="line-ew-open"),
            hovertemplate=f'SLA Target: {target} min<extra></extra>',
            showlegend=False,
        ), row=1, col=2)

    fig.update_layout(**solution_layout("Technical Support — Incident Pattern Analysis"),
        height=500, showlegend=False,
        yaxis2=dict(title="Minutes to Resolve", gridcolor=GRID),
        xaxis2=dict(gridcolor="rgba(0,0,0,0)"))

    for ann in fig.layout.annotations:
        ann.update(font=dict(size=13, color=TEXT2))
    return fig
