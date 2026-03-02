import plotly.graph_objects as go
import numpy as np
from app.charts.solutions._theme import *

def build_network_diagram():
    layers = {
        "Core": {"nodes": ["Core-SW1", "Core-SW2"], "y": 4, "color": CYAN, "size": 28},
        "Security": {"nodes": ["FW-01", "FW-02", "IPS-01"], "y": 3, "color": RED, "size": 22},
        "Distribution": {"nodes": ["Dist-A", "Dist-B", "Dist-C", "Dist-D"], "y": 2, "color": INDIGO, "size": 18},
        "Access": {"nodes": [f"Acc-{i}" for i in range(1, 9)], "y": 1, "color": EMERALD, "size": 12},
        "WAN": {"nodes": ["WAN-GW", "MPLS-PE", "Internet"], "y": 5, "color": AMBER, "size": 20},
    }
    nodes_x, nodes_y, names, colors, sizes, hovers = [], [], [], [], [], []
    name_pos = {}
    for layer_name, info in layers.items():
        n = len(info["nodes"])
        for i, name in enumerate(info["nodes"]):
            x = (i - (n - 1) / 2) * 1.2
            name_pos[name] = (x, info["y"])
            nodes_x.append(x)
            nodes_y.append(info["y"])
            names.append(name)
            colors.append(info["color"])
            sizes.append(info["size"])
            hovers.append(f"<b>{name}</b><br>Layer: {layer_name}<br>Status: Active")

    edges = [
        ("Internet", "FW-01"), ("Internet", "FW-02"), ("MPLS-PE", "FW-01"),
        ("WAN-GW", "Core-SW1"), ("WAN-GW", "Core-SW2"),
        ("FW-01", "Core-SW1"), ("FW-02", "Core-SW2"), ("IPS-01", "Core-SW1"),
        ("Core-SW1", "Core-SW2"),
        ("Core-SW1", "Dist-A"), ("Core-SW1", "Dist-B"),
        ("Core-SW2", "Dist-C"), ("Core-SW2", "Dist-D"),
        ("Dist-A", "Acc-1"), ("Dist-A", "Acc-2"),
        ("Dist-B", "Acc-3"), ("Dist-B", "Acc-4"),
        ("Dist-C", "Acc-5"), ("Dist-C", "Acc-6"),
        ("Dist-D", "Acc-7"), ("Dist-D", "Acc-8"),
    ]
    edge_x, edge_y = [], []
    for s, t in edges:
        sx, sy = name_pos[s]
        tx, ty = name_pos[t]
        edge_x += [sx, tx, None]
        edge_y += [sy, ty, None]

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=edge_x, y=edge_y, mode="lines",
        line=dict(width=1.5, color="rgba(56,189,248,0.2)"), hoverinfo="none"))
    fig.add_trace(go.Scatter(x=nodes_x, y=nodes_y, mode="markers+text",
        text=names, textposition="top center", textfont=dict(size=9, color=TEXT2),
        marker=dict(size=sizes, color=colors, line=dict(width=2, color=DARK_BG),
                    symbol="diamond"),
        hovertext=hovers, hoverinfo="text"))

    for layer_name, info in layers.items():
        fig.add_annotation(x=-5, y=info["y"], text=f"<b>{layer_name}</b>",
            showarrow=False, font=dict(size=10, color=info["color"]), xanchor="right")

    fig.update_layout(**solution_layout("Network Infrastructure — L2/L3 Topology"),
        height=600, showlegend=False,
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-6, 6]),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[0.3, 5.7]))
    return fig
