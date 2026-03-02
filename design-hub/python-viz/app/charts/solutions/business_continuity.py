import plotly.graph_objects as go
import numpy as np
from app.charts.solutions._theme import *

def build_business_continuity_diagram():
    rng = np.random.default_rng(42)
    systems = [
        {"name": "Core ERP", "rto": 1, "rpo": 0.25, "risk": "Critical", "tier": 1},
        {"name": "Email & Collab", "rto": 2, "rpo": 0.5, "risk": "High", "tier": 1},
        {"name": "CRM System", "rto": 4, "rpo": 1, "risk": "High", "tier": 2},
        {"name": "HR Portal", "rto": 8, "rpo": 2, "risk": "Medium", "tier": 2},
        {"name": "Data Warehouse", "rto": 12, "rpo": 4, "risk": "Medium", "tier": 3},
        {"name": "Dev/Test Env", "rto": 24, "rpo": 8, "risk": "Low", "tier": 3},
        {"name": "File Shares", "rto": 6, "rpo": 1, "risk": "Medium", "tier": 2},
        {"name": "VoIP/UC", "rto": 0.5, "rpo": 0, "risk": "Critical", "tier": 1},
        {"name": "Active Directory", "rto": 0.5, "rpo": 0.1, "risk": "Critical", "tier": 1},
        {"name": "Web Portal", "rto": 2, "rpo": 0.5, "risk": "High", "tier": 1},
        {"name": "Backup Systems", "rto": 4, "rpo": 0.5, "risk": "High", "tier": 2},
        {"name": "IoT Platform", "rto": 8, "rpo": 2, "risk": "Medium", "tier": 2},
        {"name": "Analytics", "rto": 16, "rpo": 4, "risk": "Low", "tier": 3},
        {"name": "Legacy Apps", "rto": 48, "rpo": 24, "risk": "Low", "tier": 3},
    ]

    risk_colors = {"Critical": RED, "High": AMBER, "Low": TEAL, "Medium": CYAN}
    tier_sizes = {1: 18, 2: 13, 3: 9}

    fig = go.Figure()

    fig.add_shape(type="rect", x0=0, y0=0, x1=4, y1=1,
        fillcolor="rgba(239,68,68,0.06)", line=dict(width=0))
    fig.add_shape(type="rect", x0=0, y0=1, x1=4, y1=4,
        fillcolor="rgba(251,191,36,0.04)", line=dict(width=0))
    fig.add_annotation(x=2, y=0.5, text="<b>HOT SITE ZONE</b>", showarrow=False,
        font=dict(size=9, color=RED), opacity=0.5)
    fig.add_annotation(x=2, y=2.5, text="<b>WARM STANDBY</b>", showarrow=False,
        font=dict(size=9, color=AMBER), opacity=0.4)
    fig.add_annotation(x=30, y=15, text="<b>COLD STORAGE</b>", showarrow=False,
        font=dict(size=9, color=MUTED), opacity=0.4)

    for sys in systems:
        color = risk_colors[sys["risk"]]
        size = tier_sizes[sys["tier"]]
        fig.add_trace(go.Scatter(
            x=[sys["rto"]], y=[sys["rpo"]], mode="markers+text",
            text=[sys["name"]], textposition="top center",
            textfont=dict(size=8, color=TEXT2),
            marker=dict(size=size, color=color, opacity=0.8,
                        line=dict(width=2, color=DARK_BG)),
            hovertemplate=f'<b>{sys["name"]}</b><br>RTO: {sys["rto"]}h<br>'
                          f'RPO: {sys["rpo"]}h<br>Risk: {sys["risk"]}<br>'
                          f'Tier: {sys["tier"]}<extra></extra>',
            showlegend=False))

    for risk, color in risk_colors.items():
        fig.add_trace(go.Scatter(x=[None], y=[None], mode="markers",
            marker=dict(size=10, color=color), name=risk))

    fig.add_trace(go.Scatter(
        x=[0, 50], y=[0, 50], mode="lines",
        line=dict(color=MUTED, width=1, dash="dot"),
        hoverinfo="none", showlegend=False))
    fig.add_annotation(x=35, y=38, text="RTO = RPO line", showarrow=False,
        font=dict(size=9, color=MUTED))

    fig.update_layout(**solution_layout("Business Continuity — RTO/RPO Analysis"),
        height=600, showlegend=True,
        legend=dict(x=0.75, y=0.98, font=dict(size=10, color=TEXT2), bgcolor="rgba(15,23,42,0.8)"),
        xaxis=dict(title="Recovery Time Objective (hours)", type="log",
                   gridcolor=GRID, range=[-0.5, 2]),
        yaxis=dict(title="Recovery Point Objective (hours)", type="log",
                   gridcolor=GRID, range=[-1.5, 2]))
    return fig
