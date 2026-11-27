# CONSTRUCTA — Enterprise Construction Project Management System

**CONSTRUCTA** is an enterprise-grade Construction Project Management & Architectural Delivery SaaS interactive application engineered for architectural studios, general contractors, and structural engineering firms.

Inspired by interaction paradigms from **Linear**, **Asana**, **Monday.com**, and **Autodesk Construction Cloud**, CONSTRUCTA provides a refined, warm-neutral architectural interface tailored for capital works execution.

---

## 🏗️ Visual Identity & Palette

- **Primary Background**: `#F6F6F2` (Warm architectural paper)
- **Sidebar**: `#202824` (Deep charcoal-green)
- **Primary Accent**: `#A77B50` (Warm architectural bronze)
- **Secondary Accent**: `#657A6A` (Muted sage green)
- **Card Surfaces**: `#FFFFFF` with `#E7E9E3` thin borders
- **Primary Text**: `#242B27` (High contrast charcoal-ink)
- **Secondary Text**: `#777F79` (Architectural slate)
- **Status Accents**:
  - Success / Certified: `#5D8068`
  - Warning / In Progress: `#C28D4E`
  - Danger / Blocked / Overdue: `#C66C62`
  - Information / Deliverables: `#718B9A`
- **Typography**: **Inter** (data density and table alignment) & **Manrope** (geometric architectural headings).

---

## ⚡ Technology Stack

- **Frontend**: React.js with Vite (JavaScript only, NO TypeScript)
- **Styling**: Tailwind CSS v4 with custom architectural tokens
- **Routing**: React Router DOM (v7)
- **Analytics & Data Visualizations**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State & Data**: React Context + Reactive `localStorage` persistence

---

## 🔑 Demo Roles & Instant Login

| Role | Demo Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `anant@constructa.demo` | `Demo@123` | Full portfolio oversight, create/delete projects, manage team, system configuration. |
| **Admin** | `priya@constructa.demo` | `Demo@123` | Senior Lead Project Manager: task assignment, milestone gates, work review. |
| **Employee** | `rajesh@constructa.demo` | `Demo@123` | Senior Field Architect / Specialist: assigned deliverables, progress updates, report site blockers. |

> **Live Showcase Note**: You can switch roles instantaneously at any time using the role selector pills in the top navigation bar or sidebar profile menu without logging out.

---

## 📐 Modules & Features Implemented

1. **Dashboard (Executive & PM View)**:
   - Personalized welcome banner: *"Good morning, Anant"* with date selector and reporting period filters (`This Month`, `This Quarter`, `YTD`).
   - **6 Compact KPI Cards**:
     1. Total Projects (28)
     2. Active Projects (16)
     3. Completed Projects (7)
     4. On Hold / Delayed (5)
     5. Total Tasks (186)
     6. Overdue Tasks (12)
   - **Analytics & Visualizations**:
     - Project Progress Overview (horizontal status bars with percentages).
     - Task Status Distribution (Recharts interactive donut chart).
     - Monthly Deliverable Velocity (Recharts throughput comparison).
     - Project Timeline & Milestone Schedule.
   - Active Capital Projects with real construction imagery.
   - Deadlines & Urgent Items (overdue task tracking).
   - Recent Site Activity (live audit trail).
   - Engineering & Field Workload capacity meters.

2. **Employee Field Dashboard**:
   - Tailored workspace for field architects and engineers.
   - Quick action buttons on tasks: **Start Task**, **Update Progress (%)**, **Mark Done**, **Flag Blocker**.
   - Direct progress slider modal and blocker reporting dialog.

3. **Projects Portfolio (`/projects`)**:
   - Grid and Table view toggles.
   - Multi-filter by project status (In Progress, Delayed, Completed, Planning) and Project Manager.
   - Create and Edit Project Modal with photographic cover presets and staff assignments.
   - 22 realistic commercial, residential, and infrastructure capital projects.

4. **Project Details Workspace (`/projects/:id`)**:
   - Architectural banner with project code, type, location, date range, and manager.
   - 5 interactive tabs:
     1. **Overview**: Project charter, specifications, milestone pipeline, and crew roster.
     2. **Tasks**: Project-filtered tasks with Kanban and Table views + New Task trigger.
     3. **Milestones**: Construction phases with progress meters and target dates.
     4. **Team**: Assigned personnel with contact numbers and direct tasks count.
     5. **Activity**: Chronological event and inspection logs.

5. **Task Management & Kanban Board (`/tasks`)**:
   - 5-column Kanban board (**Pending**, **In Progress**, **Under Review**, **Completed**, **Blocked**) with native HTML5 drag-and-drop.
   - Table view with sorting by due date, priority, and progress %.
   - Filter by Project, Personnel, Priority, and Status.
   - **Slide-Over Task Drawer**: Description, status selector, progress slider, assigned members, simulated attachment upload, real comments discussion feed, and blocker flagging.

6. **Milestone Management (`/milestones`)**:
   - Construction stage gates: *Site Preparation*, *Foundation*, *Structural Steel & CLT Framing*, *Building Enclosure*, *Brickwork*, *Electrical & Plumbing*, *Commissioning*, *Certificate of Occupancy*.
   - Add and Edit Milestone modal with quick presets.

7. **Team Directory (`/team`)**:
   - Specialist directory with photos, designations, email, phone, capacity meters, and assigned projects.
   - Add/Edit team member modal and employee detail dialog.

8. **Reports & Analytics (`/reports`)**:
   - Project progress comparison chart.
   - Specialist output and deliverable throughput bar charts.
   - Detailed milestone completion audit table.
   - Working **CSV Export** for both projects and tasks.
   - Print Report trigger.

9. **Notifications Center (`/notifications`)**:
   - Real-time alerts for blocker reports, review submissions, overdue tasks, and milestone updates.
   - Filter by Unread, Blockers, Deadlines, and Completed.
   - Topbar badge and dropdown flyout with "Mark all read".

10. **Settings & Prototype Persistence (`/settings`)**:
    - Organization profile, general contractor license #, headquarters hubs.
    - Automated notification dispatch preferences.
    - One-click **Reset Prototype Data** button.
    - Full localStorage persistence across browser refreshes.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone <YOUR_REMOTE_URL>
cd constructa-app

# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```
