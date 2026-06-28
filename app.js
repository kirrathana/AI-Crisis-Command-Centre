// Global Application State
const state = {
  activeCase: null,
  currentState: 'IDLE', // IDLE, START, INTAKE, CLASSIFICATION, ENRICH, RISK_ASSESSMENT, EVIDENCE_COLLECTION, MANUAL_CONTAIN, MANAGER_REVIEW, COMMUNICATION, LEGAL_APPROVAL, REDRAFT, NOTIFICATION, RESOLUTION, END
  selectedScenario: null, // 'happy', 'lowconf', 'botfail', 'reject'
  logs: [],
  slaTimer: null,
  slaSecondsLeft: 900,
  letterVersion: 1,
  auditLedger: [],

  // Historical stats (will update dynamically)
  metrics: {
    mttc: "4.2 hrs",
    successRate: "98.2%",
    activeCases: 0,
    totalHandled: 124
  },

  // Incident Analytics Panel counts
  analytics: {
    happyPathRuns: 85,
    lowConfidenceCases: 22,
    robotFailures: 11,
    legalRejections: 6,
    slaCompliant: 118,
    totalResolutionTime: 520.8 // Total hours, to compute average (520.8 / 124 = 4.2 hrs)
  }
};

// HTML Document Elements References
const el = {
  btnHappy: document.getElementById('btn-scenario-happy'),
  btnLowConf: document.getElementById('btn-scenario-lowconf'),
  btnBotFail: document.getElementById('btn-scenario-botfail'),
  btnReject: document.getElementById('btn-scenario-reject'),

  webhookForm: document.getElementById('webhook-payload-form'),
  inputSource: document.getElementById('input-source'),
  inputSeverity: document.getElementById('input-severity'),
  inputConfidence: document.getElementById('input-confidence'),
  inputAssets: document.getElementById('input-assets'),
  inputBotOutcome: document.getElementById('input-bot-outcome'),
  btnTriggerWebhook: document.getElementById('btn-trigger-webhook'),

  valTotalIncidents: document.getElementById('val-total-incidents'),
  valMttc: document.getElementById('val-mttc'),
  valSuccessRate: document.getElementById('val-success-rate'),
  valSlaCompliance: document.getElementById('val-sla-compliance'),
  valActiveCases: document.getElementById('val-active-cases'),
  valSystemStatus: document.getElementById('val-system-status'),
  lblCurrentState: document.getElementById('lbl-current-state'),

  // Incident Analytics Panel
  valAnalyticsHappy: document.getElementById('val-analytics-happy'),
  valAnalyticsLowConf: document.getElementById('val-analytics-lowconf'),
  valAnalyticsBotFail: document.getElementById('val-analytics-botfail'),
  valAnalyticsReject: document.getElementById('val-analytics-reject'),
  barAnalyticsHappy: document.getElementById('bar-analytics-happy'),
  barAnalyticsLowConf: document.getElementById('bar-analytics-lowconf'),
  barAnalyticsBotFail: document.getElementById('bar-analytics-botfail'),
  barAnalyticsReject: document.getElementById('bar-analytics-reject'),

  // KPI Monitoring Panel
  valKpiAutoRate: document.getElementById('val-kpi-auto-rate'),
  valKpiExceptionRate: document.getElementById('val-kpi-exception-rate'),
  valKpiTotalProcessed: document.getElementById('val-kpi-total-processed'),
  valKpiAvgResolution: document.getElementById('val-kpi-avg-resolution'),

  // Incident Execution Timeline Panel
  timelineEventsContainer: document.getElementById('timeline-events-container'),
  timelineEmpty: document.getElementById('timeline-empty'),
  lblTimelineCaseId: document.getElementById('lbl-timeline-case-id'),

  // Case DB fields
  caseStatus: document.getElementById('val-db-incident-status'),
  caseId: document.getElementById('val-incident-id'),
  caseSource: document.getElementById('val-source-system'),
  caseSeverity: document.getElementById('val-severity-level'),
  caseConfidence: document.getElementById('val-confidence-score'),
  caseAssets: document.getElementById('val-impacted-assets'),
  caseDataTypes: document.getElementById('val-data-types'),
  caseContainment: document.getElementById('val-containment-status'),
  caseDeadline: document.getElementById('val-regulatory-deadline'),

  // AI Workspace Logs
  tabTriage: document.getElementById('tab-agent-triage'),
  tabRisk: document.getElementById('tab-agent-risk'),
  tabComms: document.getElementById('tab-agent-comms'),
  logTriage: document.getElementById('log-agent-triage'),
  logRisk: document.getElementById('log-agent-risk'),
  logComms: document.getElementById('log-agent-comms'),

  // Robot CLI
  valRobotState: document.getElementById('val-robot-state'),
  robotLines: document.getElementById('robot-terminal-lines'),
  robotShell: document.getElementById('robot-shell-body'),

  // Action Center Form state panels
  hitlContainer: document.getElementById('hitl-form-view'),
  hitlBadge: document.getElementById('hitl-pending-badge'),
  formIdle: document.getElementById('hitl-state-idle'),
  formEnrich: document.getElementById('hitl-state-enrich'),
  formManual: document.getElementById('hitl-state-manual'),
  formManager: document.getElementById('hitl-state-manager'),
  formLegal: document.getElementById('hitl-state-legal'),
  formClosure: document.getElementById('hitl-state-closure'),

  // Action Center inputs
  enrichAssets: document.getElementById('form-enrich-assets'),
  enrichSeverity: document.getElementById('form-enrich-severity'),
  enrichNotes: document.getElementById('form-enrich-notes'),
  btnEnrichSubmit: document.getElementById('btn-hitl-enrich-submit'),

  manualAssets: document.getElementById('manual-assets-list'),
  chkManualIsolated: document.getElementById('chk-manual-isolated'),
  chkManualRevoked: document.getElementById('chk-manual-revoked'),
  btnManualSubmit: document.getElementById('btn-hitl-manual-submit'),
  slaCountdown: document.getElementById('sla-countdown'),

  managerReviewId: document.getElementById('manager-review-incident-id'),
  managerReviewContainStatus: document.getElementById('manager-review-contain-status'),
  managerReviewAssets: document.getElementById('manager-review-assets'),
  managerReviewCompliance: document.getElementById('manager-review-compliance'),
  formManagerNotes: document.getElementById('form-manager-notes'),
  btnManagerSubmit: document.getElementById('btn-hitl-manager-submit'),

  legalDraft: document.getElementById('form-legal-draft'),
  legalFeedback: document.getElementById('form-legal-feedback'),
  feedbackContainer: document.getElementById('reject-feedback-container'),
  btnLegalApprove: document.getElementById('btn-hitl-legal-approve'),
  btnLegalReject: document.getElementById('btn-hitl-legal-reject'),
  btnLegalRejectSubmit: document.getElementById('btn-hitl-legal-reject-submit'),

  closureId: document.getElementById('closure-incident-id'),
  closureContainType: document.getElementById('closure-contain-type'),
  closureCompliance: document.getElementById('closure-compliance-status'),
  closureTimeline: document.getElementById('closure-timeline'),
  closureNotes: document.getElementById('form-closure-notes'),
  btnClosureSubmit: document.getElementById('btn-hitl-closure-submit'),

  // Escalation & Footer
  cisoOverlay: document.getElementById('ciso-alert-banner'),
  auditRows: document.getElementById('audit-log-rows'),
  btnClearLogs: document.getElementById('btn-clear-logs'),
  btnExportLogs: document.getElementById('btn-export-logs'),

  // BPMN Diagram Nodes
  nodes: {
    start: document.getElementById('node-start'),
    intake: document.getElementById('node-intake'),
    classification: document.getElementById('node-classification'),
    gateConfidence: document.getElementById('gate-confidence'),
    enrichment: document.getElementById('node-enrichment'),
    riskAssessment: document.getElementById('node-risk-assessment'),
    evidenceRobot: document.getElementById('node-evidence-robot'),
    gateRobot: document.getElementById('gate-robot'),
    manualContain: document.getElementById('node-manual-contain'),
    managerReview: document.getElementById('node-manager-review'),
    commsAgent: document.getElementById('node-comms-agent'),
    legalApproval: document.getElementById('node-legal-approval'),
    gateLegal: document.getElementById('gate-legal'),
    redraft: document.getElementById('node-redraft'),
    notificationRobot: document.getElementById('node-notification-robot'),
    resolution: document.getElementById('node-resolution'),
    end: document.getElementById('node-end')
  },
  arrows: {
    start: document.getElementById('arrow-start-intake'),
    intake: document.getElementById('arrow-intake-class'),
    classGate1: document.getElementById('arrow-class-gate1'),
    gate1Risk: document.getElementById('arrow-gate1-risk'),
    gate1Enrich: document.getElementById('arrow-gate1-enrich'),
    enrichClass: document.getElementById('arrow-enrich-class'),
    riskEvidence: document.getElementById('arrow-risk-evidence'),
    evidenceGate2: document.getElementById('arrow-evidence-gate2'),
    gate2Manager: document.getElementById('arrow-gate2-manager'),
    gate2Manual: document.getElementById('arrow-gate2-manual'),
    manualManager: document.getElementById('arrow-manual-manager'),
    managerComms: document.getElementById('arrow-manager-comms'),
    commsLegal: document.getElementById('arrow-comms-legal'),
    legalGate3: document.getElementById('arrow-legal-gate3'),
    gate3Notification: document.getElementById('arrow-gate3-notification'),
    gate3Reject: document.getElementById('arrow-gate3-reject'),
    redraftComms: document.getElementById('arrow-redraft-comms'),
    notificationResolution: document.getElementById('arrow-notification-res'),
    resolutionEnd: document.getElementById('arrow-res-end')
  }
};

