"use client";

import React, { useEffect, useState } from "react";
import ItemRequestsTable from "@/components/tables/Table";
import Pagination from "@/components/molecules/Pagination";
import { RequestStatus } from "@/lib/types/request";
import mockItemRequests from "@/app/api/mock/data";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

type TableRow = {
  id: number;
  name: string;
  itemRequested: string;
  created: string;
  updated: string | null;
  status: string;
};

const statuses = ["Pending", "Approved", "Rejected", "Completed"];

export default function ItemRequestsPage() {
  const [data, setData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Default to "All"

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

        const statusMapping = {
          [RequestStatus.APPROVED]: "Approved",
          [RequestStatus.PENDING]: "Pending",
          [RequestStatus.REJECTED]: "Rejected",
          [RequestStatus.COMPLETED]: "Completed",
        };
        
        const formattedData = mockItemRequests.map((item: any) => ({
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
        const paginatedData = formattedData.slice(
          (currentPage - 1) * PAGINATION_PAGE_SIZE,
          currentPage * PAGINATION_PAGE_SIZE
        );
        setFilteredData(paginatedData);
      } catch (error: any) {
        setError(error.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleStatusChange = async (id: number, value: string) => {
    const updatedData = [...data];
    const index = updatedData.findIndex((item) => item.id === id);
    if (index !== -1) {
      updatedData[index].status = value;
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
    }
  };

  const handleTabClick = (status: string) => {
    setSelectedStatus(status);
    if (status === "") {
      const paginatedData = data.slice(
        (currentPage - 1) * PAGINATION_PAGE_SIZE,
        currentPage * PAGINATION_PAGE_SIZE
      );
      setFilteredData(paginatedData);
      setTotalRecords(data.length);
    } else {
      const filteredData = data.filter((item) => item.status === status);
      const paginatedData = filteredData.slice(
        (currentPage - 1) * PAGINATION_PAGE_SIZE,
        currentPage * PAGINATION_PAGE_SIZE
      );
      setFilteredData(paginatedData);
      setTotalRecords(filteredData.length);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (selectedStatus === "") {
      const paginatedData = data.slice(
        (newPage - 1) * PAGINATION_PAGE_SIZE,
        newPage * PAGINATION_PAGE_SIZE
      );
      setFilteredData(paginatedData);
    } else {
      const filteredData = data.filter((item) => item.status === selectedStatus);
      const paginatedData = filteredData.slice(
        (newPage - 1) * PAGINATION_PAGE_SIZE,
        newPage * PAGINATION_PAGE_SIZE
      );
      setFilteredData(paginatedData);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Item Requests</h1>
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
            key={status}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 hover:text-white`}
            onClick={() => handleTabClick(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Item Requests Table */}
      <ItemRequestsTable data={filteredData} onStatusChange={handleStatusChange} />

      {/* Pagination component */}
      <div className="mt-4">
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
