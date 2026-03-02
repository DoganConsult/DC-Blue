import plotly.graph_objects as go
from app.charts.theme import NOC_COLORS, NOC_LAYOUT

NODES = ["Internet", "MPLS WAN", "Firewall", "Core Switch", "Distribution", "Servers", "Endpoints", "IoT Devices", "Cloud Apps"]
NODE_COLORS = [
    NOC_COLORS["amber"], NOC_COLORS["orange"], NOC_COLORS["red"],
    NOC_COLORS["cyan"], NOC_COLORS["indigo"], NOC_COLORS["emerald"],
    NOC_COLORS["teal"], NOC_COLORS["purple"], NOC_COLORS["cyan"],
]


def _hex_to_rgba(hex_color, alpha=0.4):
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return f"rgba({r},{g},{b},{alpha})"


def build_sankey_figure():
    link_base_colors = [
        NOC_COLORS["amber"], NOC_COLORS["orange"], NOC_COLORS["red"],
        NOC_COLORS["cyan"], NOC_COLORS["cyan"], NOC_COLORS["indigo"],
        NOC_COLORS["indigo"], NOC_COLORS["indigo"],
    ]
    fig = go.Figure(go.Sankey(
        node=dict(
            pad=16, thickness=20, line=dict(width=0),
            label=NODES,
            color=NODE_COLORS,
        ),
        link=dict(
            source=[0, 1, 2, 3, 3, 4, 4, 4],
            target=[2, 2, 3, 4, 5, 6, 7, 8],
            value=[40, 25, 60, 45, 15, 20, 12, 13],
            color=[_hex_to_rgba(c) for c in link_base_colors],
        ),
    ))
    fig.update_layout(
        **NOC_LAYOUT,
        title=dict(text="Data Flow — Sankey Diagram", font=dict(size=14)),
        height=420,
    )
    return fig
