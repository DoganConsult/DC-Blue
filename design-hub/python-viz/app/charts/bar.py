import plotly.graph_objects as go
from app.charts.theme import NOC_COLORS, NOC_LAYOUT


def build_bar_figure():
    quarters = ["Q1", "Q2", "Q3", "Q4"]
    values = [72, 85, 78, 92]
    colors = [NOC_COLORS["cyan"], NOC_COLORS["cyan"], NOC_COLORS["cyan"], NOC_COLORS["emerald"]]

    fig = go.Figure(go.Bar(
        x=quarters, y=values,
        marker=dict(
            color=colors,
            line=dict(width=1, color=[c.replace(")", ",0.8)").replace("rgb", "rgba") if "rgb" in c else c for c in colors]),
            cornerradius=6,
        ),
        text=values, textposition="outside",
        textfont=dict(size=11, color=NOC_COLORS["text_secondary"]),
    ))
    fig.update_layout(
        **NOC_LAYOUT,
        title=dict(text="Project Delivery Performance — YTD", font=dict(size=14)),
        height=340,
        yaxis=dict(range=[0, 105], gridcolor=NOC_COLORS["grid_color"]),
        xaxis=dict(gridcolor="rgba(0,0,0,0)"),
    )
    return fig
