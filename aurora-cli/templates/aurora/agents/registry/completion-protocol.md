# Agent Completion Protocol

Standardized format for agent task completion and handoffs.

---

## Completion Status

Agents report one of three statuses:

- **`completed`**: Task finished successfully
- **`partial`**: Task in progress, waiting for approval/user input
- **`blocked`**: Cannot proceed (needs decision, missing dependency, etc.)

---

## XML Format

```xml
<agent_completion>
  <status>completed|partial|blocked</status>
  <agent>@agent-name</agent>
  <timestamp>2025-12-18T04:30:00Z</timestamp>
  <summary>
    Brief description of what was accomplished or current state
  </summary>
  <metrics>
    <metric name="files_scanned">42</metric>
    <metric name="violations_found">12</metric>
    <metric name="violations_fixed">8</metric>
  </metrics>
  <next_steps>
    <recommend>@next-agent</recommend>
    <reason>Why this agent should run next</reason>
  </next_steps>
  <decision_points>
    <decision>
      <question>Apply all fixes automatically?</question>
      <options>
        <option value="yes">Apply all 12 fixes</option>
        <option value="select">Select specific fixes</option>
        <option value="no">Skip fixes</option>
      </options>
    </decision>
  </decision_points>
</agent_completion>
```

---

## Usage

### From Shell Scripts

```bash
source aurora/agents/shared/tools/completion-report.sh

# Success completion
complete_success "quality-reviewer" "Fixed 12 violations" "theme-enforcer" "refactorer"

# Partial (waiting approval)
complete_partial "refactorer" "Ready to split Dashboard.tsx" "test-generator"

# Blocked
complete_blocked "deployment-manager" "Missing environment variables"
```

### From Agent Prompts

Agents should include completion XML in their responses when:
- Task is complete
- Waiting for user approval
- Blocked and cannot proceed
- Recommending next agent

---

## Handoff Protocol

When agent A completes and recommends agent B:

1. **Agent A** outputs completion XML with `next_steps`
2. **Coordinator** (or user) invokes **Agent B**
3. **Agent B** reads context from:
   - Files modified by Agent A
   - Completion XML from Agent A
   - Project state (git diff, etc.)

---

## Metrics

Common metrics agents should report:

- `files_scanned` - Number of files analyzed
- `violations_found` - Issues detected
- `violations_fixed` - Issues resolved
- `tests_generated` - Test files created
- `coverage_percent` - Test coverage achieved
- `complexity_score` - Average complexity
- `files_modified` - Files changed
- `time_seconds` - Execution time

---

## Decision Points

Agents should present decision points when:
- Multiple fix options exist
- User approval required for destructive changes
- Ambiguous requirements need clarification

Format decision points clearly with:
- Question (what needs deciding)
- Options (available choices)
- Recommendation (agent's suggestion)

---

*Version 2.0 | December 2025*
