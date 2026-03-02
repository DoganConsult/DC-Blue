import plotly.graph_objects as go
from app.charts.theme import NOC_COLORS, NOC_LAYOUT


def build_bandwidth_figure(value=24.7, max_val=40):
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=value,
        number=dict(suffix=" Gbps", font=dict(size=36, family="JetBrains Mono, monospace")),
        title=dict(text="WAN Throughput", font=dict(size=13, color=NOC_COLORS["text_secondary"])),
        gauge=dict(
            axis=dict(range=[0, max_val], tickwidth=1, tickcolor=NOC_COLORS["text_muted"]),
            bar=dict(color=NOC_COLORS["cyan"]),
            bgcolor=NOC_COLORS["bg_secondary"],
            borderwidth=0,
            steps=[
                dict(range=[0, max_val * 0.3], color="rgba(5,150,105,0.15)"),
                dict(range=[max_val * 0.3, max_val * 0.7], color="rgba(14,165,233,0.15)"),
                dict(range=[max_val * 0.7, max_val], color="rgba(248,113,113,0.15)"),
            ],
            threshold=dict(line=dict(color=NOC_COLORS["amber"], width=3), thickness=0.8, value=value),
        ),
    ))
    fig.update_layout(**NOC_LAYOUT, height=340)
    return fig
