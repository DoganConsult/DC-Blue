import plotly.graph_objects as go
import numpy as np
from app.charts.solutions._theme import *

def build_iot_diagram():
    rng = np.random.default_rng(42)
    clusters = [
        {"name": "Healthcare Campus", "lat": 24.71, "lon": 46.68, "devices": 480, "color": CYAN, "type": "Medical IoT"},
        {"name": "Industrial Zone", "lat": 24.74, "lon": 46.75, "devices": 640, "color": AMBER, "type": "IIoT Sensors"},
        {"name": "Smart City Core", "lat": 24.69, "lon": 46.72, "devices": 300, "color": EMERALD, "type": "Urban Sensors"},
        {"name": "Data Center", "lat": 24.72, "lon": 46.65, "devices": 1200, "color": PURPLE, "type": "Server Telemetry"},
        {"name": "Airport Zone", "lat": 24.76, "lon": 46.70, "devices": 180, "color": ORANGE, "type": "Aviation IoT"},
        {"name": "Retail District", "lat": 24.68, "lon": 46.78, "devices": 95, "color": TEAL, "type": "POS/Inventory"},
    ]

    fig = go.Figure()
    for cl in clusters:
        n = min(cl["devices"], 40)
        sx = rng.normal(cl["lon"], 0.008, n)
        sy = rng.normal(cl["lat"], 0.006, n)
        fig.add_trace(go.Scatter(x=sx, y=sy, mode="markers",
            marker=dict(size=4, color=cl["color"], opacity=0.4), showlegend=False, hoverinfo="none"))
        fig.add_trace(go.Scatter(x=[cl["lon"]], y=[cl["lat"]], mode="markers+text",
            text=[cl["name"]], textposition="top center", textfont=dict(size=10, color=TEXT),
            marker=dict(size=cl["devices"] / 30 + 10, color=cl["color"],
                        line=dict(width=2, color=DARK_BG), symbol="hexagon2"),
            name=f'{cl["name"]} ({cl["devices"]})',
            hovertemplate=f'<b>{cl["name"]}</b><br>Type: {cl["type"]}<br>Devices: {cl["devices"]}<br>'
                          f'Lat: {cl["lat"]:.3f}<br>Lon: {cl["lon"]:.3f}<extra></extra>'))

    for i in range(len(clusters)):
        for j in range(i + 1, len(clusters)):
            if rng.random() > 0.4:
                fig.add_trace(go.Scatter(
                    x=[clusters[i]["lon"], clusters[j]["lon"]],
                    y=[clusters[i]["lat"], clusters[j]["lat"]],
                    mode="lines", line=dict(width=0.8, color="rgba(56,189,248,0.15)", dash="dot"),
                    hoverinfo="none", showlegend=False))

    total = sum(c["devices"] for c in clusters)
    fig.update_layout(**solution_layout(f"IoT Sensor Mesh — {total:,} Devices Across 6 Zones"),
        height=600, showlegend=True,
        legend=dict(x=0.01, y=-0.1, orientation="h", font=dict(size=10, color=TEXT2), bgcolor="rgba(0,0,0,0)"),
        xaxis=dict(title="Longitude", gridcolor=GRID, tickformat=".2f"),
        yaxis=dict(title="Latitude", gridcolor=GRID, tickformat=".2f", scaleanchor="x"))
    return fig
