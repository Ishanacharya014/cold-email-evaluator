LOVABLE_SPEC.md — Cold Email Evaluator Admin Panel
Project Overview

Build a clean, modern web admin panel for Cold Email Evaluator.

Cold Email Evaluator is an AI-first backend service that evaluates and improves cold emails using a structured scoring rubric.

The backend is already implemented.

This frontend is not the core product. It is only an authorization and control panel for managing AI client access.

Users will use this panel to:

create AI client keys
choose client permissions
copy keys once
view all registered clients
rotate client keys
revoke client keys
understand what permissions each client has

The UI should feel modern, clean, minimal, and professional.

Use a design style similar to:

Linear
Stripe Dashboard
Vercel Dashboard

Preferred visual style:

soft dark theme
rounded cards
clean tables
subtle animations
responsive layout
Core Product Understanding

The backend exposes these REST endpoints.

Create client

POST /api/onboarding/client

Input:

{
  "name": "Lovable AI",
  "role": "read_only"
}

Role options:

read_only
admin

Returns:

client metadata
secret API key
permissions
allowed actions
blocked actions

Important:
The secret API key is shown only once.

List clients

POST /api/clients/list

Input:

{
  "api_key": "ADMIN_KEY"
}

Requires an admin key.

Returns:

all registered clients
client ids
client roles
status
timestamps
Rotate client key

POST /api/clients/rotate

Input:

{
  "api_key": "ADMIN_KEY",
  "client_id": "CLIENT_ID"
}

Requires an admin key.

Returns:

new secret key
updated client info

Important:
The new secret key is shown only once.

Revoke client key

POST /api/clients/revoke

Input:

{
  "api_key": "ADMIN_KEY",
  "client_id": "CLIENT_ID"
}

Requires an admin key.

Returns:

updated client status

Revoked clients cannot access backend services.

Pages Required

Build exactly four major UI sections.

1. Login / Admin Authentication Page

Purpose:
Enter an admin API key to access the dashboard.

Components:

centered card
password-style input
login button
remember session toggle

Behavior:

save the admin key in browser local storage
use the admin key for future API calls
show an invalid key error if authentication fails

UI:
Simple and elegant.

2. Dashboard Page

Main landing page after login.

Show summary cards:

Card 1: Total clients
Card 2: Active clients
Card 3: Revoked clients
Card 4: Admin clients

Also show:

recent client activity
quick actions

Quick action buttons:

Create Client
Refresh Client List
3. Create Client Page / Modal

Purpose:
Create new AI client credentials.

Form fields:

Client Name

Text input

Examples:

Claude Outreach Agent
Cursor Plugin
Internal Automation Bot
Role Selector

Dropdown

Options:

read_only
admin

Role descriptions:

read_only

Can:

evaluate emails
rewrite emails
suggest subject lines

Cannot:

manage skill versions
manage imports
manage client keys
admin

Full access.

Buttons:

Cancel
Create Client

After creation:
Open a modal showing:

client id
client name
role
secret API key

Secret key must be visually emphasized.

Show warning:
“Copy this API key now. It will never be shown again.”

Add:

Copy button
Close button
4. Client Management Page

Show all clients in a table.

Columns:

Client Name
Client ID
Role
Status
Created At
Last Used
Actions

Status badges:

active (green)
revoked (red)

Each row has actions:

Rotate Key

Calls rotate endpoint.

After success:
Show a modal containing the new secret key.

Warning:
“Old key is now invalid.”

Buttons:

Copy
Close
Revoke Key

Open confirmation modal.

Message:
“Are you sure you want to revoke this client?”

Buttons:

Cancel
Confirm Revoke

After revoke:
Update the row status to revoked.

UX Requirements

The dashboard must feel premium.

Requirements:

smooth transitions
loading skeletons
success toast notifications
error toast notifications
empty state handling
mobile responsive

Use:

cards
spacing
clear typography

Avoid clutter.

Error Handling

Show friendly UI errors for:

401 Unauthorized → invalid admin key
403 Forbidden → insufficient permissions
404 Not Found → backend route missing
500 Internal Error → server failure

Errors should appear as toast notifications.

State Management

Need client-side state for:

admin API key
client list
loading state
active modal
selected client
secret key display

Use simple frontend state management.

No heavy architecture needed.

Technical Requirements

Frontend only.

Do not rebuild backend.

All backend logic already exists.

Frontend must only call these APIs:

/api/onboarding/client
/api/clients/list
/api/clients/rotate
/api/clients/revoke

No backend duplication.

Deliverables

Generate:

Full frontend UI
All pages/components
API integration
Production-ready responsive design
Clean component architecture

Goal:
A polished admin dashboard for managing AI client authorization for Cold Email Evaluator.

Final instruction for Lovable

Build only the admin/control panel.
Do not redesign the backend.
Do not invent new backend logic.
Use the endpoints exactly as specified above.