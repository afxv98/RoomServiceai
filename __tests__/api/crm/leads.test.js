/**
 * @jest-environment node
 */
import { GET, POST } from '../../../app/api/crm/leads/route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    lead: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

function makeRequest(body) {
  return {
    json: jest.fn().mockResolvedValue(body),
  };
}

const sampleLead = {
  id: 1,
  hotelName: 'Grand Hotel',
  contactName: 'Alice',
  email: 'alice@grandhotel.com',
  phone: '555-0100',
  mobile: null,
  role: 'Manager',
  city: 'Paris',
  country: 'France',
  timezone: 'Europe/Paris',
  status: 'lead',
  value: 5000,
  nextActionDate: null,
  lastActivity: 'Lead created · Just now',
  assignedToId: null,
  assignedTo: null,
  activities: [],
  notes: [],
  createdAt: new Date('2024-01-01'),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/crm/leads', () => {
  it('returns 200 with an array of leads', async () => {
    prisma.lead.findMany.mockResolvedValue([sampleLead]);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(1);
    expect(data[0].hotelName).toBe('Grand Hotel');
  });

  it('returns 200 with an empty array when no leads exist', async () => {
    prisma.lead.findMany.mockResolvedValue([]);

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('queries leads with activities, notes, and assignedTo included', async () => {
    prisma.lead.findMany.mockResolvedValue([]);
    await GET();

    expect(prisma.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          activities: expect.anything(),
          notes: expect.anything(),
          assignedTo: expect.anything(),
        }),
      })
    );
  });

  it('returns 500 when database throws', async () => {
    prisma.lead.findMany.mockRejectedValue(new Error('DB error'));

    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to fetch leads');
  });
});

describe('POST /api/crm/leads', () => {
  const newLeadBody = {
    hotelName: 'New Hotel',
    contactName: 'Bob',
    email: 'bob@newhotel.com',
    phone: '555-0200',
    role: 'Owner',
    city: 'London',
    country: 'UK',
    timezone: 'Europe/London',
    value: 3000,
    user: 'admin@example.com',
    assignedToId: null,
  };

  const createdLead = {
    ...sampleLead,
    id: 2,
    hotelName: 'New Hotel',
    contactName: 'Bob',
    activities: [{ id: 1, type: 'lead_created', note: 'Lead created manually' }],
  };

  it('returns 201 with the created lead', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);

    const req = makeRequest(newLeadBody);
    const res = await POST(req);

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.hotelName).toBe('New Hotel');
  });

  it('defaults timezone to UTC when not provided', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);
    const body = { ...newLeadBody };
    delete body.timezone;

    await POST(makeRequest(body));

    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ timezone: 'UTC' }),
      })
    );
  });

  it('defaults status to "lead"', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);
    await POST(makeRequest(newLeadBody));

    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'lead' }),
      })
    );
  });

  it('coerces string value to integer', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);
    await POST(makeRequest({ ...newLeadBody, value: '7500' }));

    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ value: 7500 }),
      })
    );
  });

  it('defaults value to 0 when value is invalid', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);
    await POST(makeRequest({ ...newLeadBody, value: 'not-a-number' }));

    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ value: 0 }),
      })
    );
  });

  it('creates an initial lead_created activity', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);
    await POST(makeRequest(newLeadBody));

    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          activities: {
            create: expect.objectContaining({ type: 'lead_created' }),
          },
        }),
      })
    );
  });

  it('uses "Admin" as default user when not provided', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);
    const body = { ...newLeadBody };
    delete body.user;
    await POST(makeRequest(body));

    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          activities: {
            create: expect.objectContaining({ user: 'Admin' }),
          },
        }),
      })
    );
  });

  it('sets nextActionDate to null when not provided', async () => {
    prisma.lead.create.mockResolvedValue(createdLead);
    const body = { ...newLeadBody };
    delete body.nextActionDate;
    await POST(makeRequest(body));

    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ nextActionDate: null }),
      })
    );
  });

  it('returns 500 when database throws', async () => {
    prisma.lead.create.mockRejectedValue(new Error('DB error'));

    const res = await POST(makeRequest(newLeadBody));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to create lead');
  });
});
