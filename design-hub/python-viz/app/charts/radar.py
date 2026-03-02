import plotly.graph_objects as go
from app.charts.theme import NOC_COLORS, NOC_LAYOUT


def build_radar_figure():
    categories = ["NCA-ECC", "ISO 27001", "CBAHI", "HIMSS", "PDPL", "NDMO"]
    values = [96, 94, 92, 88, 91, 95]

    fig = go.Figure(go.Scatterpolar(
        r=values + [values[0]],
        theta=categories + [categories[0]],
        fill="toself",
        fillcolor="rgba(56,189,248,0.12)",
        line=dict(color=NOC_COLORS["cyan"], width=2),
        marker=dict(size=6, color=NOC_COLORS["cyan"], line=dict(width=2, color=NOC_COLORS["bg_primary"])),
        name="Compliance %",
    ))
    fig.update_layout(
        **NOC_LAYOUT,
        title=dict(text="Compliance Posture — Radar", font=dict(size=14)),
        height=380,
        polar=dict(
            bgcolor=NOC_COLORS["bg_secondary"],
            radialaxis=dict(
                visible=True, range=[0, 100],
                gridcolor=NOC_COLORS["grid_color"],
                tickfont=dict(size=9, color=NOC_COLORS["text_muted"]),
            ),
            angularaxis=dict(
                gridcolor=NOC_COLORS["grid_color"],
                tickfont=dict(size=10, color=NOC_COLORS["text_secondary"]),
            ),
        ),
    )
    return fig
