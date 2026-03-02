import plotly.graph_objects as go
from app.charts.solutions._theme import *

def build_software_diagram():
    ids = ["Platform", "Frontend", "Backend", "Data", "DevOps",
           "React SPA", "Angular PWA", "Mobile App",
           "API Gateway", "Auth Service", "Core API", "Notification",
           "PostgreSQL", "Redis Cache", "S3 Storage", "Kafka Streams",
           "CI/CD", "Kubernetes", "Monitoring", "IaC"]
    parents = ["", "Platform", "Platform", "Platform", "Platform",
               "Frontend", "Frontend", "Frontend",
               "Backend", "Backend", "Backend", "Backend",
               "Data", "Data", "Data", "Data",
               "DevOps", "DevOps", "DevOps", "DevOps"]
    values = [0, 0, 0, 0, 0,
              35, 28, 22,
              18, 15, 45, 12,
              40, 20, 25, 30,
              22, 35, 18, 15]

    layer_colors = {
        "Platform": CYAN,
        "Frontend": SKY, "Backend": EMERALD, "Data": AMBER, "DevOps": PURPLE,
    }
    child_colors = {
        "React SPA": SKY, "Angular PWA": "#60a5fa", "Mobile App": "#93c5fd",
        "API Gateway": EMERALD, "Auth Service": "#6ee7b7", "Core API": TEAL, "Notification": "#a7f3d0",
        "PostgreSQL": AMBER, "Redis Cache": "#fcd34d", "S3 Storage": ORANGE, "Kafka Streams": "#fdba74",
        "CI/CD": PURPLE, "Kubernetes": "#d8b4fe", "Monitoring": INDIGO, "IaC": "#a5b4fc",
    }
    colors = []
    for i in ids:
        if i in layer_colors:
            colors.append(layer_colors[i])
        elif i in child_colors:
            colors.append(child_colors[i])
        else:
            colors.append(CYAN)

    fig = go.Figure(go.Treemap(
        ids=ids, labels=ids, parents=parents, values=values,
        branchvalues="total",
        marker=dict(colors=colors, line=dict(width=2, color=DARK_BG)),
        textfont=dict(size=12, color="#fff"),
        pathbar=dict(visible=True, textfont=dict(size=10, color=TEXT2)),
        hovertemplate="<b>%{label}</b><br>Complexity: %{value} story points<extra></extra>",
        maxdepth=3,
    ))
    fig.update_layout(**solution_layout("Software Architecture — Microservices Treemap"),
        height=600, treemapcolorway=PALETTE)
    return fig
