import React, { useState } from "react";
import Dropdown from "@/components/atoms/Dropdown";
import Checkbox from "@/components/atoms/Checkbox"; // Import the new Checkbox component

type TableRow = {
  id: number;
  name: string;
  itemRequested: string;
  created: string;
  updated: string | null;
  status: string;
};

interface TableProps {
  data: TableRow[];
  onStatusChange: (id: number, value: string) => void;
}

export default function ItemRequestsTable({ data, onStatusChange }: TableProps) {
  const statusOptions = ["Pending", "Approved", "Rejected", "Completed"];
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-200 text-orange-700";
      case "Approved":
        return "bg-yellow-200 text-yellow-700";
      case "Completed":
        return "bg-green-200 text-green-700";
      case "Rejected":
        return "bg-red-200 text-red-700";
      default:
        return "";
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(data.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="table-auto w-full border-collapse border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 border border-gray-200">
              <Checkbox
                onChange={handleSelectAll}
                checked={selectedRows.length === data.length}
                indeterminate={isIndeterminate}
              />
            </th>
            <th className="px-4 py-2 border border-gray-200">Name</th>
            <th className="px-4 py-2 border border-gray-200">Item Requested</th>
            <th className="px-4 py-2 border border-gray-200">Created</th>
            <th className="px-4 py-2 border border-gray-200">Updated</th>
            <th className="px-4 py-2 border border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } text-gray-800`}
            >
              <td className="px-4 py-2 border border-gray-200">
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleSelectRow(row.id)}
                  hoverColor={row.status === 'Pending' ? 'orange' : row.status === 'Approved' ? 'yellow' : row.status === 'Completed' ? 'green' : 'red'}
                />
              </td>
              <td className="px-4 py-2 border border-gray-200">{row.name}</td>
              <td className="px-4 py-2 border border-gray-200">{row.itemRequested}</td>
              <td className="px-4 py-2 border border-gray-200">{row.created}</td>
              <td className="px-4 py-2 border border-gray-200">{row.updated || "N/A"}</td>
              <td className={`px-4 py-2 border border-gray-200 ${getStatusColor(row.status)}`}>
                <Dropdown
                  options={statusOptions}
                  value={row.status}
                  onChange={(value) => onStatusChange(row.id, value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
