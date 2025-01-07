"use client";

import React, { useEffect, useState } from "react";
import ItemRequestsTable from "@/components/tables/Table";
import Pagination from "@/components/molecules/Pagination";
import { RequestStatus } from "@/lib/types/request";
import mockItemRequests from "@/app/api/mock/data";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import Dropdown from "@/components/atoms/Dropdown";
import Link from "next/link"; // Import Link for navigation
import Button from "@/components/atoms/Button"; // Import Button component
import { APP_PATHS } from "@/lib/constants/paths"; // Import your app paths

type TableRow = {
  id: number;
  name: string;
  itemRequested: string;
  created: string;
  updated: string | null;
  status: string;
};

interface MockItemRequest {
  id: number;
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: string | Date;
  lastEditedDate?: string | Date | null;
  status: RequestStatus;
}

const statuses = [
  { label: "Pending", color: "blue" },
  { label: "Approved", color: "blue" },
  { label: "Completed", color: "blue" },
  { label: "Rejected", color: "blue" },
];

export default function ItemRequestsPage() {
  const [data, setData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [markAsStatus, setMarkAsStatus] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const statusMapping = {
          [RequestStatus.APPROVED]: "Approved",
          [RequestStatus.PENDING]: "Pending",
          [RequestStatus.REJECTED]: "Rejected",
          [RequestStatus.COMPLETED]: "Completed",
        };

        const formattedData = mockItemRequests.map((item: MockItemRequest): TableRow => ({
          id: item.id,
          name: item.requestorName,
          itemRequested: item.itemRequested,
          created: new Date(item.requestCreatedDate).toLocaleDateString(),
          updated: item.lastEditedDate
            ? new Date(item.lastEditedDate).toLocaleDateString()
            : null,
          status: statusMapping[item.status as RequestStatus],
        }));

        setData(formattedData);
        setTotalRecords(formattedData.length);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "An unknown error occurred.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredResult = data;
    if (selectedStatus !== "") {
      filteredResult = data.filter((item) => item.status === selectedStatus);
    }
    setTotalRecords(filteredResult.length);
    const paginatedData = filteredResult.slice(
      (currentPage - 1) * PAGINATION_PAGE_SIZE,
      currentPage * PAGINATION_PAGE_SIZE
    );
    setFilteredData(paginatedData);
  }, [selectedStatus, data, currentPage]);

  const handleStatusChange = async (id: number, value: string) => {
    const updatedData = data.map(item => 
      item.id === id ? { ...item, status: value } : item
    );
    setData(updatedData);

    try {
      const response = await fetch("/api/mock/request", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: value.toLowerCase(),
        }),
      });

      if (!response.ok) {
        console.error("Failed to update status:", await response.text());
        setError("Failed to change status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Cannot change status.");
    }
  };

  const handleTabClick = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleMarkAsChange = (value: string) => {
    setMarkAsStatus(value);
    console.log(`Marked as ${value}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Item Requests</h1>

        <div className="flex items-center space-x-2">
          <span className="text-gray-700 whitespace-nowrap">Mark As</span>
          <div className="relative inline-block text-left w-32">
            <Dropdown
              options={statuses.map(status => status.label)}
              value={markAsStatus}
              onChange={handleMarkAsChange}
              placeholder="Status"
            />
          </div>
          <button
            className="bg-white hover:bg-white text-black p-2 rounded border border-black"
            onClick={() => console.log("Delete selected items")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="white">
              <path 
                fillRule="evenodd" 
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1=1=00=01v6a=10=20=0V8zm5-1a1=1=00=01v6a=10=20=0V8a=10=00=01z" 
                clipRule="evenodd"
                stroke="gray"
                strokeWidth="1"
              />
            </svg>
          </button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}
  
      {/* Status Tabs */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            selectedStatus === ""
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } hover:bg-blue-400 hover:text-white`}
          onClick={() => handleTabClick("")}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status.label}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === status.label
                ? `bg-${status.color}-500 text-white`
                : `bg-gray-200 text-gray-700`
            } hover:bg-${status.color}-400 hover:text-white`}
            onClick={() => handleTabClick(status.label)}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Pass the selected rows and handlers to ItemRequestsTable */}
      <ItemRequestsTable 
        data={filteredData} 
        onStatusChange={handleStatusChange} 
      />

      {/* Centered Back Button */}
      <div className="flex justify-center mt-4">
        <Link href={APP_PATHS.HOME}>
          <Button variant="inverted">Back to Home</Button>
        </Link>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-end">
        <Pagination
          pageNumber={currentPage}
          pageSize={PAGINATION_PAGE_SIZE}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}