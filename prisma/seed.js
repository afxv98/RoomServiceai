const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

const seedLeads = [
  {
    hotelName: 'The Dorchester',
    contactName: 'John Smith',
    role: 'General Manager',
    phone: '+44 20 7629 8888',
    mobile: '+44 7700 900123',
    email: 'j.smith@thedorchester.com',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    status: 'lead',
    value: 45000,
    nextActionDate: new Date('2026-01-25'),
    lastActivity: 'Lead created · 3 days ago',
    activities: [
      { type: 'lead_created', timestamp: new Date('2026-01-20T10:30:00Z'), user: 'Sarah Mitchell', note: 'Inbound from website' },
    ],
    notes: [],
  },
  {
    hotelName: "Claridge's",
    contactName: 'Emma Thompson',
    role: 'Director of Operations',
    phone: '+44 20 7107 8888',
    mobile: '+44 7700 900456',
    email: 'e.thompson@claridges.co.uk',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    status: 'contacted',
    value: 52000,
    nextActionDate: new Date('2026-01-24'),
    lastActivity: 'SMS sent · 1 day ago',
    activities: [
      { type: 'lead_created', timestamp: new Date('2026-01-18T09:00:00Z'), user: 'Tom Harrison', note: null },
      { type: 'sms_sent', timestamp: new Date('2026-01-22T14:30:00Z'), user: 'Tom Harrison', note: 'Intro follow-up message sent' },
    ],
    notes: [
      { text: 'Very interested in AI voice ordering', timestamp: new Date('2026-01-19T11:00:00Z'), user: 'Tom Harrison' },
    ],
  },
  {
    hotelName: 'The Savoy',
    contactName: 'Michael Roberts',
    role: 'F&B Director',
    phone: '+44 20 7836 4343',
    mobile: '+44 7700 900789',
    email: 'm.roberts@thesavoy.co.uk',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    status: 'demo',
    value: 58000,
    nextActionDate: new Date('2026-01-26'),
    lastActivity: 'Demo scheduled · Today',
    activities: [
      { type: 'lead_created', timestamp: new Date('2026-01-15T10:00:00Z'), user: 'Lisa Wang', note: null },
      { type: 'call_made', timestamp: new Date('2026-01-17T15:30:00Z'), user: 'Lisa Wang', note: 'Spoke with decision maker, very positive', duration: 720 },
      { type: 'demo_scheduled', timestamp: new Date('2026-01-23T09:00:00Z'), user: 'Lisa Wang', note: 'Demo set for Jan 26 at 2pm GMT' },
    ],
    notes: [
      { text: 'Currently using manual room service system', timestamp: new Date('2026-01-17T16:00:00Z'), user: 'Lisa Wang' },
      { text: 'Interested in Simphony integration', timestamp: new Date('2026-01-17T16:05:00Z'), user: 'Lisa Wang' },
    ],
  },
  {
    hotelName: 'The Ritz Paris',
    contactName: 'Marie Dubois',
    role: 'Directrice Générale',
    phone: '+33 1 43 16 30 30',
    mobile: '+33 6 12 34 56 78',
    email: 'm.dubois@ritzparis.com',
    city: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    status: 'proposal',
    value: 62000,
    nextActionDate: new Date('2026-01-25'),
    lastActivity: 'Proposal sent · 2 days ago',
    activities: [
      { type: 'lead_created', timestamp: new Date('2026-01-10T14:00:00Z'), user: 'Sarah Mitchell', note: null },
      { type: 'email_sent', timestamp: new Date('2026-01-12T10:00:00Z'), user: 'Sarah Mitchell', note: 'Initial intro email' },
      { type: 'call_made', timestamp: new Date('2026-01-14T11:30:00Z'), user: 'Sarah Mitchell', note: 'Discovery call completed', duration: 1800 },
      { type: 'demo_completed', timestamp: new Date('2026-01-18T15:00:00Z'), user: 'Sarah Mitchell', note: 'Full product demo, very engaged' },
      { type: 'proposal_sent', timestamp: new Date('2026-01-21T09:00:00Z'), user: 'Sarah Mitchell', note: 'Custom proposal for 150 rooms' },
    ],
    notes: [
      { text: 'Luxury property, high standards', timestamp: new Date('2026-01-14T12:00:00Z'), user: 'Sarah Mitchell' },
      { text: 'Need French language support', timestamp: new Date('2026-01-14T12:05:00Z'), user: 'Sarah Mitchell' },
      { text: 'Budget approved, waiting on legal review', timestamp: new Date('2026-01-21T09:30:00Z'), user: 'Sarah Mitchell' },
    ],
  },
  {
    hotelName: 'Four Seasons NYC',
    contactName: 'David Johnson',
    role: 'VP of Food & Beverage',
    phone: '+1 212 758 5700',
    mobile: '+1 917 555 0199',
    email: 'd.johnson@fourseasons.com',
    city: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    status: 'won',
    value: 75000,
    nextActionDate: null,
    lastActivity: 'Deal won · 5 days ago',
    activities: [
      { type: 'lead_created', timestamp: new Date('2025-12-15T10:00:00Z'), user: 'Tom Harrison', note: null },
      { type: 'call_made', timestamp: new Date('2025-12-18T14:00:00Z'), user: 'Tom Harrison', note: 'Initial discovery call', duration: 900 },
      { type: 'demo_scheduled', timestamp: new Date('2025-12-20T10:00:00Z'), user: 'Tom Harrison', note: null },
      { type: 'demo_completed', timestamp: new Date('2026-01-05T16:00:00Z'), user: 'Tom Harrison', note: 'Demo went excellent' },
      { type: 'proposal_sent', timestamp: new Date('2026-01-08T09:00:00Z'), user: 'Tom Harrison', note: 'Enterprise tier proposal' },
      { type: 'stage_changed', timestamp: new Date('2026-01-18T11:00:00Z'), user: 'Tom Harrison', note: 'Contract signed!' },
    ],
    notes: [
      { text: 'Decision maker, very technical', timestamp: new Date('2025-12-18T14:30:00Z'), user: 'Tom Harrison' },
      { text: 'Wants multi-language support (English, Spanish, French)', timestamp: new Date('2026-01-05T16:30:00Z'), user: 'Tom Harrison' },
      { text: 'Contract value: $75k setup + $5.2k MRR', timestamp: new Date('2026-01-18T11:15:00Z'), user: 'Tom Harrison' },
    ],
  },
  {
    hotelName: 'Peninsula Beverly Hills',
    contactName: 'Lisa Anderson',
    role: 'General Manager',
    phone: '+1 310 551 2888',
    mobile: '+1 310 555 0177',
    email: 'l.anderson@peninsula.com',
    city: 'Beverly Hills',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    status: 'lost',
    value: 48000,
    nextActionDate: null,
    lastActivity: 'Lost · 8 days ago',
    activities: [
      { type: 'lead_created', timestamp: new Date('2025-12-20T10:00:00Z'), user: 'Lisa Wang', note: null },
      { type: 'email_sent', timestamp: new Date('2025-12-22T09:00:00Z'), user: 'Lisa Wang', note: 'Initial outreach' },
      { type: 'call_made', timestamp: new Date('2026-01-05T11:00:00Z'), user: 'Lisa Wang', note: 'Discovery call', duration: 600 },
      { type: 'stage_changed', timestamp: new Date('2026-01-15T14:00:00Z'), user: 'Lisa Wang', note: 'Went with competitor' },
    ],
    notes: [
      { text: 'Price sensitive, comparing multiple vendors', timestamp: new Date('2026-01-05T11:30:00Z'), user: 'Lisa Wang' },
      { text: 'Lost to competitor - lower pricing', timestamp: new Date('2026-01-15T14:05:00Z'), user: 'Lisa Wang' },
    ],
  },
];

async function main() {
  console.log('Seeding CRM database...');

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.lead.deleteMany();

  for (const leadData of seedLeads) {
    const { activities, notes, ...lead } = leadData;

    await prisma.lead.create({
      data: {
        ...lead,
        activities: {
          create: activities,
        },
        notes: {
          create: notes,
        },
      },
    });
  }

  console.log(`Seeded ${seedLeads.length} leads with activities and notes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
