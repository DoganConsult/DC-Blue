import plotly.graph_objects as go
from app.charts.solutions._theme import *

def build_cloud_diagram():
    labels = [
        "Cloud Estate",
        "AWS", "Azure", "GCP",
        "Compute", "Storage", "Network", "Security",
        "EC2/EKS", "S3/EFS", "VPC", "IAM/WAF",
        "AKS/VMs", "Blob/Files", "VNet", "Defender",
        "GKE", "GCS", "VPC-GCP", "Chronicle",
    ]
    parents = [
        "",
        "Cloud Estate", "Cloud Estate", "Cloud Estate",
        "AWS", "AWS", "AWS", "AWS",
        "Compute", "Storage", "Network", "Security",
        "Azure", "Azure", "Azure", "Azure",
        "GCP", "GCP", "GCP", "GCP",
    ]
    values = [
        0,
        0, 0, 0,
        0, 0, 0, 0,
        340, 180, 120, 90,
        280, 150, 100, 85,
        160, 90, 60, 50,
    ]
    colors_map = {
        "Cloud Estate": CYAN,
        "AWS": "#ff9900", "Azure": "#0078d4", "GCP": "#4285f4",
        "Compute": CYAN, "Storage": AMBER, "Network": INDIGO, "Security": RED,
    }
    marker_colors = []
    for lbl in labels:
        if lbl in colors_map:
            marker_colors.append(colors_map[lbl])
        else:
            for parent_key, col in [("EC2", "#ff9900"), ("S3", "#ff9900"), ("VPC", "#ff9900"), ("IAM", "#ff9900"),
                                     ("AKS", "#0078d4"), ("Blob", "#0078d4"), ("VNet", "#0078d4"), ("Defender", "#0078d4"),
                                     ("GKE", "#4285f4"), ("GCS", "#4285f4"), ("VPC-GCP", "#4285f4"), ("Chronicle", "#4285f4")]:
                if lbl.startswith(parent_key):
                    marker_colors.append(col)
                    break
            else:
                marker_colors.append(CYAN)

    fig = go.Figure(go.Sunburst(
        labels=labels, parents=parents, values=values,
        branchvalues="total",
        marker=dict(colors=marker_colors, line=dict(width=2, color=DARK_BG)),
        textfont=dict(size=11, color="#fff"),
        hovertemplate="<b>%{label}</b><br>Cost: $%{value}K/mo<extra></extra>",
        insidetextorientation="radial",
        maxdepth=3,
    ))
    fig.update_layout(**solution_layout("Multi-Cloud Architecture — Sunburst"),
        height=600)
    return fig
