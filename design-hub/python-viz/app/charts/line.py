import plotly.graph_objects as go
from app.charts.theme import NOC_COLORS, NOC_LAYOUT

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def build_line_figure():
    threats = [32, 35, 38, 42, 40, 45, 43, 48, 46, 50, 47, 52]
    mttr = [12, 11, 9.5, 8, 7.5, 6, 5.8, 5.2, 4.8, 4.5, 4.2, 3.8]

    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=MONTHS, y=threats, name="Threats Blocked (K)",
        mode="lines+markers",
        line=dict(color=NOC_COLORS["red"], width=2, shape="spline"),
        marker=dict(size=6, color=NOC_COLORS["red"], line=dict(width=2, color=NOC_COLORS["bg_primary"])),
        fill="tozeroy", fillcolor="rgba(248,113,113,0.06)",
    ))
    fig.add_trace(go.Scatter(
        x=MONTHS, y=mttr, name="MTTR (min)",
        mode="lines+markers",
        line=dict(color=NOC_COLORS["emerald"], width=2, shape="spline"),
        marker=dict(size=6, color=NOC_COLORS["emerald"], line=dict(width=2, color=NOC_COLORS["bg_primary"])),
        fill="tozeroy", fillcolor="rgba(52,211,153,0.06)",
    ))

    fig.update_layout(
        **NOC_LAYOUT,
        title=dict(text="Threat Intelligence & MTTR Trend", font=dict(size=14)),
        height=360,
        legend=dict(font=dict(size=10), bgcolor="rgba(0,0,0,0)"),
        xaxis=dict(gridcolor=NOC_COLORS["grid_color"]),
        yaxis=dict(gridcolor=NOC_COLORS["grid_color"]),
    )
    return fig
