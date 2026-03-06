/**
 * @jest-environment node
 */
import { GET, PUT, DELETE } from '../../../app/api/crm/leads/[id]/route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    lead: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    calendarEvent: {
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
  id: 5,
  hotelName: 'Beach Resort',
  contactName: 'Carol',
  email: 'carol@resort.com',
  status: 'lead',
  value: 8000,
  assignedToId: 10,
  nextActionDate: null,
  activities: [],
  notes: [],
  assignedTo: { id: 10, name: 'Rep1', email: 'rep1@example.com' },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/crm/leads/[id]', () => {
  it('returns 200 with the lead', async () => {
    prisma.lead.findUnique.mockResolvedValue(sampleLead);

    const res = await GET(null, { params: { id: '5' } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(5);
    expect(data.hotelName).toBe('Beach Resort');
  });

  it('queries by parsed integer id', async () => {
    prisma.lead.findUnique.mockResolvedValue(sampleLead);
    await GET(null, { params: { id: '5' } });

    expect(prisma.lead.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
    );
  });

  it('returns 404 when lead does not exist', async () => {
    prisma.lead.findUnique.mockResolvedValue(null);

    const res = await GET(null, { params: { id: '999' } });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Lead not found');
  });

  it('returns 500 when database throws', async () => {
    prisma.lead.findUnique.mockRejectedValue(new Error('DB error'));

    const res = await GET(null, { params: { id: '5' } });
    expect(res.status).toBe(500);
  });
});

describe('PUT /api/crm/leads/[id]', () => {
  beforeEach(() => {
    prisma.lead.findUnique.mockResolvedValue({
      nextActionDate: null,
      hotelName: 'Beach Resort',
      assignedToId: 10,
    });
    prisma.lead.update.mockResolvedValue(sampleLead);
  });

  it('returns 200 with updated lead', async () => {
    const req = makeRequest({ hotelName: 'Updated Resort' });
    const res = await PUT(req, { params: { id: '5' } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(5);
  });

  it('only includes defined fields in update data', async () => {
    const req = makeRequest({ hotelName: 'New Name' });
    await PUT(req, { params: { id: '5' } });

    const call = prisma.lead.update.mock.calls[0][0];
    expect(call.data).toHaveProperty('hotelName', 'New Name');
    expect(call.data).not.toHaveProperty('email');
    expect(call.data).not.toHaveProperty('phone');
  });

  it('coerces string value to integer', async () => {
    const req = makeRequest({ value: '12000' });
    await PUT(req, { params: { id: '5' } });

    const call = prisma.lead.update.mock.calls[0][0];
    expect(call.data.value).toBe(12000);
  });

  it('creates a calendar event when nextActionDate is newly set', async () => {
    prisma.calendarEvent.create.mockResolvedValue({});
    const futureDate = '2025-12-01T10:00:00.000Z';
    const req = makeRequest({ nextActionDate: futureDate });

    await PUT(req, { params: { id: '5' } });

    expect(prisma.calendarEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: expect.stringContaining('Reminder:'),
          type: 'reminder',
          leadId: 5,
        }),
      })
    );
  });

  it('does not create a calendar event when nextActionDate is not in the request', async () => {
    const req = makeRequest({ hotelName: 'Only Name Change' });
    await PUT(req, { params: { id: '5' } });

    expect(prisma.calendarEvent.create).not.toHaveBeenCalled();
  });

  it('returns 500 when database throws', async () => {
    prisma.lead.update.mockRejectedValue(new Error('DB error'));
    const res = await PUT(makeRequest({ hotelName: 'X' }), { params: { id: '5' } });
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/crm/leads/[id]', () => {
  it('returns 200 with success: true when deletion succeeds', async () => {
    prisma.lead.delete.mockResolvedValue({});

    const res = await DELETE(null, { params: { id: '5' } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('deletes by parsed integer id', async () => {
    prisma.lead.delete.mockResolvedValue({});
    await DELETE(null, { params: { id: '5' } });

    expect(prisma.lead.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });

  it('returns 500 when database throws', async () => {
    prisma.lead.delete.mockRejectedValue(new Error('DB error'));

    const res = await DELETE(null, { params: { id: '5' } });
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to delete lead');
  });
});
