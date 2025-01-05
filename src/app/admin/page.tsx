"use client";

import React, { useEffect, useState } from "react";
import ItemRequestsTable from "@/components/tables/Table";
import Pagination from "@/components/molecules/Pagination";

type TableRow = {
  name: string;
  itemRequested: string;
  created: string;
  updated: string | null;
  status: string;
};

export default function ItemRequestsPage() {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/mock/request?page=${currentPage}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch requests`);
        }

        const result = await response.json();

        const formattedData = result.map((item: any) => ({
          name: item.requestorName,
          itemRequested: item.itemRequested,
          created: new Date(item.requestCreatedDate).toLocaleDateString(),
          updated: item.lastEditedDate
            ? new Date(item.lastEditedDate).toLocaleDateString()
            : null,
          status: item.status,
        }));

        setData(formattedData);

        setTotalRecords(result.length);

      } catch (error: any) {
        setError(error.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleStatusChange = async (index: number, value: string) => {
    const updatedData = [...data];
    updatedData[index].status = value;
    setData(updatedData);

    try {
      const response = await fetch("/api/mock/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: index + 1,
          status: value,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update status:", await response.text());
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Item Requests</h1>
      {error && <div className="text-red-500">{error}</div>}

      <ItemRequestsTable data={data} onStatusChange={handleStatusChange} />

      {/* Pagination component */}
      <Pagination
        pageNumber={currentPage}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={(newPage: number) => setCurrentPage(newPage)}
      />
    </div>
  );
}
