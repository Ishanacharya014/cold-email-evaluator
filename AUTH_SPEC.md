# Auth Spec

## Purpose
This file defines how external AI clients are authorized to use the Cold Email Skill MCP Server.

The product is AI-first, so access control is required before the service is deployed publicly.

## Access Model
Access is based on API keys.

Each API key belongs to one client and has a role.

## Roles

### read_only
Can:
- evaluate_email
- rewrite_email
- suggest_cold_email_subject
- explain_cold_email_score
- check_fixed_suggestions

Cannot:
- import knowledge
- create drafts
- publish skill versions
- rollback versions
- approve or reject imported knowledge

### admin
Can do everything that read_only can do, plus:
- import knowledge
- review imported knowledge
- approve imported knowledge
- reject imported knowledge
- create skill drafts
- validate skill versions
- publish skill versions
- rollback skill versions
- promote imported knowledge

## Key Rules
- Each key must be unique.
- Each key must belong to one client.
- Keys can be revoked.
- Keys can be rotated.
- Revoked keys must no longer work.
- Keys should be stored outside the code in a local JSON file for version 1.

## Storage
For version 1, client data is stored locally in:
- `data/auth/clients.json`

## Authentication Flow
1. A client sends an API key.
2. The server looks up the key.
3. The server checks whether the client is active.
4. The server checks whether the client has permission for the requested action.
5. If allowed, the request continues.
6. If not, the request is rejected.

## Permission Rules
- read_only keys can only use evaluation-focused actions.
- admin keys can use evaluation actions and skill-management actions.
- unknown or revoked keys must be rejected.

## Future UI
A Lovable control panel will later let a user:
- create keys
- rotate keys
- revoke keys
- view client status
- choose access level

## Security Rules
- Never hardcode real keys in source code.
- Never return secret keys in logs.
- Never allow revoked keys to authenticate.
- Never guess permissions.