// Scenario Configurations
const SCENARIOS = {
  happy: {
    source: 'CrowdStrike',
    severity: 'High',
    confidence: 94,
    assets: 'i-0d8f8d2e8b21c43f1',
    dataTypes: ['PII', 'PCI'],
    botOutcome: 'success'
  },
  lowconf: {
    source: 'Splunk',
    severity: 'Medium',
    confidence: 68,
    assets: '', // Missing / ambiguous
    dataTypes: ['PII'],
    botOutcome: 'success'
  },
  botfail: {
    source: 'SentinelOne',
    severity: 'Critical',
    confidence: 91,
    assets: 'i-09f182e01a88b77cc, user:administrator',
    dataTypes: ['PII', 'Intellectual Property'],
    botOutcome: 'failure'
  },
  reject: {
    source: 'Wiz',
    severity: 'Critical',
    confidence: 95,
    assets: 'i-07cb12c98a31e8bba',
    dataTypes: ['PCI', 'PII'],
    botOutcome: 'success'
  }
};

// Generate random case ID
function generateIncidentID() {
  return `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// ----------------------------------------------------
// UI Logic: Tabs, Scrolling Logs, Action Forms
// ----------------------------------------------------

// Handle Console Tabs
function setupTabs() {
  const tabs = [el.tabTriage, el.tabRisk, el.tabComms];
  const logs = [el.logTriage, el.logRisk, el.logComms];

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      logs.forEach(l => l.classList.remove('active'));

      tab.classList.add('active');
      const agent = tab.getAttribute('data-agent');
      if (agent === 'triage') {
        el.logTriage.classList.add('active');
      } else if (agent === 'risk') {
        el.logRisk.classList.add('active');
      } else if (agent === 'comms') {
        el.logComms.classList.add('active');
      }
    });
  });
}

// Switch active AI tab automatically
function selectAgentTab(agentName) {
  const tabs = [el.tabTriage, el.tabRisk, el.tabComms];
  const logs = [el.logTriage, el.logRisk, el.logComms];

  tabs.forEach(t => t.classList.remove('active'));
  logs.forEach(l => l.classList.remove('active'));

  let targetTab, targetLog;
  if (agentName === 'triage') {
    targetTab = el.tabTriage;
    targetLog = el.logTriage;
  } else if (agentName === 'risk') {
    targetTab = el.tabRisk;
    targetLog = el.logRisk;
  } else if (agentName === 'comms') {
    targetTab = el.tabComms;
    targetLog = el.logComms;
  }

  if (targetTab && targetLog) {
    targetTab.classList.add('active');
    targetLog.classList.add('active');
  }
}

// Append System Audit Log
function logAudit(message, tag = 'SYSTEM') {
  const now = new Date();
  const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

  let tagClass = 'tag-system';
  if (tag === 'TRIAGE') tagClass = 'tag-triage';
  else if (tag === 'ROBOT') tagClass = 'tag-robot';
  else if (tag === 'RISK') tagClass = 'tag-risk';
  else if (tag === 'COMMS') tagClass = 'tag-comms';
  else if (tag === 'HUMAN') tagClass = 'tag-human';
  else if (tag === 'ESCALATION') tagClass = 'tag-escalation';

  const row = document.createElement('div');
  row.className = 'audit-row font-mono';
  row.innerHTML = `
    <span class="audit-time">${timeStr}</span>
    <span class="audit-tag ${tagClass}">${tag}</span>
    <span class="audit-message">${message}</span>
  `;
  el.auditRows.appendChild(row);
  el.auditRows.scrollTop = el.auditRows.scrollHeight;
}

// Structured audit ledger
function pushAudit(entry) {
  state.auditLedger = state.auditLedger || [];
  
  // Format the entry message and tag
  let message = entry.message || entry.details;
  let tag = entry.tag || "SYSTEM";

  if (!message) {
    if (entry.actor === "LEGAL" && entry.action === "APPROVED") {
      message = `👤 Legal Officer approved the regulatory disclosure letter draft. Applying digital signature.`;
      tag = "HUMAN";
    } else if (entry.actor === "LEGAL" && entry.action === "REJECTED") {
      message = `👤 Legal Officer rejected draft letter. Reason: "${entry.reason || 'Inaccurate scope wording'}". Routing Exception C back to AI Comms Agent.`;
      tag = "HUMAN";
    } else if (entry.actor === "COMMS_AGENT" && entry.action === "DRAFT_GENERATED") {
      message = `🤖 Invoking AI Comms Generation Agent task [Draft_Regulatory_Comms]...`;
      tag = "COMMS";
    } else if (entry.actor === "COMMS_AGENT" && entry.action === "REDRAFT_EXECUTION") {
      message = `🔄 Exception C Active: AI Comms Agent executing Redraft iteration...`;
      tag = "COMMS";
    } else if (entry.actor === "NOTIFICATION_ROBOT" && entry.action === "INVOKED") {
      message = `🤖 Invoking Unattended Notification Robot task [Publish_Regulatory_Notice]...`;
      tag = "SYSTEM";
    } else if (entry.actor === "NOTIFICATION_ROBOT" && entry.action === "DISPATCHED") {
      message = `🟢 Unattended Robot regulatory notifications dispatched and logged.`;
      tag = "ROBOT";
    } else if (entry.actor === "NOTIFICATION_ROBOT" && entry.action === "FAILED") {
      message = `❌ Notification Robot failed. Triggering fallback escalation workflow.`;
      tag = "ESCALATION";
    } else if (entry.actor === "COMPLIANCE_OFFICER" && entry.action === "MANUAL_FALLBACK") {
      message = `👤 Manual compliance officer triggered due to robot failure`;
      tag = "HUMAN";
    } else if (entry.actor === "CRISIS_MANAGER" && entry.action === "CLOSED") {
      message = `👤 Crisis Manager signed off on case closure. Notes: "${entry.notes || ''}"`;
      tag = "HUMAN";
    } else if (entry.actor === "SYSTEM" && entry.action === "ASSIGNED_CLOSURE_FORM") {
      message = `📋 Action Form assigned: [Incident_Closure_Form] Awaiting Crisis Manager final sign-off.`;
      tag = "SYSTEM";
    } else if (entry.actor === "SYSTEM" && entry.action === "SEALED") {
      message = `🔒 Sealing Audit Ledger hash: 0x${Math.floor(Math.random() * 10000000).toString(16)}bc84...`;
      tag = "SYSTEM";
    } else if (entry.actor === "SYSTEM" && entry.action === "RESOLVED") {
      message = `🏁 Case resolved successfully. System status set to standby.`;
      tag = "SYSTEM";
    } else {
      message = `[${entry.actor}] Action ${entry.action} for case ${entry.caseId}`;
    }
  }

  const timestamp = new Date().toISOString();
  const stage = entry.stage || state.currentState;

  const auditRecord = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    stage,
    message,
    actor: entry.actor,
    action: entry.action,
    caseId: entry.caseId
  };

  state.auditLedger.push(auditRecord);

  // Call existing logAudit() for UI display (do NOT remove it)
  logAudit(message, tag);
}

// AI pre-legal compliance validation
function validateComplianceDraft(draft) {
  const warnings = [];

  if (!draft.includes("Incident")) warnings.push("Missing incident classification");
  if (!draft.includes("Containment")) warnings.push("Missing containment statement");
  if (!draft.includes("Assets")) warnings.push("Missing asset scope clarity");

  return {
    valid: warnings.length === 0,
    warnings
  };
}

// Final closure verification gate
function finalVerificationCheck() {
  if (!state.activeCase) return false;
  return (
    state.activeCase.ContainmentStatus === "Complete" &&
    state.activeCase.RegulatoryDeadline &&
    state.activeCase.RegulatoryDeadline !== "" &&
    state.activeCase.CommunicationArtifacts &&
    state.activeCase.CommunicationArtifacts.regulatory &&
    state.activeCase.CommunicationArtifacts.regulatory.length > 0
  );
}

// Fallback handler for notification failure
function runManualNotificationFallback() {
  pushAudit({
    actor: "COMPLIANCE_OFFICER",
    action: "MANUAL_FALLBACK",
    caseId: state.activeCase ? state.activeCase.IncidentID : "UNKNOWN"
  });

  if (state.activeCase) {
    state.activeCase.NotificationStatus = "Escalated";
  }

  setTimeout(() => {
    logRobot("[SYSTEM] Manual notification delivery confirmed by compliance officer.");
    
    pushAudit({
      actor: "COMPLIANCE_OFFICER",
      action: "NOTIFICATION_SENT",
      message: "NOTIFICATION_SENT",
      caseId: state.activeCase ? state.activeCase.IncidentID : "UNKNOWN"
    });

    el.valRobotState.textContent = 'STANDBY';
    el.valRobotState.className = 'badge';

    el.nodes.notificationRobot.classList.remove('state-running-bot');
    el.nodes.notificationRobot.classList.add('state-completed');
    el.arrows.notificationResolution.classList.add('active');

    setTimeout(() => {
      runResolutionStage();
    }, 1000);
  }, 1500);
}

// Append AI Agent Workspace log line
function logAgent(agent, message, style = 'text-purple') {
  let logContainer;
  if (agent === 'triage') logContainer = el.logTriage;
  else if (agent === 'risk') logContainer = el.logRisk;
  else if (agent === 'comms') logContainer = el.logComms;

  if (logContainer) {
    const line = document.createElement('div');
    line.className = `console-line ${style}`;
    line.textContent = message;
    logContainer.appendChild(line);
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}

// Append Unattended Robot log line
function logRobot(message, style = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${style}`;
  line.textContent = message;
  el.robotLines.appendChild(line);
  el.robotShell.scrollTop = el.robotShell.scrollHeight;
}

// Clear visual BPMN node states
function clearBPMN() {
  Object.values(el.nodes).forEach(n => {
    if (n) {
      n.classList.remove('state-active', 'state-completed', 'state-failed', 'state-running-bot', 'state-exception-active');
    }
  });
  Object.values(el.arrows).forEach(a => {
    if (a) {
      a.classList.remove('active');
    }
  });
}

