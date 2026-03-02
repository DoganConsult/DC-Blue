import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
from app.charts.solutions._theme import *

def build_ai_ml_diagram():
    fig = make_subplots(rows=1, cols=2,
        specs=[[{"type": "surface"}, {"type": "scatter"}]],
        subplot_titles=["Loss Landscape — Model Optimization", "Training Metrics Over Epochs"],
        horizontal_spacing=0.08)

    rng = np.random.default_rng(42)
    x = np.linspace(-3, 3, 60)
    y = np.linspace(-3, 3, 60)
    X, Y = np.meshgrid(x, y)
    Z = (np.sin(np.sqrt(X**2 + Y**2)) * 2 + 0.3 * (X**2 + Y**2)
         + np.exp(-((X - 1)**2 + (Y - 1)**2) / 0.8) * -2)

    fig.add_trace(go.Surface(
        x=X, y=Y, z=Z,
        colorscale=[[0, "#020617"], [0.2, "#164e63"], [0.4, "#0ea5e9"],
                     [0.6, "#fbbf24"], [0.8, "#f87171"], [1, "#fef2f2"]],
        opacity=0.92, showscale=False,
        contours=dict(z=dict(show=True, usecolormap=True, project_z=True, highlightcolor="rgba(255,255,255,0.1)")),
        hovertemplate="w1: %{x:.2f}<br>w2: %{y:.2f}<br>Loss: %{z:.3f}<extra></extra>",
    ), row=1, col=1)

    path_x = np.array([-2.5, -2.0, -1.4, -0.8, -0.3, 0.2, 0.6, 0.9, 1.0, 1.0])
    path_y = np.array([2.5, 1.8, 1.2, 0.7, 0.3, 0.0, 0.2, 0.5, 0.8, 1.0])
    path_z = []
    for px, py in zip(path_x, path_y):
        idx_x = np.argmin(np.abs(x - px))
        idx_y = np.argmin(np.abs(y - py))
        path_z.append(Z[idx_y, idx_x] + 0.1)
    fig.add_trace(go.Scatter3d(
        x=path_x, y=path_y, z=path_z, mode="lines+markers",
        line=dict(color=AMBER, width=5),
        marker=dict(size=4, color=AMBER, symbol="diamond"),
        name="SGD Path", hovertemplate="Step %{pointNumber}<br>Loss: %{z:.3f}<extra></extra>",
    ), row=1, col=1)

    epochs = list(range(1, 51))
    train_loss = [2.8 * np.exp(-0.06 * e) + 0.15 + rng.normal(0, 0.02) for e in epochs]
    val_loss = [2.9 * np.exp(-0.055 * e) + 0.22 + rng.normal(0, 0.03) for e in epochs]
    accuracy = [min(97, 55 + 42 * (1 - np.exp(-0.08 * e)) + rng.normal(0, 0.5)) for e in epochs]

    fig.add_trace(go.Scatter(x=epochs, y=train_loss, mode="lines", name="Train Loss",
        line=dict(color=CYAN, width=2), hovertemplate="Epoch %{x}<br>Loss: %{y:.3f}<extra></extra>"), row=1, col=2)
    fig.add_trace(go.Scatter(x=epochs, y=val_loss, mode="lines", name="Val Loss",
        line=dict(color=RED, width=2, dash="dot"), hovertemplate="Epoch %{x}<br>Loss: %{y:.3f}<extra></extra>"), row=1, col=2)
    fig.add_trace(go.Scatter(x=epochs, y=accuracy, mode="lines", name="Accuracy %",
        line=dict(color=EMERALD, width=2), yaxis="y2",
        hovertemplate="Epoch %{x}<br>Accuracy: %{y:.1f}%<extra></extra>"), row=1, col=2)

    fig.update_layout(**solution_layout("AI/ML — Loss Landscape & Training Metrics"),
        height=550, showlegend=True,
        legend=dict(x=0.55, y=-0.08, orientation="h", font=dict(size=10, color=TEXT2), bgcolor="rgba(0,0,0,0)"),
        scene=dict(bgcolor=PLOT_BG,
            xaxis=dict(title="Weight 1", gridcolor=GRID, showbackground=False),
            yaxis=dict(title="Weight 2", gridcolor=GRID, showbackground=False),
            zaxis=dict(title="Loss", gridcolor=GRID, showbackground=False),
            camera=dict(eye=dict(x=1.6, y=-1.6, z=1.0))),
        xaxis2=dict(title="Epoch", gridcolor=GRID),
        yaxis2=dict(title="Loss", gridcolor=GRID))

    for ann in fig.layout.annotations:
        ann.update(font=dict(size=13, color=TEXT2))
    return fig
