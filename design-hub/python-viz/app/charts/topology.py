import plotly.graph_objects as go
import math
from app.charts.theme import NOC_COLORS, NOC_LAYOUT

NODES = [
    {"name": "Core-SW1", "cat": "Core", "size": 26},
    {"name": "Core-SW2", "cat": "Core", "size": 26},
    {"name": "Dist-A", "cat": "Distribution", "size": 18},
    {"name": "Dist-B", "cat": "Distribution", "size": 18},
    {"name": "Dist-C", "cat": "Distribution", "size": 18},
    {"name": "FW-01", "cat": "Security", "size": 20},
    {"name": "FW-02", "cat": "Security", "size": 20},
    {"name": "WAN-GW", "cat": "WAN", "size": 16},
    {"name": "MPLS-PE", "cat": "WAN", "size": 14},
    {"name": "Acc-F1", "cat": "Access", "size": 10},
    {"name": "Acc-F2", "cat": "Access", "size": 10},
    {"name": "Acc-F3", "cat": "Access", "size": 10},
    {"name": "Acc-F4", "cat": "Access", "size": 10},
    {"name": "Acc-F5", "cat": "Access", "size": 10},
    {"name": "Wi-Fi", "cat": "Access", "size": 12},
]

EDGES = [
    ("Core-SW1", "Core-SW2"), ("Core-SW1", "Dist-A"), ("Core-SW1", "Dist-B"),
    ("Core-SW2", "Dist-B"), ("Core-SW2", "Dist-C"),
    ("Core-SW1", "FW-01"), ("Core-SW2", "FW-02"),
    ("FW-01", "WAN-GW"), ("FW-02", "WAN-GW"), ("WAN-GW", "MPLS-PE"),
    ("Dist-A", "Acc-F1"), ("Dist-A", "Acc-F2"),
    ("Dist-B", "Acc-F3"), ("Dist-B", "Wi-Fi"),
    ("Dist-C", "Acc-F4"), ("Dist-C", "Acc-F5"),
]

CAT_COLORS = {
    "Core": NOC_COLORS["cyan"],
    "Distribution": NOC_COLORS["indigo"],
    "Access": NOC_COLORS["emerald"],
    "Security": NOC_COLORS["red"],
    "WAN": NOC_COLORS["amber"],
}


def _simple_layout(nodes):
    n = len(nodes)
    positions = {}
    for i, node in enumerate(nodes):
        angle = 2 * math.pi * i / n
        positions[node["name"]] = (2 * math.cos(angle), 2 * math.sin(angle))
    return positions


def build_topology_figure():
    pos = _simple_layout(NODES)
    name_to_idx = {n["name"]: i for i, n in enumerate(NODES)}

    edge_x, edge_y = [], []
    for src, tgt in EDGES:
        x0, y0 = pos[src]
        x1, y1 = pos[tgt]
        edge_x += [x0, x1, None]
        edge_y += [y0, y1, None]

    edge_trace = go.Scatter(
        x=edge_x, y=edge_y, mode="lines",
        line=dict(width=1.5, color="rgba(56,189,248,0.25)"),
        hoverinfo="none",
    )

    node_x = [pos[n["name"]][0] for n in NODES]
    node_y = [pos[n["name"]][1] for n in NODES]
    node_colors = [CAT_COLORS.get(n["cat"], NOC_COLORS["cyan"]) for n in NODES]
    node_sizes = [n["size"] for n in NODES]
    node_labels = [n["name"] for n in NODES]

    node_trace = go.Scatter(
        x=node_x, y=node_y, mode="markers+text",
        text=node_labels, textposition="top center",
        textfont=dict(size=9, color=NOC_COLORS["text_secondary"]),
        marker=dict(size=node_sizes, color=node_colors, line=dict(width=1.5, color=NOC_COLORS["bg_primary"])),
        hovertext=[f"{n['name']} ({n['cat']})" for n in NODES],
        hoverinfo="text",
    )

    fig = go.Figure(data=[edge_trace, node_trace])
    fig.update_layout(
        **NOC_LAYOUT,
        title=dict(text="Network Topology — Force Graph", font=dict(size=14)),
        showlegend=False,
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
        hovermode="closest",
    )
    return fig