// Set active Action Form panel
function showActionForm(formId) {
  const forms = [el.formIdle, el.formEnrich, el.formManual, el.formManager, el.formLegal, el.formClosure];
  forms.forEach(f => {
    if (f) f.classList.remove('active');
  });

  let targetForm;
  if (formId === 'idle') targetForm = el.formIdle;
  else if (formId === 'enrich') targetForm = el.formEnrich;
  else if (formId === 'manual') targetForm = el.formManual;
  else if (formId === 'manager') targetForm = el.formManager;
  else if (formId === 'legal') targetForm = el.formLegal;
  else if (formId === 'closure') targetForm = el.formClosure;

  if (targetForm) {
    targetForm.classList.add('active');

    // Update badge status
    if (formId === 'idle') {
      el.hitlBadge.textContent = 'IDLE';
      el.hitlBadge.className = 'badge';
    } else if (formId === 'enrich') {
      el.hitlBadge.textContent = 'PENDING: ANALYST';
      el.hitlBadge.className = 'badge badge-warning';
    } else if (formId === 'manual') {
      el.hitlBadge.textContent = 'ALERT: CONTAINMENT';
      el.hitlBadge.className = 'badge badge-danger badge-pulse';
    } else if (formId === 'manager') {
      el.hitlBadge.textContent = 'PENDING: MANAGER REVIEW';
      el.hitlBadge.className = 'badge badge-warning';
    } else if (formId === 'legal') {
      el.hitlBadge.textContent = 'PENDING: LEGAL';
      el.hitlBadge.className = 'badge badge-warning';
    } else if (formId === 'closure') {
      el.hitlBadge.textContent = 'PENDING: RESOLUTION';
      el.hitlBadge.className = 'badge badge-warning';
    }
  }
}

// Load Scenario details into Webhook controls
function loadScenario(scenarioName) {
  const sc = SCENARIOS[scenarioName];
  if (!sc) return;

  state.selectedScenario = scenarioName;

  // Highlight chosen scenario button
  [el.btnHappy, el.btnLowConf, el.btnBotFail, el.btnReject].forEach(btn => {
    if (btn) btn.classList.remove('active');
  });

  if (scenarioName === 'happy' && el.btnHappy) el.btnHappy.classList.add('active');
  else if (scenarioName === 'lowconf' && el.btnLowConf) el.btnLowConf.classList.add('active');
  else if (scenarioName === 'botfail' && el.btnBotFail) el.btnBotFail.classList.add('active');
  else if (scenarioName === 'reject' && el.btnReject) el.btnReject.classList.add('active');

  // Load into input controls
  el.inputSource.value = sc.source;
  el.inputSeverity.value = sc.severity;
  el.inputConfidence.value = sc.confidence;
  el.inputAssets.value = sc.assets;
  el.inputBotOutcome.value = sc.botOutcome;

  // Checkboxes
  document.getElementById('data-pii').checked = sc.dataTypes.includes('PII');
  document.getElementById('data-pci').checked = sc.dataTypes.includes('PCI');
  document.getElementById('data-phi').checked = sc.dataTypes.includes('PHI');
  document.getElementById('data-ip').checked = sc.dataTypes.includes('Intellectual Property');
}

// Update case record DB view
function updateCaseDBView() {
  if (!state.activeCase) {
    el.caseStatus.textContent = 'No Active Case';
    el.caseStatus.className = 'badge badge-pulse';
    el.caseId.textContent = '--';
    el.caseSource.textContent = '--';
    el.caseSeverity.textContent = '--';
    el.caseSeverity.className = 'field-value';
    el.caseConfidence.textContent = '--';
    el.caseConfidence.className = 'field-value';
    el.caseAssets.textContent = '[]';
    el.caseDataTypes.textContent = '[]';
    el.caseContainment.textContent = '--';
    el.caseContainment.className = 'field-value';
    el.caseDeadline.textContent = '--';
    return;
  }

  const c = state.activeCase;
  el.caseStatus.textContent = 'CASE ACTIVE';
  el.caseStatus.className = 'badge badge-danger badge-pulse';

  el.caseId.textContent = c.IncidentID;
  el.caseSource.textContent = c.SourceSystem;
  el.caseSeverity.textContent = c.SeverityLevel;

  // Severity text colors
  if (c.SeverityLevel === 'Critical') {
    el.caseSeverity.className = 'field-value text-red';
  } else if (c.SeverityLevel === 'High') {
    el.caseSeverity.className = 'field-value text-amber';
  } else {
    el.caseSeverity.className = 'field-value text-glow-cyan';
  }

  el.caseConfidence.textContent = `${c.AiConfidenceScore}%`;
  if (c.AiConfidenceScore >= 85) {
    el.caseConfidence.className = 'field-value text-green';
  } else {
    el.caseConfidence.className = 'field-value text-red font-bold';
  }

  el.caseAssets.textContent = JSON.stringify(c.ImpactedAssets);
  el.caseDataTypes.textContent = JSON.stringify(c.DataTypesInvolved);
  el.caseContainment.textContent = c.ContainmentStatus;

  if (c.ContainmentStatus === 'Complete') {
    el.caseContainment.className = 'field-value text-green';
  } else if (c.ContainmentStatus === 'Manual_Intervention') {
    el.caseContainment.className = 'field-value text-red font-bold';
  } else if (c.ContainmentStatus === 'Isolated') {
    el.caseContainment.className = 'field-value text-cyan';
  } else {
    el.caseContainment.className = 'field-value text-grey';
  }

  el.caseDeadline.textContent = c.RegulatoryDeadline || 'Awaiting Risk Evaluation...';
}

// Clear consoles for new run
function resetConsoles() {
  el.logTriage.innerHTML = '<div class="console-line text-purple">// Classification console reset. Initializing...</div>';
  el.logRisk.innerHTML = '<div class="console-line text-purple">// Risk assessment log. Awaiting input...</div>';
  el.logComms.innerHTML = '<div class="console-line text-purple">// Comms workspace. Awaiting metadata...</div>';
  el.robotLines.innerHTML = '<div class="terminal-line text-grey">[SYSTEM] Evidence Collection Robot daemon online.</div><div class="terminal-line text-grey">[SYSTEM] Notification Delivery Robot daemon online.</div>';
}

// Append Execution Timeline log event
function logTimelineEvent(stepKey, title, description, status) {
  // Hide empty state
  if (el.timelineEmpty) {
    el.timelineEmpty.style.display = 'none';
  }

  // Check if timeline event for this step already exists
  let eventDiv = document.getElementById(`timeline-ev-${stepKey}`);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  // Determine Lucide Icon name based on step key
  let iconName = 'info';
  if (stepKey === 'start') iconName = 'play';
  else if (stepKey === 'intake') iconName = 'download-cloud';
  else if (stepKey === 'classification') iconName = 'bot';
  else if (stepKey === 'enrichment') iconName = 'user-cog';
  else if (stepKey === 'riskAssessment') iconName = 'file-check';
  else if (stepKey === 'evidenceRobot') iconName = 'terminal';
  else if (stepKey === 'manualContain') iconName = 'shield-alert';
  else if (stepKey === 'managerReview') iconName = 'user-check';
  else if (stepKey === 'commsAgent') iconName = 'sparkles';
  else if (stepKey === 'legalApproval') iconName = 'scale';
  else if (stepKey === 'redraft') iconName = 'refresh-cw';
  else if (stepKey === 'notificationRobot') iconName = 'send';
  else if (stepKey === 'resolution') iconName = 'archive';
  else if (stepKey === 'end') iconName = 'check-circle-2';

  if (eventDiv) {
    // Update existing event
    eventDiv.className = `timeline-item status-${status}`;
    eventDiv.querySelector('.timeline-item-desc').textContent = description;
    eventDiv.querySelector('.timeline-icon-dot').innerHTML = `<i data-lucide="${iconName}"></i>`;
  } else {
    // Create new event
    eventDiv = document.createElement('div');
    eventDiv.id = `timeline-ev-${stepKey}`;
    eventDiv.className = `timeline-item status-${status}`;
    eventDiv.innerHTML = `
      <div class="timeline-icon-dot">
        <i data-lucide="${iconName}"></i>
      </div>
      <div class="timeline-content-box">
        <div class="timeline-item-meta">
          <span class="timeline-item-title">${title}</span>
          <span class="timeline-item-time">${timeStr}</span>
        </div>
        <span class="timeline-item-desc">${description}</span>
      </div>
    `;
    el.timelineEventsContainer.appendChild(eventDiv);
  }

  // Re-create lucide icons for newly added HTML
  lucide.createIcons();

  // Scroll to bottom
  el.timelineEventsContainer.scrollTop = el.timelineEventsContainer.scrollHeight;
}

// Clear timeline logs and restore empty state
function resetTimelineView() {
  const items = el.timelineEventsContainer.querySelectorAll('.timeline-item');
  items.forEach(i => i.remove());
  if (el.timelineEmpty) {
    el.timelineEmpty.style.display = 'flex';
  }
  el.lblTimelineCaseId.textContent = 'CASE: STANDBY';
  el.lblTimelineCaseId.className = 'badge';
}

