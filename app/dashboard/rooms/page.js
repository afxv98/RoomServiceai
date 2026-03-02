'use client';

import Table from '@/components/shared/Table';
import Button from '@/components/shared/Button';
import { mockRooms } from '@/lib/mockData';
import { QrCode, Download, ToggleLeft, ToggleRight } from 'lucide-react';

export default function RoomsQRCodesPage() {
  const headers = ['Room Number', 'QR Active', 'Last Order', 'Actions'];

  const renderRow = (room, index) => (
    <tr key={index} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-bold">Room {room.number}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {room.qrActive ? (
          <span className="flex items-center gap-2 text-green-600">
            <ToggleRight className="w-6 h-6" />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-2 text-gray-400">
            <ToggleLeft className="w-6 h-6" />
            Inactive
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {room.lastOrder || <span className="text-gray-400">Never</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-2">
          <button
            onClick={() => console.log('View QR for room:', room.number)}
            className="text-copper hover:text-copper-hover text-sm font-medium"
          >
            View QR
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => console.log('Toggle QR for room:', room.number)}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            {room.qrActive ? 'Disable' : 'Enable'}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">
            Rooms & QR Codes
          </h1>
          <p className="text-gray-600">Manage QR codes for digital ordering</p>
        </div>
        <Button onClick={() => console.log('Download all QR codes')}>
          <Download className="w-4 h-4 mr-2" /> Download All QR Codes
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Rooms</h3>
            <QrCode className="w-5 h-5 text-copper" />
          </div>
          <p className="text-3xl font-bold">{mockRooms.length}</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">QR Codes Active</h3>
            <ToggleRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {mockRooms.filter((r) => r.qrActive).length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Orders via QR Today</h3>
            <QrCode className="w-5 h-5 text-copper" />
          </div>
          <p className="text-3xl font-bold">28</p>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 mb-6">
        <Table headers={headers} data={mockRooms} renderRow={renderRow} />
      </div>

      {/* QR Code Info */}
      <div className="bg-blue-50 p-6 rounded-sm border-l-4 border-blue-500">
        <h3 className="font-bold text-blue-900 mb-2">How QR Codes Work</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Each room has a unique QR code that links to the digital menu</li>
          <li>Guests scan the code with their phone to order without calling</li>
          <li>Orders are automatically routed to your kitchen system</li>
          <li>QR codes can be printed and placed in room service folders or stands</li>
        </ul>
      </div>
    </div>
  );
}
