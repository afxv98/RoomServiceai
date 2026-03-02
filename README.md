# RoomService AI - Full Platform

A complete Next.js application for RoomService AI featuring a marketing landing page, Super Admin dashboard, and Hotel Manager dashboard.

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: JavaScript (not TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Outfit for headings, Inter for body)

## Project Structure

```
/app
  /page.js                          # Marketing landing page
  /login/page.js                    # Login page (shared)
  /admin/                           # Super Admin dashboard
    /layout.js
    /page.js
    /hotels/page.js
    /hotels/[id]/page.js
    /billing/page.js
    /crm/page.js
    /email/page.js
    /sales/page.js
    /support/page.js
    /settings/page.js
  /dashboard/                       # Hotel Manager dashboard
    /layout.js
    /page.js
    /orders/page.js
    /orders/[id]/page.js
    /menu/page.js
    /upsell/page.js
    /voice/page.js
    /rooms/page.js
    /staff/page.js
    /reports/page.js
    /settings/page.js
/components
  /landing/                         # Landing page components
  /admin/                           # Super Admin components
  /dashboard/                       # Hotel Manager components
  /shared/                          # Shared components
/lib
  /mockData.js                      # Mock data for all pages
```

## Features

### 1. Marketing Landing Page
- Professional hero section with animated chat demo
- Problem/solution sections
- Capabilities showcase
- Oracle Simphony integration section
- ROI calculator
- 6-tier pricing section
- Testimonials and CTA forms

### 2. Super Admin Dashboard
- Platform overview with KPIs
- Hotels management (list, detail with tabs)
- Billing and invoicing
- CRM pipeline (Kanban board)
- Email hub
- Sales commission tracking
- Support ticket management
- System settings

### 3. Hotel Manager Dashboard
- Hotel-specific overview
- Orders management (list and detail)
- Menu management with categories
- AI upsell settings
- Voice AI configuration
- Rooms & QR codes
- Staff management
- Reports & analytics
- Hotel settings

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Color Scheme

- Copper: #C2784F (primary accent)
- Charcoal: #1F2937 (text and dark backgrounds)
- Off-white: #F9FAFB (light backgrounds)

## Key Routes

- `/` - Marketing landing page
- `/login` - Login page (switch between Hotel Manager and Super Admin)
- `/admin` - Super Admin dashboard
- `/admin/hotels` - Hotels list
- `/admin/hotels/[id]` - Hotel detail with tabs
- `/dashboard` - Hotel Manager dashboard
- `/dashboard/orders` - Orders list
- `/dashboard/menu` - Menu management
- `/dashboard/upsell` - AI upsell settings
- `/dashboard/voice` - Voice AI settings

## Mock Data

All data is currently mocked in `/lib/mockData.js` including:
- Hotels
- Orders
- Menu items
- Rooms
- Staff members
- CRM leads
- Invoices
- Sales representatives
- Support tickets

## Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Collapsible sidebars on mobile
- Scrollable tables
- Stacked layouts on smaller screens

## Future Enhancements

- Connect to real backend API
- Implement authentication
- Add real-time order updates
- Integrate payment processing
- Add actual charting library
- Implement drag-and-drop for CRM pipeline

## Development Notes

- All interactive elements use `console.log` for demo purposes
- Forms submit with alerts for demo
- No actual API calls are made (all data is mocked)
- Session management is simulated via routing

## Support

For questions or issues, please contact support@roomserviceai.com
