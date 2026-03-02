import plotly.graph_objects as go
import numpy as np
from app.charts.solutions._theme import *

def build_telecom_diagram():
    rng = np.random.default_rng(42)
    grid_size = 40
    x = np.linspace(0, 10, grid_size)
    y = np.linspace(0, 10, grid_size)
    X, Y = np.meshgrid(x, y)

    towers = [(2, 3), (5, 7), (8, 2), (4, 4), (7, 8), (1, 8), (9, 5)]
    signal = np.zeros_like(X)
    for tx, ty in towers:
        dist = np.sqrt((X - tx)**2 + (Y - ty)**2)
        signal += 100 / (1 + dist**1.8) + rng.normal(0, 2, X.shape)
    signal = np.clip(signal, -110, -30)
    signal = (signal - signal.min()) / (signal.max() - signal.min()) * 100

    fig = go.Figure()
    fig.add_trace(go.Heatmap(
        x=x, y=y, z=signal,
        colorscale=[[0, "#0f172a"], [0.2, "#1e3a5f"], [0.4, "#0e7490"],
                     [0.6, "#38bdf8"], [0.8, "#fbbf24"], [1.0, "#ef4444"]],
        hovertemplate="X: %{x:.1f}km<br>Y: %{y:.1f}km<br>Signal: %{z:.0f} dBm<extra></extra>",
        colorbar=dict(title="Signal (dBm)", tickfont=dict(size=10, color=TEXT2),
                      titlefont=dict(size=11, color=TEXT)),
        zsmooth="best"))

    tower_x = [t[0] for t in towers]
    tower_y = [t[1] for t in towers]
    fig.add_trace(go.Scatter(x=tower_x, y=tower_y, mode="markers+text",
        text=[f"Tower {i+1}" for i in range(len(towers))],
        textposition="top center", textfont=dict(size=9, color="#fff"),
        marker=dict(size=14, color=RED, symbol="triangle-up",
                    line=dict(width=2, color="#fff")),
        hovertemplate="<b>Tower %{pointNumber}</b><br>Pos: (%{x:.1f}, %{y:.1f}) km<extra></extra>",
        name="Cell Towers"))

    for tx, ty in towers:
        fig.add_shape(type="circle", x0=tx-1.8, y0=ty-1.8, x1=tx+1.8, y1=ty+1.8,
            line=dict(color="rgba(248,113,113,0.3)", width=1, dash="dot"))

    fig.update_layout(**solution_layout("Telecom — 5G RF Coverage Heatmap"),
        height=600, showlegend=False,
        xaxis=dict(title="Distance (km)", gridcolor=GRID, constrain="domain"),
        yaxis=dict(title="Distance (km)", gridcolor=GRID, scaleanchor="x"))
    return fig
