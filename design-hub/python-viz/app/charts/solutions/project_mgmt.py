import plotly.graph_objects as go
from app.charts.solutions._theme import *

def build_project_mgmt_diagram():
    tasks = [
        {"name": "Discovery & Planning", "start": 0, "end": 3, "phase": "Plan", "progress": 100},
        {"name": "Requirements Analysis", "start": 1, "end": 4, "phase": "Plan", "progress": 100},
        {"name": "Architecture Design", "start": 3, "end": 6, "phase": "Design", "progress": 100},
        {"name": "Security Review", "start": 5, "end": 7, "phase": "Design", "progress": 85},
        {"name": "Sprint 1 — Core", "start": 6, "end": 9, "phase": "Build", "progress": 90},
        {"name": "Sprint 2 — Integration", "start": 9, "end": 12, "phase": "Build", "progress": 65},
        {"name": "Sprint 3 — Features", "start": 12, "end": 15, "phase": "Build", "progress": 30},
        {"name": "UAT Testing", "start": 14, "end": 17, "phase": "Test", "progress": 10},
        {"name": "Performance Testing", "start": 16, "end": 18, "phase": "Test", "progress": 0},
        {"name": "Pilot Deployment", "start": 18, "end": 20, "phase": "Deploy", "progress": 0},
        {"name": "Go-Live & Handover", "start": 20, "end": 22, "phase": "Deploy", "progress": 0},
        {"name": "Hypercare Support", "start": 22, "end": 26, "phase": "Support", "progress": 0},
    ]
    phase_colors = {
        "Plan": CYAN, "Design": INDIGO, "Build": EMERALD,
        "Test": AMBER, "Deploy": PURPLE, "Support": TEAL,
    }

    fig = go.Figure()
    for i, task in enumerate(tasks):
        color = phase_colors[task["phase"]]
        fig.add_trace(go.Bar(
            x=[task["end"] - task["start"]], y=[task["name"]],
            base=[task["start"]], orientation="h",
            marker=dict(color=color, opacity=0.7, line=dict(width=1, color=color)),
            hovertemplate=f'<b>{task["name"]}</b><br>Phase: {task["phase"]}<br>'
                          f'Week {task["start"]}–{task["end"]}<br>'
                          f'Progress: {task["progress"]}%<extra></extra>',
            showlegend=False))

        if task["progress"] > 0:
            filled = task["start"] + (task["end"] - task["start"]) * task["progress"] / 100
            fig.add_trace(go.Bar(
                x=[filled - task["start"]], y=[task["name"]],
                base=[task["start"]], orientation="h",
                marker=dict(color=color, opacity=1.0, line=dict(width=0)),
                hoverinfo="none", showlegend=False))

    for phase, color in phase_colors.items():
        fig.add_trace(go.Bar(x=[None], y=[None], marker=dict(color=color), name=phase))

    fig.add_vline(x=11, line=dict(color=RED, width=2, dash="dash"))
    fig.add_annotation(x=11, y=1.02, text="<b>Today (Week 11)</b>", showarrow=False,
        font=dict(size=10, color=RED), xref="x", yref="paper")

    fig.update_layout(**solution_layout("Project Management — Gantt Timeline"),
        height=600, barmode="overlay", showlegend=True,
        legend=dict(x=0.6, y=-0.08, orientation="h", font=dict(size=10, color=TEXT2), bgcolor="rgba(0,0,0,0)"),
        xaxis=dict(title="Week", gridcolor=GRID, dtick=2),
        yaxis=dict(autorange="reversed", gridcolor="rgba(0,0,0,0)"))
    return fig
