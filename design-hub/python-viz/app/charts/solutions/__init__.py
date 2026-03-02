from app.charts.solutions.network import build_network_diagram
from app.charts.solutions.datacenter import build_datacenter_diagram
from app.charts.solutions.cloud import build_cloud_diagram
from app.charts.solutions.cybersecurity import build_cybersecurity_diagram
from app.charts.solutions.software import build_software_diagram
from app.charts.solutions.ai_ml import build_ai_ml_diagram
from app.charts.solutions.iot import build_iot_diagram
from app.charts.solutions.telecom import build_telecom_diagram
from app.charts.solutions.compliance import build_compliance_diagram
from app.charts.solutions.erp import build_erp_diagram
from app.charts.solutions.blockchain import build_blockchain_diagram
from app.charts.solutions.digital_transform import build_digital_transform_diagram
from app.charts.solutions.project_mgmt import build_project_mgmt_diagram
from app.charts.solutions.business_continuity import build_business_continuity_diagram
from app.charts.solutions.identity import build_identity_diagram
from app.charts.solutions.training import build_training_diagram
from app.charts.solutions.support import build_support_diagram

SOLUTION_BUILDERS = {
    "network": build_network_diagram,
    "datacenter": build_datacenter_diagram,
    "cloud": build_cloud_diagram,
    "cybersecurity": build_cybersecurity_diagram,
    "software-dev": build_software_diagram,
    "ai-ml": build_ai_ml_diagram,
    "iot": build_iot_diagram,
    "telecom": build_telecom_diagram,
    "compliance": build_compliance_diagram,
    "erp": build_erp_diagram,
    "blockchain": build_blockchain_diagram,
    "digital-transform": build_digital_transform_diagram,
    "project-mgmt": build_project_mgmt_diagram,
    "business-continuity": build_business_continuity_diagram,
    "identity-mgmt": build_identity_diagram,
    "training": build_training_diagram,
    "technical-support": build_support_diagram,
}
