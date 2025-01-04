"use client";

import { useState } from "react";
import ItemRequestsTable from "@/components/tables/Table";

export default function ItemRequestsPage() {
  const initialData = [
    {
      name: "Alice",
      itemRequested: "Laptop",
      created: "2023-01-01",
      updated: "2023-01-02",
      status: "Pending",
    },
    {
      name: "Bob",
      itemRequested: "Books",
      created: "2023-01-03",
      updated: null,
      status: "Pending",
    },
    {
      name: "Charlie",
      itemRequested: "Headphones",
      created: "2023-01-05",
      updated: "2023-01-06",
      status: "Approved",
    },
  ];

  const [data, setData] = useState(initialData);

  const handleStatusChange = (index: number, value: string) => {
    const newData = [...data];
    newData[index].status = value;
    setData(newData);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Item Requests</h1>
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Mark as Status
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
      <ItemRequestsTable data={data} onStatusChange={handleStatusChange} />
    </div>
  );
}
