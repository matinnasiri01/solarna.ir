# Solar PV Lead Generation Platform - MVP Specification

## Overview

The goal of this project is to create a simple solar/PV lead generation platform.

The user journey is:

```text
Visitor
   ↓
PV Calculator
   ↓
Request Form
   ↓
Telegram Notification
   ↓
Admin Contacts Customer
```

This is not a SaaS platform.

This is a lead-generation website designed to collect customer requests and notify the administrator instantly.

---

# Phase 1 Scope

## Public Website

### Home Page

Route:

```text
/
```

Sections:

* Hero Section
* Solar Energy Benefits
* About Solar Systems
* Calculator CTA
* Request CTA
* Contact Information

---

### PV Calculator

Route:

```text
/calculator
```

Purpose:

Estimate the required solar system based on the user's monthly electricity bill.

Inputs:

* Monthly Electricity Bill (USD or IRR)
* City
* Property Type

Outputs:

* Estimated System Size (kW)
* Estimated Annual Production
* Estimated Annual Savings
* Estimated Payback Period

Implementation:

* Frontend calculation
* JavaScript only
* No AI required

---

### Request Form

Route:

```text
/request
```

Fields:

```text
Name
Phone Number
City
Monthly Electricity Bill
Calculator Result
Notes
```

Submission Flow:

```text
User Submit
    ↓
Backend API
    ↓
Save to PostgreSQL
    ↓
Push Event to Redis Queue
    ↓
Telegram Worker
    ↓
Telegram Notification
```

---

# User Authentication

No public user accounts.

Not required:

* User Registration
* User Login
* Email Verification
* Password Reset
* User Dashboard

Only one administrator exists.

---

# Admin Panel

Route:

```text
/admin
```

Purpose:

Manage incoming requests.

---

## Dashboard

Display:

```text
Today's Requests
This Week's Requests
This Month's Requests
Total Requests
```

---

## Requests Page

Table Columns:

```text
Name
Phone
City
Status
Created At
```

Statuses:

```text
New
Contacted
Closed
```

---

## Request Details

Fields:

```text
Name
Phone
City
Monthly Bill
Calculator Result
Notes
Created At
Status
```

---

# Admin Authentication

Single administrator only.

Implementation:

```text
Username
Password
JWT Cookie Session
```

No roles.

No RBAC.

No multi-user support.

---

# Analytics

## Recommended

Plausible Analytics

Track:

```text
Visitors
Calculator Usage
Form Submissions
Conversion Rate
```

Alternative:

Google Analytics 4

---

# SEO Requirements

Pages:

```text
/
/calculator
/request
```

Future:

```text
/solar-panels
/blog
/guides
```

---

## Meta Tags

Every page should include:

```html
<title>
<meta name="description">
<meta property="og:title">
<meta property="og:description">
<meta property="og:image">
<link rel="canonical">
```

---

## Sitemap

```text
/sitemap.xml
```

---

## Robots

```text
/robots.txt
```

---

## Structured Data

Use JSON-LD:

```text
Organization
LocalBusiness
FAQPage
```

---

# Technology Stack

## Frontend

```text
HTML
CSS
Alpine.js
Go Templates
```

Alternative:

```text
HTML
CSS
HTMX
Go Templates
```

No React.

No Vue.

No Next.js.

---

## Backend

```text
Go 1.24+
Chi Router
PostgreSQL
Redis
```

---

## Notifications

```text
Telegram Bot
Redis Queue
Background Worker
```

Notification Flow:

```text
Request Created
      ↓
PostgreSQL Save
      ↓
Redis Queue
      ↓
Worker
      ↓
Telegram Bot
```

---

# Database Design

## Table: requests

```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    monthly_bill NUMERIC NOT NULL,
    calculator_result JSONB,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Table: admins

```sql
CREATE TABLE admins (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

# Telegram Message Example

```text
🔔 New Solar Request

Name: John Doe
Phone: +98XXXXXXXXXX

City: Tehran

Monthly Bill:
500 USD

Estimated System:
8.5 kW

Notes:
Need installation quote

Created:
2026-06-04 12:30
```

---

# API Design

## Public APIs

```http
POST /api/v1/calculate
POST /api/v1/request
```

---

## Admin APIs

```http
POST /api/v1/admin/login

GET /api/v1/admin/requests

GET /api/v1/admin/requests/{id}

PATCH /api/v1/admin/requests/{id}
```

---

# Architecture

## Phase 1

Single Monolith

```text
web
├── API
├── Admin Panel
├── Telegram Worker
├── Authentication
├── PostgreSQL
└── Redis
```

Reason:

* Faster development
* Easier deployment
* Lower maintenance
* Easier debugging

Microservices are unnecessary at this stage.

---

# Future Architecture

After growth:

```text
Gateway
   │
   ├── Request Service
   ├── Calculator Service
   ├── Notification Service
   └── Blog Service
```

Communication:

```text
gRPC
```

Only introduce microservices when real traffic justifies the complexity.

---

# Clean Architecture Structure

```text
cmd/
└── server/

internal/

├── config/

├── domain/
│   ├── request/
│   ├── admin/
│   └── calculator/

├── usecase/
│   ├── request/
│   ├── admin/
│   └── calculator/

├── repository/
│   ├── postgres/
│   └── redis/

├── delivery/
│   ├── http/
│   ├── middleware/
│   └── templates/

├── worker/
│   └── telegram/

└── auth/

web/
├── templates/
├── static/
│   ├── css/
│   ├── js/
│   └── images/

migrations/
```

---

# Deployment

Infrastructure:

```text
Nginx
    ↓
Go Application
    ↓
PostgreSQL

Redis
    ↓
Telegram Worker
```

Containerized with:

```text
Docker
Docker Compose
```

Services:

```text
app
postgres
redis
worker
nginx
```

Deploy to:

* VPS
* Hetzner
* DigitalOcean
* Contabo

Single VPS is sufficient for Phase 1.

---

# Development Roadmap

## Week 1

* Home Page
* Calculator
* Request Form
* PostgreSQL Integration
* Telegram Notifications

---

## Week 2

* Admin Panel
* Analytics
* SEO
* Docker Setup
* Production Deployment
* Automated Backups

---

# Out of Scope (Future Features)

Not included in MVP:

* Public User Accounts
* Forum
* Blog
* Multi-language Support
* AI Recommendations
* Multi-admin Support
* Payment Processing
* Microservices

These features should be introduced only after validating demand and receiving real customer requests.

---

# Success Metric

The MVP is successful when:

```text
Visitor
    ↓
Uses Calculator
    ↓
Submits Request
    ↓
Telegram Notification Received
    ↓
Admin Contacts Customer
```

Everything else is secondary.
