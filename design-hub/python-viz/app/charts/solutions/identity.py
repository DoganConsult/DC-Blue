import plotly.graph_objects as go
from app.charts.solutions._theme import *

def build_identity_diagram():
    nodes = [
        "User", "Mobile App", "Web Portal", "VPN Client",
        "Identity Provider", "MFA Engine", "SSO Gateway",
        "Azure AD", "Okta", "CyberArk PAM",
        "ERP Access", "Cloud Console", "Network Access",
        "Database", "Admin Panel", "API Gateway",
    ]
    node_colors = (
        [CYAN] * 4 +
        [INDIGO] * 3 +
        [PURPLE] * 3 +
        [EMERALD] * 3 +
        [AMBER] * 3
    )

    links = {
        "source": [0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8, 8, 9, 9],
        "target": [1, 2, 3, 4, 4, 4, 4, 5, 6, 7, 6, 9, 7, 8, 9, 10, 11, 12, 15, 13, 14],
        "value":  [30, 40, 15, 85, 30, 40, 15, 50, 35, 40, 50, 20, 30, 25, 20, 20, 20, 20, 15, 10, 10],
    }
    link_colors = [f"rgba(56,189,248,0.2)"] * len(links["source"])

    fig = go.Figure(go.Sankey(
        arrangement="snap",
        node=dict(
            pad=18, thickness=22,
            label=nodes,
            color=node_colors,
            line=dict(width=1, color=DARK_BG),
            hovertemplate="<b>%{label}</b><br>Flow: %{value}<extra></extra>",
        ),
        link=dict(
            source=links["source"], target=links["target"], value=links["value"],
            color=link_colors,
            hovertemplate="<b>%{source.label} → %{target.label}</b><br>Sessions: %{value}<extra></extra>",
        ),
    ))

    fig.add_annotation(x=0.02, y=1.08, text="<b>Entry Points</b>", showarrow=False,
        font=dict(size=10, color=CYAN), xref="paper", yref="paper")
    fig.add_annotation(x=0.3, y=1.08, text="<b>Auth Layer</b>", showarrow=False,
        font=dict(size=10, color=INDIGO), xref="paper", yref="paper")
    fig.add_annotation(x=0.55, y=1.08, text="<b>Providers</b>", showarrow=False,
        font=dict(size=10, color=PURPLE), xref="paper", yref="paper")
    fig.add_annotation(x=0.85, y=1.08, text="<b>Resources</b>", showarrow=False,
        font=dict(size=10, color=EMERALD), xref="paper", yref="paper")

    fig.update_layout(**solution_layout("Identity Management — Authentication Flow"),
        height=600)
    return fig
