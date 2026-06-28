Use this as your **master prompt** for Lovable/Bolt/Cursor/Figma AI.

---

# MASTER PROMPT

You are a Senior Staff Product Designer (Apple), Senior UX Researcher, and Principal SaaS Product Manager.

You are redesigning **DecisionOS**, an AI-powered Enterprise Decision Memory platform.

**DO NOT create new pages unnecessarily.**
**Improve the existing prototype while keeping the same design language.**

The goal is **absolute clarity**.
A first-time user should understand the product within **30 seconds**.

---

# Core Product

DecisionOS is **NOT a CRM.**

It is **Enterprise Decision Memory.**

Companies forget why they made important business decisions.

DecisionOS captures every important business discussion, extracts the final decision using AI, tracks outcomes, and helps future employees reuse organizational knowledge.

It answers questions like

* Why did we give Netflix a discount?
* Did that decision work?
* Have we solved this before?
* What happened last time?

Every decision becomes reusable organizational intelligence.

---

# Simplify Everything

Remove anything that feels like enterprise dashboard clutter.

Every screen must answer

> What does the user want to do next?

Never overwhelm the user.

Follow Apple's Human Interface principles.

Large whitespace.

Few actions.

Simple language.

Minimal clicks.

---

# Rename confusing wording

Replace

Record Decision

with

New Business Case

or

Capture Business Discussion

or

Analyze Business Situation

The word "Decision" should only appear after AI identifies it.

Users don't think

"I'll record a decision."

They think

"I just had a customer meeting."

---

# Two Roles ONLY

## 1. Decision Architect (DA)

One DA exists per department.

Examples

DA • Sales

DA • Finance

DA • HR

Responsibilities

* Review submissions
* Approve or reject
* Search Company Memory
* View AI Insights
* Configure department settings
* Manage Decision Contributors ONLY within their own department

Cannot

* Edit other department architects
* View confidential departments
* Change global system settings

---

## 2. Decision Contributor (DC)

Examples

DC • Sales

DC • Finance

Responsibilities

* Submit business discussions
* Upload meetings
* Track submission status
* View only their own submissions

Nothing else.

Very simple UI.

---

# Contributor Navigation

Dashboard

New Submission

My Submissions

Profile

No

Insights

Company Memory

Settings

Business Rules

Knowledge Sources

Approval Policies

---

# Architect Navigation

Dashboard

Pending Reviews

Company Memory

Insights

Department Settings

---

# Dashboard

Do NOT show meaningless metrics.

Instead show

Today's pending approvals

Recently approved decisions

AI warnings

Important business cases

Invisible AI banner

Example

"Three new submissions match situations where Sales historically outperformed Finance."

---

# New Submission Flow

The current form is cluttered.

Redesign it.

Step 1

Who is this about?

Customer

Project

Vendor

Internal Team

Step 2

Upload anything

Meeting Transcript

Email

PDF

Voice Recording

CRM Export

Notes

Drag & Drop.

AI detects format automatically.

Never ask users to classify files.

Step 3

One textbox

"What happened?"

Step 4

Submit

That's it.

---

# AI Analysis Screen

Instead of ChatGPT style

Show

Business Summary

Possible Decision

Confidence

Evidence Used

Missing Information

Similar Past Decisions

Recommended Actions

Users should trust AI.

---

# Company Memory

Current page looks like a database.

Redesign it completely.

Make it feel like

Google Search for company decisions.

Large search bar

Examples

Show all renewals where Finance disagreed.

Find pricing discussions with Amazon.

Show feature requests related to AI.

Search results display

Context

Decision

Outcome

Lessons

Evidence

People involved

AI summary

---

# Insights

Remove generic analytics.

Replace with actionable intelligence.

Examples

Pricing objections increased 38% this month.

Legal review before pricing increases win rate.

Renewals without executive sponsor fail twice as often.

These insights should help users make future decisions.

---

# Organizational Brain

Keep this feature.

Rename subtitle

"Patterns AI discovered across your company's history."

Only display

5–10 high-value discoveries.

Each insight should include

Confidence

Evidence Count

Business Impact

Example

Executive reviews improve enterprise renewals by 27%.

Observed in 48 similar cases.

---

# Remove Decision DNA

Remove it completely.

OR merge useful parts into Organizational Brain.

Decision DNA is confusing.

Judges will ask

"What does this actually do?"

---

# Similar Decisions

Every business case should automatically show

12 Similar Cases Found

Users can compare

Problem

Decision

Outcome

Revenue

Lessons

---

# Outcome Tracking

Every approved decision must later receive an outcome.

Success

Failure

Revenue

Retention

Time Saved

AI learns from outcomes.

Without this there is no Enterprise Decision Memory.

---

# Invisible AI

Never expose prompts.

Never show AI chat.

AI quietly works.

Examples

Before user clicks

"We found three similar situations."

"This customer matches a churn pattern."

"This proposal resembles a failed strategy from last year."

---

# Settings

Simplify drastically.

Department Settings only.

Include

## Team Members

Architect manages only contributors in their own department.

Cannot edit other architects.

---

## Knowledge Sources

Simple integrations

Salesforce

HubSpot

Slack

Teams

Notion

Google Drive

PDF

Word

Excel

Emails

Voice

Users simply connect.

AI indexes automatically.

---

Remove

Business Rules

Approval Policies

Unless absolutely necessary.

Hide advanced settings.

---

# Profile Card

Bottom left

Replace

Sales Representative

with

DA • Finance

DC • Sales

etc.

---

# Workflow

Decision Contributor

Dashboard

↓

New Submission

↓

Upload Discussion

↓

AI Analysis

↓

Submit

↓

Waiting for Review

---

Decision Architect

Dashboard

↓

Pending Reviews

↓

Review AI Analysis

↓

Approve

↓

Decision enters Company Memory

↓

Outcome tracked later

↓

AI learns

---

# Backend Logic

Submission

↓

Stored in PostgreSQL

↓

Files stored in cloud storage

↓

AI extracts

Summary

Decision

Participants

Evidence

Risk

↓

Embedding stored in Vector Database

↓

Searchable inside Company Memory

↓

Outcome updates

↓

Insights regenerated

---

# Final Goal

The application should feel like

**"The operating system for organizational decision-making."**

Not another CRM.

Not another dashboard.

Every screen should reinforce one idea:

**Capture → Learn → Remember → Reuse.**
