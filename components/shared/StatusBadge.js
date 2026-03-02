// Status badge component for displaying status with colors
export default function StatusBadge({ status }) {
  const statusConfig = {
    live: { bg: 'bg-green-100', text: 'text-green-800', label: 'Live' },
    trial: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Trial' },
    past_due: { bg: 'bg-red-100', text: 'text-red-800', label: 'Past Due' },
    paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
    new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
    ready: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Ready' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
    overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' },
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
    open: { bg: 'bg-red-100', text: 'text-red-800', label: 'Open' },
    resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
    lead: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Lead' },
    contacted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Contacted' },
    demo: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Demo' },
    proposal: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Proposal' },
    won: { bg: 'bg-green-100', text: 'text-green-800', label: 'Won' },
    lost: { bg: 'bg-red-100', text: 'text-red-800', label: 'Lost' },
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