// Update the Analytics Panel & KPI Monitoring Panel in the UI
function updateDashboardViews() {
  // Update header Executive Summary Dashboard
  el.valTotalIncidents.textContent = state.metrics.totalHandled;
  el.valMttc.textContent = state.metrics.mttc;
  el.valSuccessRate.textContent = state.metrics.successRate;

  const total = state.metrics.totalHandled;
  const slaPct = ((state.analytics.slaCompliant / total) * 100).toFixed(1);
  el.valSlaCompliance.textContent = `${slaPct}%`;

  // Update Incident Analytics Panel counts
  el.valAnalyticsHappy.textContent = state.analytics.happyPathRuns;
  el.valAnalyticsLowConf.textContent = state.analytics.lowConfidenceCases;
  el.valAnalyticsBotFail.textContent = state.analytics.robotFailures;
  el.valAnalyticsReject.textContent = state.analytics.legalRejections;

  // Update progress bars widths
  el.barAnalyticsHappy.style.width = `${(state.analytics.happyPathRuns / total * 100).toFixed(1)}%`;
  el.barAnalyticsLowConf.style.width = `${(state.analytics.lowConfidenceCases / total * 100).toFixed(1)}%`;
  el.barAnalyticsBotFail.style.width = `${(state.analytics.robotFailures / total * 100).toFixed(1)}%`;
  el.barAnalyticsReject.style.width = `${(state.analytics.legalRejections / total * 100).toFixed(1)}%`;

  // Update KPI Monitoring Panel
  const autoRate = ((state.analytics.happyPathRuns + state.analytics.legalRejections) / total * 100).toFixed(1);
  const exceptionRate = ((state.analytics.lowConfidenceCases + state.analytics.robotFailures) / total * 100).toFixed(1);

  el.valKpiAutoRate.textContent = `${autoRate}%`;
  el.valKpiExceptionRate.textContent = `${exceptionRate}%`;
  el.valKpiTotalProcessed.textContent = total;
  el.valKpiAvgResolution.textContent = state.metrics.mttc;
}

// ----------------------------------------------------
// Core State Machine: Orchestrator Logic (11-Steps)
// ----------------------------------------------------

function handleStateTransition(newState) {
  state.currentState = newState;
  el.lblCurrentState.textContent = `STATE: ${newState}`;

  if (newState === 'IDLE') {
    el.valSystemStatus.textContent = 'ONLINE';
    el.valSystemStatus.className = 'metric-value font-mono text-glow-purple';
    clearBPMN();
    showActionForm('idle');
  } else {
    el.valSystemStatus.textContent = 'PROCESSING';
    el.valSystemStatus.className = 'metric-value font-mono text-glow-cyan animate-pulse';
  }
}

