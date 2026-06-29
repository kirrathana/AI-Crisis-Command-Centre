# 🚨 AI Crisis Command Centre

An AI-powered crisis management platform built with **UiPath Maestro** that automates incident handling through intelligent AI agents, human-in-the-loop approvals, and end-to-end workflow orchestration.


**GitHub Repository:** https://github.com/kirrathana/AI-Crisis-Command-Centre

---

# 📌 Overview

AI Crisis Command Centre is an intelligent incident response platform designed to help emergency response organizations manage crisis incidents quickly, accurately, and transparently.

The solution orchestrates multiple AI agents using **UiPath Maestro** to classify incidents, assess risks, automate response workflows, and generate stakeholder communications. Whenever AI confidence is low, the workflow automatically routes the case to human experts through **UiPath Action Center**, ensuring reliable decision-making while maintaining the speed of automation.

---

# ✨ Key Features

- 🤖 AI-powered Incident Classification
- ⚠️ Intelligent Risk Assessment
- 📢 Automated Communication Generation
- 👤 AI Confidence-Based Human Approval
- 🔄 End-to-End Workflow Orchestration using UiPath Maestro
- 🤖 Automated Workflow Execution with UiPath Robots
- 📊 Real-Time Incident Dashboard
- 📋 Centralized Incident Case Management
- ⚡ Faster and Smarter Emergency Response

---

# 💡 Unique Selling Point (USP)

Our solution introduces **AI Confidence-Based Human Approval**, enabling trustworthy AI-driven automation.

- High-confidence AI decisions continue automatically.
- Low-confidence or critical incidents are routed to human experts through **UiPath Action Center** for review and approval.
- Once approved, the workflow resumes automatically without restarting.

This creates the perfect balance between **speed, automation, transparency, and human oversight**, making the platform enterprise-ready for mission-critical incident management.

---

# 🏗️ System Architecture

The architecture of the AI Crisis Command Centre is shown below.

![System Architecture](Architecture%20Diagram.jpeg)

### Workflow Overview

- **Incident Report** initiates the workflow.
- **UiPath Maestro** orchestrates the complete incident lifecycle.
- **Classification Agent** categorizes the incident and predicts its severity.
- **Risk Assessment Agent** evaluates business impact and priority.
- **Confidence Evaluation** determines whether the AI decision is sufficiently reliable.
- **High-confidence** decisions continue automatically.
- **Low-confidence** incidents are routed to **UiPath Action Center** for human approval.
- Once approved, the workflow resumes automatically.
- **Communication Agent** prepares stakeholder notifications and incident summaries.
- **UiPath Robots** execute automated operational tasks.
- The dashboard is updated, notifications are sent, and the incident is successfully closed.

---

# 🛠️ Technologies Used

## UiPath Products

- UiPath Maestro
- UiPath Agent Builder
- UiPath Action Center
- UiPath Integration Service
- UiPath Apps
- UiPath Robots

## Other Technologies

- Python
- FastAPI
- React.js
- LangChain
- OpenAI / LLM
- REST APIs
- JSON

---

# 🧩 UiPath Components Used

| UiPath Component | Purpose |
|------------------|---------|
| **UiPath Maestro** | Orchestrates the complete end-to-end incident response workflow |
| **UiPath Agent Builder** | Creates AI agents for incident classification, risk assessment, and communication |
| **UiPath Action Center** | Enables human review and approval for low-confidence AI decisions |
| **UiPath Robots** | Executes automated workflow tasks and operational actions |
| **UiPath Apps** | Provides the user interface for managing incidents |
| **UiPath Integration Service** | Connects the workflow with external systems and services |

---

# ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/kirrathana/AI-Crisis-Command-Centre.git
```

### 2. Navigate to the project directory

```bash
cd AI-Crisis-Command-Centre
```

### 3. Start the local server

Run the following command:

```bash
node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer((req, res) => { let filePath = '.' + req.url; if (filePath === './') filePath = './index.html'; const extname = path.extname(filePath); const contentType = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname] || 'text/plain'; fs.readFile(filePath, (err, content) => { if (err) { res.writeHead(404); res.end('File not found'); } else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content, 'utf-8'); } }); }); server.listen(5173, () => console.log('Server running at http://localhost:5173'));"
```

### 4. Open the application

Open your browser and visit:

```
http://localhost:5173
```

> **Note:** This is a prototype developed for **UiPath AgentHack 2026** to demonstrate AI agent orchestration, workflow automation, and human-in-the-loop approvals using UiPath Maestro.

---

# 👥 End Users

- Emergency Response Teams
- Disaster Management Authorities
- Government Agencies
- Police Departments
- Fire Services
- Medical Services
- Emergency Operations Centers

---

# 🏢 Target Industries

- Government
- Public Safety
- Healthcare
- Smart Cities
- Critical Infrastructure

---

# 🚀 Benefits

- Faster incident response
- Reduced manual intervention
- Improved decision accuracy
- AI-assisted decision making with human oversight
- Transparent workflow execution
- Better coordination between AI agents and human experts
- Enterprise-ready and scalable architecture

---

# 📹 Demo Video

🎥 **Watch the complete project demonstration here:**

https://youtu.be/UPLApRrDXcM?si=rvPH0JHdjVHgPIgO

---

# 🔮 Future Enhancements

- Multi-language AI support
- Voice-based emergency reporting
- GIS and live map integration
- Predictive disaster analytics
- IoT sensor integration
- Mobile responder application
- Real-time emergency alert broadcasting

---

# 👨‍💻 Team

Built as part of **UiPath AgentHack 2026**.

**Project:** AI Crisis Command Centre

### Team Members

- Kirrathana S
- Koshini U
- Miruthula S V
- Sankari G

---

