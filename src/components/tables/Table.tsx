import React from "react";
import Dropdown from "@/components/atoms/Dropdown";

type TableRow = {
  name: string;
  itemRequested: string;
  created: string;
  updated: string | null;
  status: string;
};

interface TableProps {
  data: TableRow[];
  onStatusChange: (index: number, value: string) => void;
}

export default function ItemRequestsTable({ data, onStatusChange }: TableProps) {
  const statusOptions = ["Pending", "Approved", "Rejected", "Completed"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-700";
      case "Approved":
        return "bg-green-200 text-green-700";
      case "Completed":
        return "bg-blue-200 text-blue-700";
      case "Rejected":
        return "bg-red-200 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="table-auto w-full border-collapse border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
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
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } text-gray-800`}
            >
              <td className="px-4 py-2 border border-gray-200">{row.name}</td>
              <td className="px-4 py-2 border border-gray-200">{row.itemRequested}</td>
              <td className="px-4 py-2 border border-gray-200">{row.created}</td>
              <td className="px-4 py-2 border border-gray-200">{row.updated || "N/A"}</td>
              <td className={`px-4 py-2 border border-gray-200 ${getStatusColor(row.status)}`}>
                <Dropdown
                  options={statusOptions}
                  value={row.status}
                  onChange={(value) => onStatusChange(index, value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
