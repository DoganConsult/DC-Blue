import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
from app.charts.solutions._theme import *

def build_cybersecurity_diagram():
    fig = make_subplots(rows=1, cols=2,
        specs=[[{"type": "polar"}, {"type": "funnel"}]],
        subplot_titles=["Threat Coverage Radar", "Cyber Kill Chain — Blocked %"],
        horizontal_spacing=0.12)

    domains = ["Perimeter", "Endpoint", "Network", "Application", "Data", "Identity", "Cloud", "OT/IoT"]
    current = [92, 88, 95, 82, 78, 91, 85, 70]
    target = [95, 95, 95, 95, 95, 95, 95, 95]

    fig.add_trace(go.Scatterpolar(
        r=current + [current[0]], theta=domains + [domains[0]],
        fill="toself", fillcolor="rgba(56,189,248,0.15)",
        line=dict(color=CYAN, width=2.5),
        marker=dict(size=7, color=CYAN, line=dict(width=2, color=DARK_BG)),
        name="Current Coverage", hovertemplate="%{theta}: %{r}%<extra></extra>",
    ), row=1, col=1)
    fig.add_trace(go.Scatterpolar(
        r=target + [target[0]], theta=domains + [domains[0]],
        line=dict(color=EMERALD, width=1.5, dash="dash"),
        marker=dict(size=0), name="Target (95%)",
    ), row=1, col=1)

    kill_chain = ["Reconnaissance", "Weaponization", "Delivery", "Exploitation", "Installation", "C2", "Exfiltration"]
    blocked = [99.2, 97.8, 96.1, 92.4, 88.7, 94.3, 91.0]
    kc_colors = [EMERALD, EMERALD, CYAN, CYAN, AMBER, AMBER, RED]

    fig.add_trace(go.Funnel(
        y=kill_chain, x=blocked,
        textinfo="value+percent initial",
        textfont=dict(size=11, color="#fff"),
        marker=dict(color=kc_colors, line=dict(width=1, color=DARK_BG)),
        connector=dict(line=dict(color="rgba(148,163,184,0.1)", width=1)),
        hovertemplate="<b>%{y}</b><br>Blocked: %{x}%<extra></extra>",
    ), row=1, col=2)

    fig.update_layout(**solution_layout("Cybersecurity Posture — Threat Coverage & Kill Chain"),
        height=550, showlegend=True,
        legend=dict(x=0.01, y=-0.08, orientation="h", font=dict(size=10, color=TEXT2), bgcolor="rgba(0,0,0,0)"),
        polar=dict(bgcolor=PLOT_BG,
            radialaxis=dict(range=[0, 100], gridcolor=GRID, tickfont=dict(size=9, color=MUTED)),
            angularaxis=dict(gridcolor=GRID, tickfont=dict(size=10, color=TEXT2))))

    for ann in fig.layout.annotations:
        ann.update(font=dict(size=13, color=TEXT2))
    return fig
