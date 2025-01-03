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
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Item Requests</h1>
      <ItemRequestsTable data={data} onStatusChange={handleStatusChange} />
    </div>
  );
}
