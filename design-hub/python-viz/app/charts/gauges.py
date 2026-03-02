import plotly.graph_objects as go
from plotly.subplots import make_subplots
from app.charts.theme import NOC_COLORS, NOC_LAYOUT


def build_gauge_figure(title, value, max_val=100, suffix="%"):
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=value,
        number=dict(suffix=suffix, font=dict(size=32, family="JetBrains Mono, monospace")),
        title=dict(text=title, font=dict(size=13, color=NOC_COLORS["text_secondary"])),
        gauge=dict(
            axis=dict(range=[0, max_val], tickwidth=1, tickcolor=NOC_COLORS["text_muted"]),
            bar=dict(color=NOC_COLORS["cyan"]),
            bgcolor=NOC_COLORS["bg_secondary"],
            borderwidth=0,
            steps=[
                dict(range=[0, max_val * 0.3], color="rgba(5,150,105,0.2)"),
                dict(range=[max_val * 0.3, max_val * 0.7], color="rgba(14,165,233,0.2)"),
                dict(range=[max_val * 0.7, max_val], color="rgba(248,113,113,0.2)"),
            ],
            threshold=dict(line=dict(color=NOC_COLORS["red"], width=3), thickness=0.8, value=value),
        ),
    ))
    fig.update_layout(**NOC_LAYOUT, height=300)
    return fig


def build_multi_gauge_figure(gauges):
    fig = make_subplots(
        rows=2, cols=2,
        specs=[[{"type": "indicator"}] * 2] * 2,
        vertical_spacing=0.15, horizontal_spacing=0.1,
    )
    colors = [NOC_COLORS["cyan"], NOC_COLORS["purple"], NOC_COLORS["emerald"], NOC_COLORS["red"]]
    positions = [(1, 1), (1, 2), (2, 1), (2, 2)]

    for i, g in enumerate(gauges[:4]):
        r, c = positions[i]
        fig.add_trace(go.Indicator(
            mode="gauge+number",
            value=g["value"],
            number=dict(suffix="%", font=dict(size=24, family="JetBrains Mono, monospace")),
            title=dict(text=g["title"], font=dict(size=11, color=NOC_COLORS["text_secondary"])),
            gauge=dict(
                axis=dict(range=[0, 100], tickwidth=1, tickcolor=NOC_COLORS["text_muted"], dtick=25),
                bar=dict(color=colors[i]),
                bgcolor=NOC_COLORS["bg_secondary"],
                borderwidth=0,
                steps=[dict(range=[0, 100], color="rgba(148,163,184,0.04)")],
            ),
        ), row=r, col=c)

    fig.update_layout(**NOC_LAYOUT, height=500, title=dict(text="System Health Gauges", font=dict(size=14)))
    return fig
