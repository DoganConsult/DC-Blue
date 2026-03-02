import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
from app.charts.solutions._theme import *

def build_training_diagram():
    tracks = {
        "Network": {
            "color": CYAN,
            "certs": [
                {"name": "CCNA", "level": 1, "duration": "8 weeks", "pass_rate": 92},
                {"name": "CCNP Enterprise", "level": 2, "duration": "12 weeks", "pass_rate": 85},
                {"name": "CCIE Enterprise", "level": 3, "duration": "24 weeks", "pass_rate": 68},
                {"name": "SD-WAN Specialist", "level": 2, "duration": "6 weeks", "pass_rate": 88},
            ],
        },
        "Security": {
            "color": RED,
            "certs": [
                {"name": "CompTIA Security+", "level": 1, "duration": "6 weeks", "pass_rate": 94},
                {"name": "CEH", "level": 2, "duration": "10 weeks", "pass_rate": 82},
                {"name": "CISSP", "level": 3, "duration": "16 weeks", "pass_rate": 72},
                {"name": "OSCP", "level": 3, "duration": "20 weeks", "pass_rate": 58},
            ],
        },
        "Cloud": {
            "color": EMERALD,
            "certs": [
                {"name": "AWS CCP", "level": 1, "duration": "4 weeks", "pass_rate": 96},
                {"name": "AWS SAA", "level": 2, "duration": "8 weeks", "pass_rate": 88},
                {"name": "AWS SAP", "level": 3, "duration": "14 weeks", "pass_rate": 65},
                {"name": "Azure Solutions Architect", "level": 3, "duration": "14 weeks", "pass_rate": 70},
            ],
        },
        "DevOps": {
            "color": AMBER,
            "certs": [
                {"name": "Docker Certified", "level": 1, "duration": "6 weeks", "pass_rate": 90},
                {"name": "CKA", "level": 2, "duration": "10 weeks", "pass_rate": 78},
                {"name": "Terraform Associate", "level": 2, "duration": "6 weeks", "pass_rate": 85},
                {"name": "GitOps Specialist", "level": 3, "duration": "12 weeks", "pass_rate": 75},
            ],
        },
    }

    level_labels = {1: "Foundation", 2: "Professional", 3: "Expert"}
    fig = go.Figure()
    track_names = list(tracks.keys())

    for i, (track_name, track) in enumerate(tracks.items()):
        for cert in track["certs"]:
            fig.add_trace(go.Scatter(
                x=[cert["level"]], y=[i],
                mode="markers",
                marker=dict(
                    size=cert["pass_rate"] / 4 + 8,
                    color=track["color"], opacity=0.85,
                    line=dict(width=2, color=DARK_BG),
                    symbol="diamond" if cert["level"] == 3 else "circle",
                ),
                hovertemplate=(
                    f'<b>{cert["name"]}</b><br>'
                    f'Track: {track_name}<br>'
                    f'Level: {level_labels[cert["level"]]}<br>'
                    f'Duration: {cert["duration"]}<br>'
                    f'Pass Rate: {cert["pass_rate"]}%<extra></extra>'
                ),
                showlegend=False,
            ))
            fig.add_annotation(
                x=cert["level"], y=i,
                text=cert["name"], showarrow=False,
                font=dict(size=8, color=TEXT2),
                yshift=20 if cert["level"] != 2 else -20,
            )

    for i in range(len(track_names)):
        fig.add_trace(go.Scatter(
            x=[0.8, 3.2], y=[i, i], mode="lines",
            line=dict(color="rgba(148,163,184,0.1)", width=1),
            hoverinfo="none", showlegend=False))

    for level in [1, 2, 3]:
        fig.add_trace(go.Scatter(
            x=[level, level], y=[-0.5, len(track_names) - 0.5], mode="lines",
            line=dict(color="rgba(148,163,184,0.06)", width=1, dash="dot"),
            hoverinfo="none", showlegend=False))

    for track_name, track in tracks.items():
        fig.add_trace(go.Scatter(x=[None], y=[None], mode="markers",
            marker=dict(size=10, color=track["color"]), name=track_name))

    fig.update_layout(**solution_layout("Technical Training — Certification Paths"),
        height=550, showlegend=True,
        legend=dict(x=0.7, y=-0.08, orientation="h", font=dict(size=10, color=TEXT2), bgcolor="rgba(0,0,0,0)"),
        xaxis=dict(
            tickvals=[1, 2, 3],
            ticktext=["Foundation", "Professional", "Expert"],
            gridcolor="rgba(0,0,0,0)", range=[0.5, 3.5],
        ),
        yaxis=dict(
            tickvals=list(range(len(track_names))),
            ticktext=track_names,
            gridcolor="rgba(0,0,0,0)",
        ))
    return fig
