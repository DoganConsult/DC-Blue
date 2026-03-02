import plotly.graph_objects as go
from app.charts.theme import NOC_COLORS, NOC_LAYOUT

DATA = {
    "Network": {"color": NOC_COLORS["sky"], "children": {"Switches": 180, "Routers": 120, "APs": 220}},
    "Compute": {"color": NOC_COLORS["indigo"], "children": {"Physical": 64, "VMs": 280, "Containers": 40}},
    "Security": {"color": NOC_COLORS["red"], "children": {"Firewalls": 92, "WAFs": 18, "EDR Agents": 170}},
    "IoT": {"color": NOC_COLORS["teal"], "children": {"Healthcare": 480, "Industrial": 640, "Smart City": 300}},
    "Storage": {"color": NOC_COLORS["amber"], "children": {"SAN": 80, "NAS": 63, "Object": 100}},
}


def build_treemap_figure():
    ids, labels, parents, values, colors = [], [], [], [], []

    for cat, info in DATA.items():
        ids.append(cat)
        labels.append(cat)
        parents.append("")
        values.append(0)
        colors.append(info["color"])
        for child_name, child_val in info["children"].items():
            cid = f"{cat}/{child_name}"
            ids.append(cid)
            labels.append(child_name)
            parents.append(cat)
            values.append(child_val)
            colors.append(info["color"])

    fig = go.Figure(go.Treemap(
        ids=ids, labels=labels, parents=parents, values=values,
        branchvalues="total",
        marker=dict(colors=colors, line=dict(width=2, color=NOC_COLORS["bg_primary"])),
        textfont=dict(size=12, family="JetBrains Mono, monospace"),
        pathbar=dict(visible=False),
    ))
    fig.update_layout(
        **NOC_LAYOUT,
        title=dict(text="Asset Inventory — 2,847 Assets", font=dict(size=14)),
        height=420,
    )
    return fig
