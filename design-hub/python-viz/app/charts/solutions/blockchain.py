import plotly.graph_objects as go
import numpy as np
from app.charts.solutions._theme import *

def build_blockchain_diagram():
    rng = np.random.default_rng(42)
    n_nodes = 12
    angles = np.linspace(0, 2 * np.pi, n_nodes, endpoint=False)
    node_x = 3 * np.cos(angles)
    node_y = 3 * np.sin(angles)
    node_names = [f"Validator {i+1}" for i in range(n_nodes)]
    node_stakes = rng.integers(100, 1000, n_nodes)

    fig = go.Figure()
    for i in range(n_nodes):
        for j in range(i + 1, n_nodes):
            if rng.random() > 0.3:
                fig.add_trace(go.Scatter(x=[node_x[i], node_x[j]], y=[node_y[i], node_y[j]],
                    mode="lines", line=dict(width=0.5, color="rgba(56,189,248,0.1)"),
                    hoverinfo="none", showlegend=False))

    fig.add_trace(go.Scatter(x=node_x.tolist(), y=node_y.tolist(), mode="markers+text",
        text=node_names, textposition="top center", textfont=dict(size=9, color=TEXT2),
        marker=dict(size=(node_stakes / 40 + 8).tolist(), color=CYAN,
                    line=dict(width=2, color=DARK_BG), symbol="hexagon2"),
        hovertext=[f"<b>{node_names[i]}</b><br>Stake: {node_stakes[i]} ETH<br>"
                   f"Uptime: {rng.integers(98, 100)}%<br>Blocks: {rng.integers(1000, 5000)}"
                   for i in range(n_nodes)],
        hoverinfo="text", name="Validators"))

    n_blocks = 8
    block_x = np.linspace(-3.5, 3.5, n_blocks)
    block_y = np.zeros(n_blocks)
    block_hashes = [f"0x{rng.integers(0, 2**32):08x}" for _ in range(n_blocks)]

    for i in range(n_blocks - 1):
        fig.add_trace(go.Scatter(x=[block_x[i] + 0.3, block_x[i + 1] - 0.3], y=[-1.8, -1.8],
            mode="lines", line=dict(width=2, color=EMERALD), showlegend=False, hoverinfo="none"))
        fig.add_annotation(x=(block_x[i] + block_x[i+1]) / 2, y=-1.6, text="→",
            showarrow=False, font=dict(size=14, color=EMERALD))

    fig.add_trace(go.Scatter(x=block_x.tolist(), y=[-1.8] * n_blocks, mode="markers+text",
        text=[f"Block {i}" for i in range(n_blocks)],
        textposition="bottom center", textfont=dict(size=8, color=TEXT2),
        marker=dict(size=20, color=AMBER, symbol="square",
                    line=dict(width=2, color=DARK_BG)),
        hovertext=[f"<b>Block {i}</b><br>Hash: {block_hashes[i]}<br>"
                   f"Txns: {rng.integers(50, 200)}<br>Gas: {rng.integers(10, 30)}M"
                   for i in range(n_blocks)],
        hoverinfo="text", name="Blocks"))

    fig.add_annotation(x=0, y=3.8, text="<b>Consensus Ring (PoS)</b>",
        showarrow=False, font=dict(size=12, color=CYAN))
    fig.add_annotation(x=0, y=-2.8, text="<b>Chain Progression</b>",
        showarrow=False, font=dict(size=12, color=AMBER))

    fig.update_layout(**solution_layout("Blockchain — Consensus Network & Chain Visualization"),
        height=600, showlegend=False,
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-5, 5]),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-3.5, 4.5]))
    return fig
