import plotly.graph_objects as go
from app.charts.solutions._theme import *

def build_compliance_diagram():
    frameworks = ["NCA-ECC", "ISO 27001", "PDPL", "SAMA", "NDMO", "HIMSS", "CBAHI", "ISO 22301"]
    current = [96, 94, 91, 88, 95, 82, 87, 79]
    target = [100, 100, 100, 95, 100, 90, 95, 90]
    gap = [t - c for c, t in zip(current, target)]

    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=target + [target[0]], theta=frameworks + [frameworks[0]],
        fill="toself", fillcolor="rgba(52,211,153,0.08)",
        line=dict(color=EMERALD, width=1.5, dash="dash"),
        name="Target", hovertemplate="%{theta}: %{r}%<extra>Target</extra>"))
    fig.add_trace(go.Scatterpolar(
        r=current + [current[0]], theta=frameworks + [frameworks[0]],
        fill="toself", fillcolor="rgba(56,189,248,0.15)",
        line=dict(color=CYAN, width=2.5),
        marker=dict(size=8, color=CYAN, line=dict(width=2, color=DARK_BG)),
        name="Current", hovertemplate="%{theta}: %{r}%<extra>Current</extra>"))

    for i, fw in enumerate(frameworks):
        if gap[i] > 5:
            fig.add_annotation(
                x=0.5, y=0.5,
                text=f"⚠ {fw}: {gap[i]}% gap",
                showarrow=False, font=dict(size=9, color=AMBER),
                xref="paper", yref="paper",
                xanchor="center", yanchor="bottom",
                yshift=-(i * 18) + 50)

    fig.update_layout(**solution_layout("Regulatory Compliance — Multi-Framework Posture"),
        height=600, showlegend=True,
        legend=dict(x=0.8, y=1.0, font=dict(size=11, color=TEXT2), bgcolor="rgba(0,0,0,0)"),
        polar=dict(bgcolor=PLOT_BG,
            radialaxis=dict(range=[50, 105], gridcolor=GRID, tickfont=dict(size=9, color=MUTED), ticksuffix="%"),
            angularaxis=dict(gridcolor=GRID, tickfont=dict(size=11, color=TEXT))))
    return fig