// Step 1: Start Event -> Step 2: Intake
function triggerWebhookCase(payload) {
  if (state.activeCase) {
    alert("An active incident case is already in progress. Please complete or abort the current case.");
    return;
  }

  state.metrics.activeCases = 1;
  el.valActiveCases.textContent = "1";
  el.valActiveCases.style.display = "inline-block";
  el.valActiveCases.classList.add('animate-pulse');

  // Disable simulator webhook submit during execution
  el.btnTriggerWebhook.disabled = true;
  el.btnTriggerWebhook.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Maestro Processing...`;
  lucide.createIcons();

  resetConsoles();
  clearBPMN();
  resetTimelineView();

  const cId = generateIncidentID();
  el.lblTimelineCaseId.textContent = `CASE: ${cId}`;
  el.lblTimelineCaseId.className = 'badge badge-danger badge-pulse';

  // Ingest payload
  state.activeCase = {
    IncidentID: cId,
    SourceSystem: payload.source,
    SeverityLevel: payload.severity,
    AiConfidenceScore: payload.confidence,
    AIConfidenceScore: payload.confidence,
    ImpactedAssets: payload.assets.split(',').map(a => a.trim()).filter(a => a.length > 0),
    DataTypesInvolved: payload.dataTypes,
    ContainmentStatus: 'Pending',
    RegulatoryDeadline: '',
    ExceptionLog: '',
    CreatedTimestamp: new Date(),
    CommunicationArtifacts: {
      internal: [],
      external: [],
      regulatory: []
    }
  };

  state.letterVersion = 1;
  updateCaseDBView();

  handleStateTransition('START');

  // Timeline Step 1: Start Event
  logTimelineEvent('start', 'Start Event', 'Incident response execution flow initialized.', 'completed');
  el.nodes.start.classList.add('state-completed');
  el.arrows.start.classList.add('active');

  // Timeline Step 2: Intake
  setTimeout(() => {
    handleStateTransition('INTAKE');
    logTimelineEvent('intake', 'Incident Intake', `Ingesting security payload from ${payload.source} EDR...`, 'active');
    el.nodes.intake.classList.add('state-active');
    logAudit(`📥 External Incident Webhook triggered case: ${cId} from source [${payload.source}].`, 'SYSTEM');

    setTimeout(() => {
      logTimelineEvent('intake', 'Incident Intake', `Ingested incident details successfully. Case record created: ${cId}`, 'completed');
      el.nodes.intake.classList.remove('state-active');
      el.nodes.intake.classList.add('state-completed');
      el.arrows.intake.classList.add('active');

      // Proceed to Step 3: Classification
      runClassificationStage();
    }, 1200);
  }, 800);
}

// Step 3: Classification Agent
function runClassificationStage() {
  handleStateTransition('CLASSIFICATION');
  el.nodes.classification.classList.add('state-active');

  selectAgentTab('triage');
  logTimelineEvent('classification', 'Classification Agent', 'Classifying security telemetry and extracting metadata...', 'active');
  logAudit(`🤖 Requesting AI Classification log evaluation task [Classification_Agent]...`, 'SYSTEM');

  logAgent('triage', `[CLASSIFICATION_AGENT] Loading raw security telemetry logs for review...`, 'text-purple');

  setTimeout(() => {
    logAgent('triage', `[CLASSIFICATION_AGENT] Analyzing entity relationships & signatures...`, 'text-purple');
    logAgent('triage', `=> Detected Host IP/Hostnames: ${state.activeCase.ImpactedAssets.join(', ') || 'NONE DETECTED'}`, 'text-cyan');
    logAgent('triage', `=> Associated Breach Vectors: ${state.activeCase.DataTypesInvolved.join(', ')}`, 'text-cyan');
  }, 1000);

  setTimeout(() => {
    const isHighConf = state.activeCase.AiConfidenceScore >= 85;

    logAgent('triage', `[CLASSIFICATION_AGENT] Severity classification: ${state.activeCase.SeverityLevel}`, 'text-purple');
    logAgent('triage', `[CLASSIFICATION_AGENT] Classification Confidence Score: ${state.activeCase.AiConfidenceScore}%`, isHighConf ? 'text-green' : 'text-red font-bold');

    el.arrows.classGate1.classList.add('active');
    el.nodes.gateConfidence.classList.add('state-active');

    // Gateway Route check
    setTimeout(() => {
      el.nodes.gateConfidence.classList.remove('state-active');

      if (isHighConf) {
        logTimelineEvent('classification', 'Classification Agent', `Classified successfully. Confidence: ${state.activeCase.AiConfidenceScore}%, Severity: ${state.activeCase.SeverityLevel}`, 'completed');
        logAudit(`🟢 AI Confidence threshold met (${state.activeCase.AiConfidenceScore}% >= 85%). Routing to Risk Assessment.`, 'TRIAGE');
        
        pushAudit({
          actor: "TRIAGE",
          action: "CLASSIFICATION_COMPLETED",
          message: "CLASSIFICATION_COMPLETED",
          caseId: state.activeCase.IncidentID
        });

        el.nodes.classification.classList.remove('state-active');
        el.nodes.classification.classList.add('state-completed');

        el.arrows.gate1Risk.classList.add('active');

        // Proceed to Step 4: Risk Assessment
        runRiskAssessmentStage();
      } else {
        // Exception A: Low confidence
        logTimelineEvent('classification', 'Classification Exception', `Low AI confidence score (${state.activeCase.AiConfidenceScore}%). Routing to Action Center for human enrichment.`, 'exception');
        logAudit(`⚠️ AI Confidence score below 85% (${state.activeCase.AiConfidenceScore}%). Pausing Maestro: routing to manual data enrichment form.`, 'TRIAGE');

        el.arrows.gate1Enrich.classList.add('active');
        runExceptionAEnrichment();
      }
    }, 1000);

  }, 2200);
}

// Exception A: Low AI Confidence - Analyst Enrichment form
function runExceptionAEnrichment() {
  handleStateTransition('ENRICH');
  el.nodes.enrichment.classList.add('state-exception-active');

  // Set up inputs in the Action Center
  el.enrichAssets.value = state.activeCase.ImpactedAssets.join(', ');
  el.enrichSeverity.value = state.activeCase.SeverityLevel;
  el.enrichNotes.value = "Severity level medium but missing validated asset perimeter tags. Checking endpoint log hashes.";

  logTimelineEvent('enrichment', 'Analyst Data Enrichment', 'Awaiting analyst manual scope validation in Action Center...', 'active');
  showActionForm('enrich');
  logAudit(`📋 Action Form assigned in Action Center: [HITL_Data_Enrichment_Form] Enrichment parameters needed.`, 'SYSTEM');
}

// Submit Enrichment details
el.btnEnrichSubmit.addEventListener('click', () => {
  if (!state.activeCase) return;

  const validatedAssets = el.enrichAssets.value;
  const validatedSeverity = el.enrichSeverity.value;

  logAudit(`👤 Security Analyst submitted enrichment details: Assets [${validatedAssets}], Severity [${validatedSeverity}].`, 'HUMAN');

  // Update Case database with verified human input
  state.activeCase.ImpactedAssets = validatedAssets.split(',').map(a => a.trim()).filter(a => a.length > 0);
  state.activeCase.SeverityLevel = validatedSeverity;
  state.activeCase.AiConfidenceScore = Math.min(
    state.activeCase.AiConfidenceScore + 25,
    99
  );
  state.activeCase.AIConfidenceScore = state.activeCase.AiConfidenceScore;
  state.activeCase.ExceptionLog += `[Enrichment complete: Security Analyst verified scope.]; `;

  updateCaseDBView();

  logTimelineEvent('enrichment', 'Analyst Data Enrichment', `Analyst verified scope. Assets: [${validatedAssets}], Severity: ${validatedSeverity}.`, 'completed');

  el.nodes.enrichment.classList.remove('state-exception-active');
  el.nodes.enrichment.classList.add('state-completed');
  el.arrows.enrichClass.classList.add('active');

  showActionForm('idle');
  logAudit(`🔄 Re-injecting enriched case details back to Classification Agent...`, 'SYSTEM');

  setTimeout(() => {
    // Re-traverse classification
    el.arrows.enrichClass.classList.remove('active');
    el.arrows.gate1Enrich.classList.remove('active');
    el.nodes.enrichment.classList.remove('state-completed');
    el.nodes.classification.classList.remove('state-completed');

    runClassificationStage();
  }, 1000);
});

// Step 4: Risk Assessment Agent
function runRiskAssessmentStage() {
  handleStateTransition('RISK_ASSESSMENT');
  el.nodes.riskAssessment.classList.add('state-active');

  selectAgentTab('risk');
  logTimelineEvent('riskAssessment', 'Risk Assessment Agent', 'Evaluating data protection regulations CCPA/GDPR/HIPAA...', 'active');
  logAudit(`🤖 Invoking AI Risk & Compliance Agent task...`, 'SYSTEM');

  logAgent('risk', `[RISK_AGENT] Reading case file data breach parameters...`, 'text-purple');
  logAgent('risk', `=> Vectors detected: ${state.activeCase.DataTypesInvolved.join(', ')}`, 'text-cyan');

  setTimeout(() => {
    logAgent('risk', `[RISK_AGENT] Comparing breach properties with Global Data Protection Regulations...`, 'text-purple');

    // Evaluate deadlines based on jurisdiction rules
    let rulesApplied = [];
    let deadlineStr = "";
    const types = state.activeCase.DataTypesInvolved;

    const incidentTime = new Date(state.activeCase.CreatedTimestamp || new Date());
    const formatDate = (d) => {
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const gdprDeadline = new Date(incidentTime.getTime() + 72 * 60 * 60 * 1000);
    const ccpaDeadline = new Date(incidentTime.getTime() + 45 * 24 * 60 * 60 * 1000);
    const hipaaDeadline = new Date(incidentTime.getTime() + 60 * 24 * 60 * 60 * 1000);
    const standardDeadline = new Date(incidentTime.getTime() + 30 * 24 * 60 * 60 * 1000);

    state.activeCase.gdprDeadline = gdprDeadline;
    state.activeCase.ccpaDeadline = ccpaDeadline;
    state.activeCase.hipaaDeadline = hipaaDeadline;
    state.activeCase.standardDeadline = standardDeadline;

    if (types.includes('PII')) {
      rulesApplied.push("GDPR Article 33 (72h)");
      deadlineStr = `GDPR (72h reporting threshold: ${formatDate(gdprDeadline)})`;
    }
    if (types.includes('PCI')) {
      rulesApplied.push("CCPA Section 1798 (45d)");
      if (!deadlineStr) {
        deadlineStr = `CCPA (45-day reporting threshold: ${formatDate(ccpaDeadline)})`;
      }
    }
    if (types.includes('PHI')) {
      rulesApplied.push("HIPAA Notification Rule (60d)");
      if (!deadlineStr) {
        deadlineStr = `HIPAA (60-day reporting threshold: ${formatDate(hipaaDeadline)})`;
      }
    }
    if (rulesApplied.length === 0) {
      rulesApplied.push("Standard Security Incident (30d)");
      if (!deadlineStr) {
        deadlineStr = `Standard (30-day reporting threshold: ${formatDate(standardDeadline)})`;
      }
    }

    logAgent('risk', `=> Framework Rules: ${rulesApplied.join(' & ')}`, 'text-cyan');
    logAgent('risk', `=> Global compliance deadline resolved: ${deadlineStr}`, 'text-green');

    state.activeCase.RegulatoryDeadline = deadlineStr;
    updateCaseDBView();

    logTimelineEvent('riskAssessment', 'Risk Assessment Agent', `Assessment finished. Framework: ${rulesApplied.join(' & ')}, Deadline: ${deadlineStr}`, 'completed');
    logAudit(`⚖️ AI Risk Agent evaluation complete. Deadline logged inside Case Record: ${deadlineStr}`, 'RISK');

    setTimeout(() => {
      pushAudit({
        actor: "RISK",
        action: "RISK_ASSESSMENT_COMPLETED",
        message: "RISK_ASSESSMENT_COMPLETED",
        caseId: state.activeCase.IncidentID
      });

      el.nodes.riskAssessment.classList.remove('state-active');
      el.nodes.riskAssessment.classList.add('state-completed');
      el.arrows.riskEvidence.classList.add('active');

      // Proceed to Step 5: Evidence Collection Robot
      runEvidenceCollectionStage();
    }, 1000);

  }, 1800);
}

// Step 5: Evidence Collection Robot
function runEvidenceCollectionStage() {
  handleStateTransition('EVIDENCE_COLLECTION');
  el.nodes.evidenceRobot.classList.add('state-running-bot');

  el.valRobotState.textContent = 'EVIDENCE BOT ACTIVE';
  el.valRobotState.className = 'badge badge-warning';

  logTimelineEvent('evidenceRobot', 'Evidence Collection Robot', 'Invoking unattended robot to collect forensic snapshots & contain network...', 'active');
  logAudit(`🤖 Invoking Unattended Containment Robot task [Execute_Network_Containment]...`, 'SYSTEM');

  // Print terminal CLI execution simulation
  logRobot(`[Evidence Collection] [INFO] Connecting to VPC console API...`);
  logRobot(`[Evidence Collection] [INFO] Target asset arrays: ${JSON.stringify(state.activeCase.ImpactedAssets)}`);

  setTimeout(() => {
    logRobot(`[AWS CLI] aws ec2 describe-instances --instance-ids ${state.activeCase.ImpactedAssets[0] || 'i-09f1e8e2b8bc'} --query "Reservations[*].Instances[*].State.Name"`);
    logRobot(`[AWS CLI] Instance status verified: running`);
  }, 800);

  setTimeout(() => {
    const isBotSuccess = el.inputBotOutcome.value === 'success';

    if (isBotSuccess) {
      logRobot(`[AWS CLI] aws ec2 modify-instance-attribute --instance-id ${state.activeCase.ImpactedAssets[0] || 'i-09f1e8e2b8bc'} --groups "sg-0c4a16ecb117bc84b" (Forensic Isolation SG)`);
      logRobot(`[AWS CLI] Security group replaced. Network interface isolation successful.`);
      logRobot(`[AWS CLI] aws ec2 create-image --instance-id ${state.activeCase.ImpactedAssets[0] || 'i-09f1e8e2b8bc'} --name "Forensic-Snapshot-${state.activeCase.IncidentID}"`);
      logRobot(`[AWS CLI] Forensic image snapshot created: ami-8d8213cf`);

      setTimeout(() => {
        logRobot(`[SYSTEM] Evidence gathering & isolation script finished with code 0.`);
        el.valRobotState.textContent = 'STANDBY';
        el.valRobotState.className = 'badge';

        logTimelineEvent('evidenceRobot', 'Evidence Collection Robot', 'Robot successfully collected forenics & isolated AWS instances.', 'completed');
        logAudit(`🟢 Unattended Robot containment confirmed. Assets isolated automatically.`, 'ROBOT');

        state.activeCase.ContainmentStatus = 'Complete';
        updateCaseDBView();

        el.nodes.evidenceRobot.classList.remove('state-running-bot');
        el.nodes.evidenceRobot.classList.add('state-completed');
        el.arrows.evidenceGate2.classList.add('active');
        el.nodes.gateRobot.classList.add('state-active');

        setTimeout(() => {
          el.nodes.gateRobot.classList.remove('state-active');
          el.arrows.gate2Manager.classList.add('active');

          // Proceed to Step 6: Manager Review
          runManagerReviewStage();
        }, 1000);

      }, 1000);

    } else {
      // Robot Failure path
      logRobot(`[AWS CLI] aws ec2 modify-instance-attribute --instance-id ${state.activeCase.ImpactedAssets[0] || 'i-09f1e8e2b8bc'} --groups "sg-0c4a16ecb117bc84b"`, 'text-red');
      logRobot(`[AWS CLI] [ERROR] Connection refused. AWS VPC network endpoint timed out.`, 'text-red');
      logRobot(`[SYSTEM] Exit code 1: Robotic evidence collection failed.`, 'text-red');

      el.valRobotState.textContent = 'EXECUTION FAILURE';
      el.valRobotState.className = 'badge badge-danger';

      logTimelineEvent('evidenceRobot', 'Evidence Collection Exception', 'Robot failed to connect to cloud endpoint. Routing to manual containment (SLA triggered).', 'exception');
      logAudit(`❌ Unattended Robot failed to contain assets automatically. Application exception caught!`, 'ROBOT');

      // Severity escalation
      state.activeCase.SeverityLevel = 'Critical';
      state.activeCase.ContainmentStatus = 'Manual_Intervention';
      state.activeCase.ExceptionLog += `[Robot failed: Cloud API timeout exception]; `;
      updateCaseDBView();

      el.nodes.evidenceRobot.classList.remove('state-running-bot');
      el.nodes.evidenceRobot.classList.add('state-failed');
      el.arrows.evidenceGate2.classList.add('active');
      el.nodes.gateRobot.classList.add('state-active');

      setTimeout(() => {
        el.nodes.gateRobot.classList.remove('state-active');
        el.arrows.gate2Manual.classList.add('active');

        runExceptionBManualContainment();
      }, 1000);
    }
  }, 2000);
}

// Exception B: Robot Failure - Manual analyst containment form & SLA Escalation
function runExceptionBManualContainment() {
  handleStateTransition('MANUAL_CONTAIN');
  el.nodes.manualContain.classList.add('state-exception-active');

  // Pop values to Action Form
  el.manualAssets.textContent = state.activeCase.ImpactedAssets.join(', ') || 'i-09f1e8e2b8bc';
  el.chkManualIsolated.checked = false;
  el.chkManualRevoked.checked = false;
  el.btnManualSubmit.disabled = true;

  logTimelineEvent('manualContain', 'Analyst Manual Containment', 'SLA clock ticking. Awaiting manual VPC isolation by Security Analyst...', 'active');
  showActionForm('manual');

  // Accelerated SLA countdown (15 minutes -> 15 seconds)
  state.slaSecondsLeft = 900;
  const secondsRemainingInit = state.slaSecondsLeft;
  const minsInit = Math.floor(secondsRemainingInit / 60);
  const secsInit = secondsRemainingInit % 60;
  el.slaCountdown.textContent = `${String(minsInit).padStart(2, '0')}:${String(secsInit).padStart(2, '0')}`;
  el.slaCountdown.className = 'sla-timer text-glow-red';

  clearInterval(state.slaTimer);
  state.slaTimer = setInterval(() => {
    state.slaSecondsLeft--;

    const secondsRemaining = state.slaSecondsLeft;
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    el.slaCountdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (state.slaSecondsLeft <= 0) {
      clearInterval(state.slaTimer);
      // Trigger CISO Escalation Alert
      el.cisoOverlay.style.display = 'block';
      logTimelineEvent('manualContain', 'SLA Breached - Alert CISO', 'Incident uncontained after SLA threshold. Sent PagerDuty alert to CISO.', 'exception');
      logAudit(`🚨 [SLA BREACHED] Incident containment remains uncompleted after SLA threshold. Webhook dispatcher sent high-priority PagerDuty alerts to CISO!`, 'ESCALATION');
      el.slaCountdown.classList.add('animate-pulse');
    }
  }, 1000 / 60);

  logAudit(`📋 Action Form assigned: [Execute_Network_Containment] SLA clock ticking. Dispatching Urgent alerts to Security Analyst.`, 'SYSTEM');
}

// Form validation check for Exception B checkboxes
function checkManualContainmentCheckboxes() {
  if (el.chkManualIsolated.checked && el.chkManualRevoked.checked) {
    el.btnManualSubmit.disabled = false;
  } else {
    el.btnManualSubmit.disabled = true;
  }
}
el.chkManualIsolated.addEventListener('change', checkManualContainmentCheckboxes);
el.chkManualRevoked.addEventListener('change', checkManualContainmentCheckboxes);

// Submit Manual containment validation
el.btnManualSubmit.addEventListener('click', () => {
  if (!state.activeCase) return;

  clearInterval(state.slaTimer);
  el.cisoOverlay.style.display = 'none';

  logAudit(`👤 Security Analyst completed manual containment validation. Asset isolation verified.`, 'HUMAN');

  state.activeCase.ContainmentStatus = 'Complete';
  state.activeCase.ExceptionLog += `[Manual isolation verified by analyst]; `;
  updateCaseDBView();

  logTimelineEvent('manualContain', 'Analyst Manual Containment', 'Analyst verified manual isolation and credential rotation.', 'completed');

  el.nodes.manualContain.classList.remove('state-exception-active');
  el.nodes.manualContain.classList.add('state-completed');
  el.arrows.manualManager.classList.add('active');

  showActionForm('idle');

  setTimeout(() => {
    // Proceed to Step 6: Manager Review
    el.arrows.manualManager.classList.remove('active');
    el.arrows.gate2Manual.classList.remove('active');
    el.nodes.manualContain.classList.remove('state-completed');
    el.nodes.evidenceRobot.classList.remove('state-failed');
    el.nodes.evidenceRobot.classList.add('state-completed');

    runManagerReviewStage();
  }, 1000);
});

// Step 6: Manager Review
function runManagerReviewStage() {
  handleStateTransition('MANAGER_REVIEW');
  el.nodes.managerReview.classList.add('state-active');

  // Clean arrows from previous containment paths
  el.arrows.gate2Manager.classList.remove('active');

  // Populate form fields
  el.managerReviewId.textContent = state.activeCase.IncidentID;
  el.managerReviewContainStatus.textContent = state.activeCase.ContainmentStatus;
  el.managerReviewAssets.textContent = JSON.stringify(state.activeCase.ImpactedAssets);
  el.managerReviewCompliance.textContent = state.activeCase.RegulatoryDeadline.split('(')[0].trim() || 'GDPR Rule Ingestion';
  el.formManagerNotes.value = "Forensic AWS snapshots verified. IAM credentials rotated. All indicators logged successfully.";

  logTimelineEvent('managerReview', 'Manager Review & Sign-off', 'Awaiting Crisis Manager containment audit & evidence sign-off...', 'active');
  showActionForm('manager');

  logAudit(`📋 Action Form assigned: [Evidence_Verification_Form] Routing validation task to Crisis Manager.`, 'SYSTEM');
}

// Manager signs off evidence
el.btnManagerSubmit.addEventListener('click', () => {
  if (!state.activeCase) return;

  const notes = el.formManagerNotes.value;
  logAudit(`👤 Crisis Manager signed off on containment evidence. Notes: "${notes}"`, 'HUMAN');

  logTimelineEvent('managerReview', 'Manager Review & Sign-off', 'Crisis Manager approved forensics evidence parameters.', 'completed');

  pushAudit({
    actor: "CRISIS_MANAGER",
    action: "MANAGER_APPROVED",
    message: "MANAGER_APPROVED",
    caseId: state.activeCase.IncidentID
  });

  el.nodes.managerReview.classList.remove('state-active');
  el.nodes.managerReview.classList.add('state-completed');
  el.arrows.managerComms.classList.add('active');

  showActionForm('idle');

  setTimeout(() => {
    // Proceed to Step 7: Communication Agent
    runCommunicationStage();
  }, 1000);
});

// Step 7: Communication Agent
function runCommunicationStage() {
  handleStateTransition('COMMUNICATION');
  el.nodes.commsAgent.classList.add('state-active');

  selectAgentTab('comms');
  logTimelineEvent('commsAgent', 'Communication Agent', 'Drafting regulatory disclosure communication notification based on compliance criteria...', 'active');
  
  pushAudit({
    actor: "COMMS_AGENT",
    action: "DRAFT_GENERATED",
    caseId: state.activeCase ? state.activeCase.IncidentID : "UNKNOWN"
  });

  logAgent('comms', `[COMMS_AGENT] Triggering notification draft generation...`, 'text-purple');
  logAgent('comms', `[COMMS_AGENT] Assembling parameters: ID=${state.activeCase.IncidentID}, Severity=${state.activeCase.SeverityLevel}, Status=${state.activeCase.ContainmentStatus}`, 'text-purple');

  setTimeout(() => {
    const draftContent = generateDisclosureLetter();
    logAgent('comms', `[COMMS_AGENT] Notification draft generated (Version ${state.letterVersion}).`, 'text-green');

    // Add communication artifact
    if (state.activeCase && state.activeCase.CommunicationArtifacts) {
      state.activeCase.CommunicationArtifacts.regulatory.push({
        version: state.letterVersion,
        type: "REGULATORY_NOTICE",
        content: draftContent,
        timestamp: new Date().toISOString()
      });
    }

    logTimelineEvent('commsAgent', 'Communication Agent', `Disclosure communication draft generated successfully (Version ${state.letterVersion}).`, 'completed');

    setTimeout(() => {
      el.nodes.commsAgent.classList.remove('state-active');
      el.nodes.commsAgent.classList.add('state-completed');
      el.arrows.commsLegal.classList.add('active');

      // AI compliance validation
      const validation = validateComplianceDraft(draftContent);
      if (!validation.valid) {
        logAudit(`⚠ Pre-legal AI validation warnings: ${validation.warnings.join(", ")}`, "COMMS");
      }

      // Proceed to Step 8: Legal Approval
      runLegalApprovalStage(draftContent);
    }, 1000);
  }, 1500);
}

// Generate notification letter template dynamically based on case fields
function generateDisclosureLetter() {
  const c = state.activeCase;

  if (state.letterVersion === 1) {
    return `### REGULATORY DISCLOSURE: INCIDENT NOTIFICATION
Ref: ${c.IncidentID}
To: European Data Protection Supervisor / California Attorney General Office
Classification: CONFIDENTIAL

This notification serves to report a data security incident at Enterprise Core Systems, in compliance with ${c.RegulatoryDeadline || "GDPR compliance standards"}.

1. NATURE OF BREACH:
   - Source Intrusion Signature: [${c.SourceSystem}] logs
   - Assets Impacted: ${c.ImpactedAssets.join(', ') || 'N/A'}
   - Confirmed vectors involved: ${c.DataTypesInvolved.join(', ')}

2. TECHNICAL REMEDIATION:
   - Containment status: ${c.ContainmentStatus} (Robotic AWS isolation verified).
   - Forensic snapshots captured, routing network perimeter blocking.

3. CONTACT DETAILS:
   For inquiries on technical metrics, please communicate with the Incident Command Team.`;
  } else {
    // Version 2 (Redrafted incorporating notes)
    const feedback = el.legalFeedback.value || "Inaccurate impact scope wording";
    return `### REGULATORY DISCLOSURE: INCIDENT NOTIFICATION (REVISED - V${state.letterVersion})
Ref: ${c.IncidentID}
To: European Data Protection Supervisor / California Attorney General Office
Classification: CONFIDENTIAL

This notification serves to report a data security incident at Enterprise Core Systems, in compliance with ${c.RegulatoryDeadline || "GDPR compliance standards"}.

*AMENDMENT NOTICE: This document has been revised based on Legal Counsel review notes: "${feedback}".*

1. NATURE OF BREACH:
   - Source Intrusion Signature: [${c.SourceSystem}] logs
   - Assets Impacted: ${c.ImpactedAssets.join(', ') || 'N/A'} (Impacted domain restricted, perimeter scope validated).
   - Confirmed vectors involved: ${c.DataTypesInvolved.join(', ')}

2. TECHNICAL REMEDIATION:
   - Containment status: ${c.ContainmentStatus} (AWS automated isolation and snapshotting verified).
   - Core AD access tokens rotated. Legal compliance deadline confirmed.

3. CONTACT DETAILS:
   For inquiries on technical metrics, please communicate with the Incident Command Team.`;
  }
}

// Step 8: Legal Approval
function runLegalApprovalStage(draftContent) {
  handleStateTransition('LEGAL_APPROVAL');
  el.nodes.legalApproval.classList.add('state-active');

  el.legalDraft.value = draftContent;

  // Reset rejection UI
  el.legalFeedback.value = '';
  el.feedbackContainer.style.display = 'none';
  el.btnLegalApprove.style.display = 'inline-flex';
  el.btnLegalReject.style.display = 'inline-flex';
  el.btnLegalRejectSubmit.style.display = 'none';

  logTimelineEvent('legalApproval', 'Legal Approval Review', 'Awaiting regulatory compliance sign-off by Legal Officer...', 'active');
  showActionForm('legal');
  pushAudit({
    actor: "SYSTEM",
    action: "ASSIGNED_LEGAL_FORM",
    caseId: state.activeCase ? state.activeCase.IncidentID : "UNKNOWN",
    details: `📋 Action Form assigned: [Legal_Draft_Review_Form] Letter ready for review. Routing task to Legal Officer.`
  });
}

// Legal approves letter
el.btnLegalApprove.addEventListener('click', () => {
  pushAudit({
    actor: "LEGAL",
    action: "APPROVED",
    caseId: state.activeCase.IncidentID
  });

  pushAudit({
    actor: "LEGAL",
    action: "LEGAL_APPROVED",
    message: "LEGAL_APPROVED",
    caseId: state.activeCase.IncidentID
  });

  logTimelineEvent('legalApproval', 'Legal Approval Review', 'Legal Officer approved and signed disclosure notice.', 'completed');

  el.nodes.legalApproval.classList.remove('state-active');
  el.nodes.legalApproval.classList.add('state-completed');
  el.arrows.legalGate3.classList.add('active');
  el.nodes.gateLegal.classList.add('state-active');

  showActionForm('idle');

  setTimeout(() => {
    el.nodes.gateLegal.classList.remove('state-active');
    el.arrows.gate3Notification.classList.add('active');

    // Proceed to Step 9: Notification Robot
    runNotificationStage();
  }, 1000);
});

// Legal clicks reject: show feedback container
el.btnLegalReject.addEventListener('click', () => {
  el.feedbackContainer.style.display = 'block';
  el.btnLegalApprove.style.display = 'none';
  el.btnLegalReject.style.display = 'none';
  el.btnLegalRejectSubmit.style.display = 'inline-flex';

  if (state.selectedScenario === 'reject') {
    el.legalFeedback.value = "Inaccurate impact scope wording - clarify that AWS instances were isolated automatically, and not only AD tokens rotated.";
  } else {
    el.legalFeedback.value = "Please adjust the wording in section 1 to clarify the affected asset scopes.";
  }
});

// Submit Legal Rejection - Loopback to Comms redraft
el.btnLegalRejectSubmit.addEventListener('click', () => {
  const fbText = el.legalFeedback.value || "Inaccurate scope wording";
  pushAudit({
    actor: "LEGAL",
    action: "REJECTED",
    caseId: state.activeCase.IncidentID,
    reason: fbText
  });

  logTimelineEvent('legalApproval', 'Legal Rejection Exception', `Legal draft rejected: "${fbText}". Routing back to AI for redraft.`, 'exception');

  el.nodes.legalApproval.classList.remove('state-active');
  el.nodes.legalApproval.classList.add('state-failed');
  el.arrows.legalGate3.classList.add('active');
  el.nodes.gateLegal.classList.add('state-active');

  showActionForm('idle');

  setTimeout(() => {
    el.nodes.gateLegal.classList.remove('state-active');
    el.arrows.gate3Reject.classList.add('active');

    // Traverses Redraft exception node
    setTimeout(() => {
      handleStateTransition('REDRAFT');
      el.nodes.redraft.classList.add('state-exception-active');
      logTimelineEvent('redraft', 'Comms Redraft Loop', 'AI Comms Agent executing redraft iteration...', 'active');
      pushAudit({
        actor: "COMMS_AGENT",
        action: "REDRAFT_EXECUTION",
        caseId: state.activeCase.IncidentID
      });

      state.letterVersion++;

      selectAgentTab('comms');
      logAgent('comms', `[REDRAFT] Reviewing Legal feedback: "${fbText}"`, 'text-purple');
      logAgent('comms', `[REDRAFT] Modifying paragraph components to update asset scope details...`, 'text-purple');

      setTimeout(() => {
        const revisedDraft = generateDisclosureLetter();
        logAgent('comms', `[REDRAFT] Revised notification generated (Version ${state.letterVersion}).`, 'text-green');

        // Add communication artifact
        if (state.activeCase && state.activeCase.CommunicationArtifacts) {
          state.activeCase.CommunicationArtifacts.regulatory.push({
            version: state.letterVersion,
            type: "REGULATORY_NOTICE",
            content: revisedDraft,
            timestamp: new Date().toISOString()
          });
        }

        logTimelineEvent('redraft', 'Comms Redraft Loop', `Notice updated based on legal notes (Version ${state.letterVersion}). Re-routing to Legal.`, 'completed');

        el.nodes.redraft.classList.remove('state-exception-active');
        el.nodes.redraft.classList.add('state-completed');
        el.arrows.redraftComms.classList.add('active');

        // Loop back to Legal Review
        setTimeout(() => {
          el.arrows.legalGate3.classList.remove('active');
          el.arrows.gate3Reject.classList.remove('active');
          el.arrows.redraftComms.classList.remove('active');
          el.nodes.redraft.classList.remove('state-completed');
          el.nodes.legalApproval.classList.remove('state-failed');

          // AI compliance validation for revised draft
          const validation = validateComplianceDraft(revisedDraft);
          if (!validation.valid) {
            logAudit(`⚠ Pre-legal AI validation warnings: ${validation.warnings.join(", ")}`, "COMMS");
          }

          runLegalApprovalStage(revisedDraft);
        }, 1200);

      }, 2000);

    }, 1000);

  }, 1000);
});

// Step 9: Notification Robot
function runNotificationStage() {
  handleStateTransition('NOTIFICATION');
  el.nodes.notificationRobot.classList.add('state-running-bot');

  el.valRobotState.textContent = 'NOTIFICATION BOT ACTIVE';
  el.valRobotState.className = 'badge badge-warning';

  logTimelineEvent('notificationRobot', 'Notification Robot Dispatch', 'Invoking unattended robot to publish approved disclosure notices...', 'active');
  pushAudit({
    actor: "NOTIFICATION_ROBOT",
    action: "INVOKED",
    caseId: state.activeCase.IncidentID
  });

  logRobot(`[Notification Bot] [INFO] Opening secure communications channel to compliance portal APIs...`);

  setTimeout(() => {
    logRobot(`[Notification Bot] Connecting to European Data Protection Supervisor compliance endpoint...`);
    logRobot(`[Notification Bot] Transmitting secure PDF notice INC-2026-Notice-${state.activeCase.IncidentID}...`);
  }, 800);

  // We check outcome of 1st attempt after 1500ms
  setTimeout(() => {
    const notifySuccess = state.selectedScenario !== 'botfail' && Math.random() > 0.2;

    if (notifySuccess) {
      logRobot(`[Notification Bot] Compliance Notice successfully registered. Transaction hash: tx_98c117b2f0a1`);
      logRobot(`[Notification Bot] Connecting to California AG data breach registry endpoint...`);
      logRobot(`[Notification Bot] Notice published. Response code: 201 Created.`);

      setTimeout(() => {
        logRobot(`[SYSTEM] Notification Delivery Robot successfully finished with code 0.`);
        el.valRobotState.textContent = 'STANDBY';
        el.valRobotState.className = 'badge';

        logTimelineEvent('notificationRobot', 'Notification Robot Dispatch', 'Disclosure notices successfully published to regulatory compliance endpoints.', 'completed');
        
        pushAudit({
          actor: "NOTIFICATION_ROBOT",
          action: "NOTIFICATION_SENT",
          message: "NOTIFICATION_SENT",
          caseId: state.activeCase.IncidentID
        });

        pushAudit({
          actor: "NOTIFICATION_ROBOT",
          action: "DISPATCHED",
          caseId: state.activeCase.IncidentID
        });

        el.nodes.notificationRobot.classList.remove('state-running-bot');
        el.nodes.notificationRobot.classList.add('state-completed');
        el.arrows.notificationResolution.classList.add('active');

        setTimeout(() => {
          runResolutionStage();
        }, 1000);
      }, 1000);

    } else {
      // First attempt fails
      logRobot("[ERROR] Notification API timeout", "text-red");
      
      pushAudit({
        actor: "NOTIFICATION_ROBOT",
        action: "NOTIFY_ATTEMPT_1_FAILED",
        message: "NOTIFY_ATTEMPT_1_FAILED",
        caseId: state.activeCase.IncidentID
      });

      logRobot("Retry scheduled in 2 seconds.");

      pushAudit({
        actor: "NOTIFICATION_ROBOT",
        action: "NOTIFY_RETRY_SCHEDULED",
        message: "NOTIFY_RETRY_SCHEDULED",
        caseId: state.activeCase.IncidentID
      });

      // Wait 2 seconds using setTimeout().
      setTimeout(() => {
        logRobot(`[Notification Bot] [INFO] Initiating second notification attempt...`);
        
        const retrySuccess = state.selectedScenario !== 'botfail';

        if (retrySuccess) {
          logRobot("[SUCCESS] Notification retry succeeded.");
          logRobot(`[Notification Bot] Compliance Notice successfully registered on retry. Transaction hash: tx_98c117b2f0a1`);
          logRobot(`[Notification Bot] Connecting to California AG data breach registry endpoint...`);
          logRobot(`[Notification Bot] Notice published. Response code: 201 Created.`);

          pushAudit({
            actor: "NOTIFICATION_ROBOT",
            action: "NOTIFY_ATTEMPT_2_SUCCESS",
            message: "NOTIFY_ATTEMPT_2_SUCCESS",
            caseId: state.activeCase.IncidentID
          });

          pushAudit({
            actor: "NOTIFICATION_ROBOT",
            action: "NOTIFICATION_SENT",
            message: "NOTIFICATION_SENT",
            caseId: state.activeCase.IncidentID
          });

          pushAudit({
            actor: "NOTIFICATION_ROBOT",
            action: "DISPATCHED",
            caseId: state.activeCase.IncidentID
          });

          setTimeout(() => {
            logRobot(`[SYSTEM] Notification Delivery Robot successfully finished with code 0 on retry.`);
            el.valRobotState.textContent = 'STANDBY';
            el.valRobotState.className = 'badge';

            logTimelineEvent('notificationRobot', 'Notification Robot Dispatch', 'Disclosure notices successfully published to regulatory compliance endpoints after retry.', 'completed');

            el.nodes.notificationRobot.classList.remove('state-running-bot');
            el.nodes.notificationRobot.classList.add('state-completed');
            el.arrows.notificationResolution.classList.add('active');

            setTimeout(() => {
              runResolutionStage();
            }, 1000);
          }, 1000);
        } else {
          logRobot("[ERROR] Notification retry failed.", "text-red");

          pushAudit({
            actor: "NOTIFICATION_ROBOT",
            action: "NOTIFY_ATTEMPT_2_FAILED",
            message: "NOTIFY_ATTEMPT_2_FAILED",
            caseId: state.activeCase.IncidentID
          });

          pushAudit({
            actor: "NOTIFICATION_ROBOT",
            action: "NOTIFY_ESCALATED_TO_COMPLIANCE",
            message: "NOTIFY_ESCALATED_TO_COMPLIANCE",
            caseId: state.activeCase.IncidentID
          });

          el.valRobotState.textContent = 'EXECUTION FAILURE';
          el.valRobotState.className = 'badge badge-danger';
          el.nodes.notificationRobot.classList.remove('state-running-bot');
          el.nodes.notificationRobot.classList.add('state-failed');

          runManualNotificationFallback();
        }
      }, 2000);
    }
  }, 1500);
}

// Step 10: Resolution
function runResolutionStage() {
  handleStateTransition('RESOLUTION');
  el.nodes.resolution.classList.add('state-active');

  el.closureId.textContent = state.activeCase.IncidentID;
  el.closureContainType.textContent = el.inputBotOutcome.value === 'success' ? 'Unattended Robot (Auto)' : 'Manual Intervention';
  el.closureCompliance.textContent = state.activeCase.RegulatoryDeadline.split('(')[0].trim() + " Dispatched";

  // Compute simulation duration
  let durationText = "3.2 minutes (Autonomous)";
  if (state.selectedScenario === 'botfail') {
    durationText = "12.8 minutes (Analyst Intervention)";
  } else if (state.selectedScenario === 'lowconf') {
    durationText = "4.5 minutes (Enrichment Loop)";
  } else if (state.selectedScenario === 'reject') {
    durationText = "6.1 minutes (Redraft Loop)";
  }

  el.closureTimeline.textContent = durationText;
  el.closureNotes.value = `Incident resolved. AWS EC2 network isolation confirmed. Forensic snapshot saved to S3. Regulatory notices successfully published via robot portal APIs. Case audit ledger sealed.`;

  logTimelineEvent('resolution', 'Incident Resolution Sign-off', 'Awaiting Crisis Manager final sign-off to close incident and seal ledger...', 'active');
  showActionForm('closure');
  pushAudit({
    actor: "SYSTEM",
    action: "ASSIGNED_CLOSURE_FORM",
    caseId: state.activeCase.IncidentID
  });
}

// Crisis Manager signs off and resolves case (Step 11: End Event)
el.btnClosureSubmit.addEventListener('click', () => {

  // Prevent duplicate execution
  if (state.activeCase?.isClosed) {
    return;
  }

  state.activeCase.isClosed = true;

  if (!finalVerificationCheck()) {
    state.activeCase.isClosed = false;

    logAudit("Closure blocked: verification failed", "ESCALATION");
    pushAudit({
      actor: "SYSTEM",
      action: "CLOSURE_BLOCKED",
      caseId: state.activeCase ? state.activeCase.IncidentID : "UNKNOWN"
    });

    return;
  }

  // Optional: disable button after successful click
  el.btnClosureSubmit.disabled = true;

  const closureNotes = el.closureNotes.value;
  pushAudit({
    actor: "CRISIS_MANAGER",
    action: "CLOSED",
    caseId: state.activeCase.IncidentID,
    notes: closureNotes
  });
  pushAudit({
    actor: "SYSTEM",
    action: "CASE_CLOSED",
    message: "CASE_CLOSED",
    caseId: state.activeCase.IncidentID
  });
  pushAudit({
    actor: "SYSTEM",
    action: "SEALED",
    caseId: state.activeCase.IncidentID
  });

  logTimelineEvent('resolution', 'Incident Resolution Sign-off', 'Crisis Manager signed post-mortem report and sealed audit ledger.', 'completed');

  el.nodes.resolution.classList.remove('state-active');
  el.nodes.resolution.classList.add('state-completed');
  el.arrows.resolutionEnd.classList.add('active');

  setTimeout(() => {
    handleStateTransition('END');
    el.nodes.end.classList.add('state-completed');
    logTimelineEvent('end', 'End Event', 'Maestro process execution finished. Incident response case closed.', 'completed');
    pushAudit({
      actor: "SYSTEM",
      action: "RESOLVED",
      caseId: state.activeCase ? state.activeCase.IncidentID : "UNKNOWN"
    });

    // Update global metrics based on scenario run
    state.metrics.totalHandled++;

    // Check SLA compliance
    const isSlaBreached = state.selectedScenario === 'botfail' && state.slaSecondsLeft <= 0;
    if (!isSlaBreached) {
      state.analytics.slaCompliant++;
    }

    // Update scenario analytics metrics
    let runTime = 0.05; // hours
    if (state.selectedScenario === 'happy') {
      state.analytics.happyPathRuns++;
      runTime = 0.05; // 3.2 mins
    } else if (state.selectedScenario === 'lowconf') {
      state.analytics.lowConfidenceCases++;
      runTime = 0.08; // 4.5 mins
    } else if (state.selectedScenario === 'botfail') {
      state.analytics.robotFailures++;
      runTime = 0.21; // 12.8 mins
    } else if (state.selectedScenario === 'reject') {
      state.analytics.legalRejections++;
      runTime = 0.10; // 6.1 mins
    }

    state.analytics.totalResolutionTime += runTime;

    // Re-calculate MTTC based on total resolution time and handled incidents
    const avgHrs = (state.analytics.totalResolutionTime / state.metrics.totalHandled).toFixed(2);
    state.metrics.mttc = `${avgHrs} hrs`;

    // Calculate Success Rate %
    // Success rate is (total processed - robot failures) / total processed (excluding robot faults as failures)
    // Wait, let's keep it aligned with pre-existing numbers, say we have only 2 actual breaches / failures out of total processed
    const successRateVal = (((state.metrics.totalHandled - 2) / state.metrics.totalHandled) * 100).toFixed(1);
    state.metrics.successRate = `${successRateVal}%`;

    // Update dashboard panels
    updateDashboardViews();

    state.metrics.activeCases = 0;
    el.valActiveCases.textContent = "0";
    el.valActiveCases.style.display = "none";
    el.valActiveCases.classList.remove('animate-pulse');

    setTimeout(() => {
      // Clean states and return to idle
      state.activeCase = null;
      updateCaseDBView();

      handleStateTransition('IDLE');

      // Re-enable trigger button
      el.btnTriggerWebhook.disabled = false;
      el.btnTriggerWebhook.innerHTML = `<i data-lucide="play"></i> Trigger Incident Webhook`;
      lucide.createIcons();
    }, 2000);

  }, 1500);
});

// Webhook Payload Form Submit
el.webhookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Read form values
  const payload = {
    source: el.inputSource.value,
    severity: el.inputSeverity.value,
    confidence: parseInt(el.inputConfidence.value) || 90,
    assets: el.inputAssets.value,
    dataTypes: [],
    botOutcome: el.inputBotOutcome.value
  };

  if (document.getElementById('data-pii').checked) payload.dataTypes.push('PII');
  if (document.getElementById('data-pci').checked) payload.dataTypes.push('PCI');
  if (document.getElementById('data-phi').checked) payload.dataTypes.push('PHI');
  if (document.getElementById('data-ip').checked) payload.dataTypes.push('Intellectual Property');

  if (payload.dataTypes.length === 0) {
    payload.dataTypes.push('PII');
  }

  triggerWebhookCase(payload);
});

// Scenario Preset Clicking Triggers
el.btnHappy.addEventListener('click', () => loadScenario('happy'));
el.btnLowConf.addEventListener('click', () => loadScenario('lowconf'));
el.btnBotFail.addEventListener('click', () => loadScenario('botfail'));
el.btnReject.addEventListener('click', () => loadScenario('reject'));

// Audit Ledger Actions
el.btnClearLogs.addEventListener('click', () => {
  el.auditRows.innerHTML = '';
  logAudit('Orchestrator audit ledger log cleared.', 'SYSTEM');
});

el.btnExportLogs.addEventListener('click', () => {
  let logText = "AI CRISIS COMMAND CENTER - INCIDENT AUDIT LEDGER REPORT\n";
  logText += "=========================================================\n";
  const rows = el.auditRows.querySelectorAll('.audit-row');
  rows.forEach(r => {
    logText += `${r.innerText}\n`;
  });

  const blob = new Blob([logText], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `incident_audit_ledger_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
  setupTabs();

  // Default to happy path
  loadScenario('happy');

  // Show initial telemetry statistics
  updateDashboardViews();

  logAudit('Orchestrator engine online. Webhook endpoints loaded.', 'SYSTEM');
});