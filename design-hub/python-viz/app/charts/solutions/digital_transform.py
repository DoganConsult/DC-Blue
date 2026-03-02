import plotly.graph_objects as go
from app.charts.solutions._theme import *

def build_digital_transform_diagram():
    dimensions = ["Process\nAutomation", "Data\nDriven", "Customer\nExperience",
                  "Cloud\nAdoption", "Digital\nWorkforce", "Innovation\nCulture"]
    phases = ["As-Is", "Year 1", "Year 2", "Year 3 (Target)"]
    scores = [
        [25, 30, 20, 15, 10, 20],
        [50, 55, 45, 50, 35, 40],
        [70, 72, 68, 75, 60, 62],
        [90, 88, 85, 92, 80, 85],
    ]
    colors = [MUTED, ORANGE, CYAN, EMERALD]
    fills = ["rgba(100,116,139,0.05)", "rgba(251,146,60,0.08)",
             "rgba(56,189,248,0.1)", "rgba(52,211,153,0.12)"]

    fig = go.Figure()
    for i, phase in enumerate(phases):
        fig.add_trace(go.Scatterpolar(
            r=scores[i] + [scores[i][0]],
            theta=dimensions + [dimensions[0]],
            fill="toself", fillcolor=fills[i],
            line=dict(color=colors[i], width=2 if i < 3 else 3),
            marker=dict(size=6 if i == 3 else 4, color=colors[i]),
            name=phase,
            hovertemplate=f"<b>{phase}</b><br>%{{theta}}: %{{r}}%<extra></extra>"))

    categories_summary = [
        {"name": "Process Automation", "from": 25, "to": 90, "delta": "+260%", "color": CYAN},
        {"name": "Cloud Adoption", "from": 15, "to": 92, "delta": "+513%", "color": EMERALD},
        {"name": "Innovation Culture", "from": 20, "to": 85, "delta": "+325%", "color": AMBER},
    ]
    for i, cat in enumerate(categories_summary):
        fig.add_annotation(x=1.0, y=0.95 - i * 0.08,
            text=f"<b>{cat['name']}</b>: {cat['from']}% → {cat['to']}% ({cat['delta']})",
            showarrow=False, font=dict(size=10, color=cat["color"]),
            xref="paper", yref="paper", xanchor="right")

    fig.update_layout(**solution_layout("Digital Transformation — 3-Year Maturity Roadmap"),
        height=600, showlegend=True,
        legend=dict(x=0.01, y=-0.08, orientation="h", font=dict(size=11, color=TEXT2), bgcolor="rgba(0,0,0,0)"),
        polar=dict(bgcolor=PLOT_BG,
            radialaxis=dict(range=[0, 100], gridcolor=GRID, ticksuffix="%",
                            tickfont=dict(size=9, color=MUTED)),
            angularaxis=dict(gridcolor=GRID, tickfont=dict(size=10, color=TEXT))))
    return fig
