// import { ResponseType } from "@/lib/types/apiResponse";
// import { Request } from "@/lib/models/request";
// import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
// import { InvalidInputError, InvalidPaginationError } from "@/lib/errors/inputExceptions";

// Constants
// const PAGINATION_PAGE_SIZE = 6;

// const handleError = (e: any) => {
//   if (e instanceof InvalidInputError) {
//     return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
//   }
//   if (e instanceof InvalidPaginationError) {
//     return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
//   }
//   return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
// };

// GET /api/request - Fetch all requests with optional status filtering and pagination
// export async function GET(request: Request) {
//   const url = new URL(request.url);
//   const status = url.searchParams.get("status");
//   const page = parseInt(url.searchParams.get("page") || "1");

//   try {
//     // Validate pagination
//     if (page < 1) {
//       throw new InvalidPaginationError(page, PAGINATION_PAGE_SIZE);
//     }

//     // Build query for filtering by status (if provided)
//     let query = {};
//     if (status) {
//       query = { status };
//     }

//     // Fetch requests from the database with pagination
//     const requests = await Request.find(query)
//       .sort({ createdDate: -1 }) // Sort by created date (descending)
//       .skip((page - 1) * PAGINATION_PAGE_SIZE)
//       .limit(PAGINATION_PAGE_SIZE);

//     return new Response(JSON.stringify(requests), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (e) {
//     return handleError(e);
//   }
// }

// PUT /api/request - Create a new item request
// export async function PUT(request: Request) {
//   try {
//     const req = await request.json();
//     const { requestorName, itemRequested } = req;

//     if (!requestorName || !itemRequested) {
//       throw new InvalidInputError("Requestor name and item requested are required.");
//     }

//     const newRequest = new Request({
//       requestorName,
//       itemRequested,
//       createdDate: new Date(),
//       lastEditedDate: new Date(),
//       status: "pending",
//     });

//     await newRequest.save();

//     return new Response(JSON.stringify(newRequest), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (e) {
//     return handleError(e);
//   }
// }

// PATCH /api/request - Update the status of an item request
// export async function PATCH(request: Request) {
//   try {
//     const req = await request.json();
//     const { id, status } = req;

//     if (!id || !status || !['pending', 'completed', 'approved', 'rejected'].includes(status)) {
//       throw new InvalidInputError("Invalid parameters.");
//     }

//     // Update request status and last edited date
//     const updatedRequest = await Request.findByIdAndUpdate(
//       id,
//       { status, lastEditedDate: new Date() },
//       { new: true }
//     );

//     if (!updatedRequest) {
//       throw new InvalidInputError("Request not found.");
//     }

//     return new Response(JSON.stringify(updatedRequest), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (e) {
//     return handleError(e);
//   }
// }

// DELETE /api/requests/batch - Delete multiple requests
// export async function DELETE(request: Request) {
//   try {
//     const req = await request.json();
//     const { ids } = req;

//     if (!Array.isArray(ids) || ids.length === 0) {
//       throw new InvalidInputError("IDs array is required.");
//     }

//     // Delete multiple requests at once
//     const deletedRequests = await Request.deleteMany({ _id: { $in: ids } });

//     return new Response(JSON.stringify(deletedRequests), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (e) {
//     return handleError(e);
//   }
// }
