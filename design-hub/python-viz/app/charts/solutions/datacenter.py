import plotly.graph_objects as go
import numpy as np
from app.charts.solutions._theme import *

def build_datacenter_diagram():
    rows = 4
    racks_per_row = 8
    rack_names, x_pos, y_pos, z_pos, colors, sizes, hovers = [], [], [], [], [], [], []
    rng = np.random.default_rng(42)
    categories = ["Compute", "Storage", "Network", "Security"]
    cat_colors = [CYAN, AMBER, INDIGO, RED]

    for r in range(rows):
        for c in range(racks_per_row):
            cat_idx = (r * racks_per_row + c) % 4
            load = rng.integers(30, 95)
            name = f"R{r+1}-C{c+1}"
            rack_names.append(name)
            x_pos.append(c * 1.5)
            y_pos.append(r * 2.0)
            z_pos.append(load / 100 * 3)
            colors.append(cat_colors[cat_idx])
            sizes.append(8 + load / 10)
            hovers.append(f"<b>{name}</b><br>Type: {categories[cat_idx]}<br>"
                          f"Load: {load}%<br>Power: {rng.integers(2, 12)}kW<br>"
                          f"Temp: {rng.integers(18, 28)}°C")

    fig = go.Figure()
    fig.add_trace(go.Scatter3d(
        x=x_pos, y=y_pos, z=z_pos, mode="markers+text",
        text=rack_names, textposition="top center", textfont=dict(size=7, color=TEXT2),
        marker=dict(size=sizes, color=colors, opacity=0.85,
                    line=dict(width=1, color="rgba(255,255,255,0.1)"),
                    symbol="diamond"),
        hovertext=hovers, hoverinfo="text"))

    for r in range(rows):
        for c in range(racks_per_row):
            idx = r * racks_per_row + c
            fig.add_trace(go.Scatter3d(
                x=[x_pos[idx], x_pos[idx]], y=[y_pos[idx], y_pos[idx]], z=[0, z_pos[idx]],
                mode="lines", line=dict(width=2, color=colors[idx]),
                hoverinfo="none", showlegend=False))

    for i, cat in enumerate(categories):
        fig.add_trace(go.Scatter3d(x=[None], y=[None], z=[None], mode="markers",
            marker=dict(size=8, color=cat_colors[i]), name=cat))

    fig.update_layout(**solution_layout("Data Center Layout — 3D Rack Visualization"),
        height=650, showlegend=True,
        legend=dict(x=0.85, y=0.95, bgcolor="rgba(0,0,0,0)", font=dict(size=10, color=TEXT2)),
        scene=dict(
            xaxis=dict(title="Column", gridcolor=GRID, showbackground=False),
            yaxis=dict(title="Row", gridcolor=GRID, showbackground=False),
            zaxis=dict(title="Load Level", gridcolor=GRID, showbackground=False),
            bgcolor=PLOT_BG,
            camera=dict(eye=dict(x=1.8, y=-1.8, z=1.2)),
        ))
    return fig
