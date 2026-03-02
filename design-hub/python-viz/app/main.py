import os
from flask import Flask, jsonify, Response
from flask_cors import CORS
import plotly.io as pio
from app.charts.topology import build_topology_figure
from app.charts.gauges import build_gauge_figure, build_multi_gauge_figure
from app.charts.sankey import build_sankey_figure
from app.charts.heatmap import build_heatmap_figure
from app.charts.treemap import build_treemap_figure
from app.charts.bandwidth import build_bandwidth_figure
from app.charts.line import build_line_figure
from app.charts.bar import build_bar_figure
from app.charts.radar import build_radar_figure
from app.charts.solutions import SOLUTION_BUILDERS

app = Flask(__name__)
CORS(app)


NOC_TEMPLATE = dict(
    paper_bgcolor="rgba(2,6,23,1)",
    plot_bgcolor="rgba(10,22,40,1)",
    font=dict(family="JetBrains Mono, monospace", color="#e2e8f0", size=11),
    margin=dict(l=40, r=20, t=40, b=40),
)


@app.route("/health")
def health():
    return jsonify(status="ok", engine="plotly-dash", version="1.0.0")


@app.route("/api/charts/registry")
def chart_registry():
    return jsonify(charts=[
        {"id": "topology", "engine": "plotly", "name": "Network Topology", "category": "enterprise"},
        {"id": "gauge", "engine": "plotly", "name": "Gauge Meter", "category": "noc"},
        {"id": "multi-gauge", "engine": "plotly", "name": "Multi-Gauge Panel", "category": "noc"},
        {"id": "sankey", "engine": "plotly", "name": "Sankey Flow Diagram", "category": "enterprise"},
        {"id": "heatmap", "engine": "plotly", "name": "Threat Heatmap", "category": "noc"},
        {"id": "treemap", "engine": "plotly", "name": "Asset Treemap", "category": "enterprise"},
        {"id": "bandwidth", "engine": "plotly", "name": "Bandwidth Gauge", "category": "noc"},
        {"id": "line", "engine": "plotly", "name": "Trend Line / Area", "category": "basic"},
        {"id": "bar", "engine": "plotly", "name": "Bar Chart", "category": "basic"},
        {"id": "radar", "engine": "plotly", "name": "Radar / Spider", "category": "basic"},
    ])


def fig_response(fig):
    return Response(pio.to_json(fig), mimetype="application/json")


@app.route("/api/charts/topology")
def api_topology():
    return fig_response(build_topology_figure())


@app.route("/api/charts/gauge")
def api_gauge():
    return fig_response(build_gauge_figure("CPU Load", 67, suffix="%"))


@app.route("/api/charts/multi-gauge")
def api_multi_gauge():
    return fig_response(build_multi_gauge_figure([
        {"title": "CPU", "value": 67},
        {"title": "Memory", "value": 82},
        {"title": "Bandwidth", "value": 45},
        {"title": "Threat", "value": 23},
    ]))


@app.route("/api/charts/sankey")
def api_sankey():
    return fig_response(build_sankey_figure())


@app.route("/api/charts/heatmap")
def api_heatmap():
    return fig_response(build_heatmap_figure())


@app.route("/api/charts/treemap")
def api_treemap():
    return fig_response(build_treemap_figure())


@app.route("/api/charts/bandwidth")
def api_bandwidth():
    return fig_response(build_bandwidth_figure(24.7, max_val=40))


@app.route("/api/charts/line")
def api_line():
    return fig_response(build_line_figure())


@app.route("/api/charts/bar")
def api_bar():
    return fig_response(build_bar_figure())


@app.route("/api/charts/radar")
def api_radar():
    return fig_response(build_radar_figure())


@app.route("/api/solutions/registry")
def solutions_registry():
    return jsonify(solutions=[
        {"id": k, "name": k.replace("-", " ").title(), "engine": "plotly"}
        for k in SOLUTION_BUILDERS.keys()
    ])


@app.route("/api/solutions/<solution_id>")
def api_solution(solution_id):
    builder = SOLUTION_BUILDERS.get(solution_id)
    if not builder:
        return jsonify(error=f"Unknown solution: {solution_id}"), 404
    fig = builder()
    return fig_response(fig)


if __name__ == "__main__":
    port = int(os.environ.get("VIZ_PORT", 5050))
    app.run(host="0.0.0.0", port=port, debug=True)
