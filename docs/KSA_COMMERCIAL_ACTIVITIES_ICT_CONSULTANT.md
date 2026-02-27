# Commercial Activities vs ICT Consultant Role (KSA)

**Purpose:** Map Saudi commercial activity codes (CR / Ministry of Commerce) to ICT consultant scope for positioning, lead intake service areas, and proposals.

**Use in platform:** Optional `activity_code` or `service_area` in lead intake; product_line dropdown can align to these clusters. Positioning copy for website and proposals.

---

## Activity Code → ICT Consultant Scope

| # | Activity Code | Activity Name (AR) | What an ICT Consultant Can Do |
|---|---------------|---------------------|-------------------------------|
| 1 | 410010 | الإنشاءات العامة للمباني السكنية | Smart building advisory, low-voltage design (CCTV, access control), IT infrastructure planning, network & structured cabling architecture, site digitalization strategy |
| 2 | 410021 | الإنشاءات العامة للمباني غير السكنية (مدارس/مستشفيات…) | Data center rooms design, cybersecurity for facilities, IoT integration, BMS integration, compliance (NCA ECC / HCIS if applicable) |
| 3 | 410030 | إنشاءات المباني الجاهزة في المواقع | Edge computing setup, site connectivity (SD-WAN), temporary infrastructure planning, cloud-connected construction monitoring |
| 4 | 410040 | ترميمات المباني السكنية وغير السكنية | IT modernization assessment, infrastructure audit, digital retrofitting, smart sensors deployment |
| 5 | 582001 | نشر البرامج الجاهزة | ERP/GRC deployment, SaaS onboarding, configuration management, user training, cybersecurity hardening |
| 6 | 582002 | أنظمة التشغيل | OS deployment strategy, endpoint security baseline, virtualization advisory, patch governance frameworks |
| 7 | 620101 | تكامل الأنظمة | API architecture, middleware design, ERP–CRM–HR integration, IAM integration, data governance design |
| 8 | 620102 | تصميم وبرمجة البرمجيات الخاصة | Custom software architecture, secure coding standards, DevSecOps setup, scalability design, cloud-native architecture |
| 9 | 620106 | تقنيات الروبوت | RPA consulting, automation process mapping, robotics integration with enterprise systems |
| 10 | 620108 | تقنيات الواقع الاندماجي والافتراضي | VR/AR business case design, industrial training simulations, infrastructure readiness assessment |
| 11 | 620111 | تطوير التطبيقات | Mobile/web app architecture, CI/CD pipelines, API security, performance optimization |
| 12 | 620113 | تقنيات الذكاء الاصطناعي | AI strategy roadmap, MLOps framework, data readiness assessment, AI governance & compliance (PDPL alignment), model risk management |
| 13 | 620211 | تقديم خدمة إدارة ومراقبة شبكات الاتصالات والمعلومات | NOC/SOC setup advisory, network monitoring frameworks, SIEM integration, zero-trust architecture |
| 14 | 631121 | إقامة البنية الأساسية لاستضافة المواقع وتجهيز البيانات | Cloud architecture design (AWS/Azure/GCP), DR/BCP strategy, Kubernetes advisory, cost optimization (FinOps) |
| 15 | 631125 | تقديم خدمات الحوسبة السحابية | Cloud migration roadmap, landing zone architecture, multi-tenant SaaS governance, workload optimization |
| 16 | 702017 | تقديم خدمات الاستشارات الإدارية العليا | Digital transformation strategy, enterprise IT governance (COBIT/ISO 38500), risk management frameworks, GRC implementation |
| 17 | 731013 | تقديم خدمات تسويقية نيابة عن الغير | Martech stack design, CRM architecture, marketing automation, data analytics dashboards |

---

## Mapping to Lead Intake (product_line / service_area)

For the DLI/PLRP form, these can be grouped into **service areas** (product_line values):

| product_line code | Label (EN) | Label (AR) | Related activity codes |
|-------------------|------------|------------|-------------------------|
| `shahin-grc` | Shahin.ai GRC Platform | منصة شاهين للامتثال والحوكمة | 582001, 702017 |
| `cybersecurity` | Cybersecurity & GRC | الأمن السيبراني والحوكمة | 582001, 582002, 620211, 702017 |
| `cloud` | Cloud & DevOps | السحابة وDevOps | 631121, 631125, 620102 |
| `integration` | Systems Integration | تكامل الأنظمة | 620101, 620102 |
| `network` | Network & Data Center | الشبكات ومركز البيانات | 410021, 620211, 631121 |
| `smart-building` | Smart Building & IoT | المباني الذكية وإنترنت الأشياء | 410010, 410021, 410040 |
| `software-dev` | Custom Software & Apps | البرمجيات والتطبيقات | 620102, 620111, 620106 |
| `ai-governance` | AI & Data Governance | الذكاء الاصطناعي وحوكمة البيانات | 620113 |
| `consulting` | IT & Digital Strategy | استشارات تقنية واستراتيجية رقمية | 702017, 731013 |
| `managed` | Managed Services (NOC/SOC) | خدمات مُدارة (مراقبة الشبكات والأمن) | 620211, 631121 |

---

## Strategic Positioning (Dogan Consult / Shahin-AI)

**Core ICT advisory layer:**

- Enterprise architecture  
- Cybersecurity & GRC  
- AI governance  
- Cloud & infrastructure  

**High-value differentiator in KSA:**

- NCA ECC alignment  
- SAMA / PDPL compliance integration  
- AI governance advisory  
- Multi-tenant SaaS governance  

**Positioning statement (EN):**

> Strategic ICT & Digital Governance Advisory covering Infrastructure, Cloud, Cybersecurity, AI, and Enterprise Systems Integration aligned with Saudi regulatory frameworks.

**Positioning statement (AR):**

> استشارات استراتيجية في تقنية المعلومات والحوكمة الرقمية تشمل البنية التحتية والسحابة والأمن السيبراني والذكاء الاصطناعي وتكامل الأنظمة المؤسسية بما يتماشى مع الأطر التنظيمية السعودية.

---

## Use in platform

- **Inquiry / partner form:** Use `product_line` (and optional `activity_code`) so leads are tagged by service area and optionally by CR activity.
- **Website / proposals:** Use the positioning statement and activity table to describe scope of services.
- **Assign rules:** Route leads by `product_line` (and optionally `vertical`) to the right owner.
