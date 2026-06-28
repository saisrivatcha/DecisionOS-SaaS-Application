Decision Contributor Role UX Fix

Redesign the Decision Contributor experience to follow proper enterprise workflow. The current design incorrectly shows AI recommendations and suggested strategies after clicking "View" in My Submissions. Decision Contributors should never see or influence AI recommendations.

Goal

Separate the platform into two completely different experiences:

Decision Contributor → Capture and submit business cases.
Decision Architect → Review AI analysis and approve strategies.
Decision Contributor Responsibilities

Decision Contributors can only:

Create new submissions
Upload meeting notes, CRM notes, emails or transcripts
Track submission status
View their own submissions
Receive final approved decision
View outcome after implementation

They cannot:

See AI reasoning
See confidence scores
See suggested strategies
Approve or reject decisions
Edit business rules
Access Company Memory
Update "My Submissions"

When clicking View, remove the entire AI strategy section.

Instead show:

Header
Customer
Decision ID
Decision Type
Priority
Revenue Impact
Decision Lifecycle

Draft

Submitted

AI Processing

Awaiting Architect Review

Approved

Executed

Stored in Company Memory

Submitted Information

Meeting Transcript

CRM Notes

Emails

Uploaded Files

Situation Summary

Attachments

Timeline

Current Status

Current Status

Submitted

AI Processing

Waiting for Architect Review

Approved

Rejected

Need More Information

Assigned Architect

Show

Decision Architect Name

Department

Expected Review Time

Architect Comments

Initially

"No comments yet."

After review

Display comments left by Decision Architect.

Final Decision (Visible only after approval)

Decision

Approved

Chosen Strategy

Reason

Approved By

Approved Time

Outcome

Remove Completely

Delete:

Suggested Strategies
Strategy Cards
AI Confidence
Success Probability
Evidence Panel
Missing Information
Recommendation Cards
Approve Button
Reject Button

These belong only to Decision Architect.

Decision Architect

Create a completely separate workspace.

Only Decision Architects can access:

Queue of pending submissions

AI Analysis

Evidence

Confidence Score

Missing Information

Organizational Memory

Suggested Strategies

Approve

Reject

Request More Information

Store into Company Memory

UX Philosophy

The application should feel like Apple-level simplicity.

Every user should immediately know:

"I submit."

or

"I review."

Never mix both workflows.

The interface should feel calm, minimal, role-based, and require almost no learning.

Every page should answer only one question:

For Decision Contributor:
"What is the status of my submission?"

For Decision Architect:
"What is the best decision to make?"

Avoid clutter, avoid exposing internal AI workflows to contributors, and maintain a clean enterprise SaaS experience. Redesign the current prototype to make the workflow realistic, enterprise-grade, and extremely easy to understand. Keep the existing visual style but improve the UX and business flow.

Decision Contributor Dashboard

Currently the dashboard shows the complete 6-step lifecycle.

This is confusing because the contributor only owns the first part of the workflow.

Replace it with:

Your Responsibility

Capture
↓

Submit
↓

Track Status

Instead of showing

Capture → Submit → AI Analysis → Review → Approved → Memory

show

Submission Status

Submitted
↓

AI Processing

↓

Under Review

↓

Approved
↓

Stored in Company Memory

The first section tells the user what THEY do.

The second section simply tracks the status.

Much easier.

New Submission Flow

Current flow

Step 1
Who is this about?

Step 2
Upload anything

Step 3
What happened?

This feels disconnected.

Replace with

Step 1

Business Context

Choose

Customer

Partner

Vendor

Internal Team

Project

Then select

Customer Name

Decision Type

Renewal

Pricing

Complaint

Upsell

Feature Request

Other

Step 2

Evidence

Upload

Meeting Notes

CRM Notes

Emails

Call Transcript

Documents

Screenshots

Free Text

Everything should feel like

"Provide evidence."

Step 3

Situation Summary

Describe

What happened?

Who was involved?

What decision is needed?

Expected outcome

Priority

Revenue impact (optional)

Submit

Instead of

"What happened"

call it

"Business Summary"

My Submissions

Improve cards.

Each submission should show

Customer

Decision Type

Priority

Current Status

Created Date

Assigned Decision Architect

Progress

Small status chip

Example

TechCorp

Pricing Discussion

Status

Waiting for Review

Assigned to

James Chen

Submitted

2 hours ago

Only after approval

show

Approved Strategy

Reason

Approved by

No AI suggestions.

No confidence.

No recommendations.

Decision Architect Dashboard

Current dashboard lets Architect immediately Approve or Reject.

This is bad UX.

Never allow approval directly.

Instead

Pending card should contain

Customer

Revenue

Priority

Submitted by

Current Risk

Review

Replace

Approve

Reject

with

Open Review

or

Review Decision

Only after opening the full review page should the Architect see

Evidence

AI Analysis

Strategies

Confidence

Approve

Reject

Request More Info

This matches real enterprise approval systems.

Decision Architect Dashboard

Instead of

Approve

Reject

Full Review

make it

Review Decision

One button only.

Inside the review page

Approve

Reject

Need More Information

Login Page

Do not use abbreviations.

Instead of

DA

DC

show

Role

○ Decision Contributor

Captures business situations and submits them for review.

○ Decision Architect

Reviews AI recommendations and approves organizational decisions.

Add a short description below each role.

Better Role Separation

Decision Contributor

Dashboard

New Submission

My Submissions

Profile

Decision Architect

Dashboard

Pending Reviews

Company Memory

Insights

Department Settings

Never mix contributor and architect pages.

Better Labels

Rename

New Submission

→ Capture Decision

My Submissions

→ My Decisions

Dashboard

→ Work Queue

View

→ Track

or

Open

Full Review

→ Review Decision

Company Memory

→ Organizational Memory

Better Empty States

Instead of empty white pages

show helpful messages.

Example

"No decisions waiting for approval."

"No pending submissions."

"No similar organizational memories found."

Overall UX Philosophy

The product should feel like Apple designed it.

Every page should answer only one question.

Decision Contributor:

"What do I need to capture?"

Decision Architect:

"What decision should I review next?"

Never overwhelm users with unnecessary workflow steps.

Keep navigation simple.

Minimize clicks.

Use progressive disclosure.

Only reveal advanced AI reasoning after opening a decision review.

The entire application should feel calm, modern, enterprise-grade, and immediately understandable without training.