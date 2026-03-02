import plotly.graph_objects as go
from app.charts.solutions._theme import *

def build_erp_diagram():
    labels = ["External", "Core ERP", "Analytics",
              "Suppliers", "Banks", "Gov Portal",
              "Finance", "HR", "Supply Chain", "Manufacturing", "CRM",
              "Power BI", "Data Lake", "ML Models"]
    node_colors = [ORANGE, CYAN, PURPLE,
                   AMBER, EMERALD, TEAL,
                   SKY, INDIGO, EMERALD, AMBER, ROSE,
                   PURPLE, PURPLE, PURPLE]
    source = [0, 1, 2, 3, 3, 4, 5,  6, 7, 8, 9, 10,  6, 8, 9]
    target = [6, 6, 11, 8, 9, 6, 6,  11, 11, 12, 12, 12,  7, 10, 13]
    value =  [30, 25, 20, 18, 22, 15, 12,  28, 15, 20, 18, 14,  10, 12, 8]
    link_colors = [f"rgba(56,189,248,0.2)" for _ in source]

    fig = go.Figure(go.Sankey(
        arrangement="snap",
        node=dict(
            pad=20, thickness=22,
            line=dict(width=1, color=DARK_BG),
            label=labels, color=node_colors,
            hovertemplate="<b>%{label}</b><br>Throughput: %{value}<extra></extra>",
        ),
        link=dict(
            source=source, target=target, value=value,
            color=link_colors,
            hovertemplate="<b>%{source.label}</b> → <b>%{target.label}</b><br>Volume: %{value}<extra></extra>",
        ),
    ))
    fig.update_layout(**solution_layout("ERP Implementation — Module Data Flow (Sankey)"),
        height=550)
    return fig
