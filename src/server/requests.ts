/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring



// same thing as server/mock but now replicating for the acutal Mongo API instead
// just removed "Mock" from the function names all the logic is the same

//import mockItemRequests from "@/app/api/mock/data";

// additonal import to allow for connection
import { connectToDatabase } from "@/lib/mongodb";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import { 
    EditStatusRequest,
    ItemRequest,
    RequestStatus } from "@/lib/types/request";
import { generateId, sortItemRequests} from "@/lib/utils/requests";
import paginate from "@/lib/utils/pagination";
import {
  isValidStatus,
  validateCreateItemRequest,
  validateEditStatusRequest,
} from "@/lib/validation/request";

export async function getItemRequests(
  status: string | null,
  page: number
): Promise<ItemRequest[]> {

    const db = await connectToDatabase();
    const collection = db.collection("requests");

    const query: any = {};
    if (status && isValidStatus(status)) {
        console.log("status", status)
        query.status = status;
    }

    const requests = await collection.find(query).toArray();

    // Convert to ItemRequest object based on import
    const typedRequests = requests.map(doc => ({
        // ill keep the id here but mongo already has the id
        // this id is numeric and follows the mock ID pattern (natural numbers)
        id: doc.id,
        requestorName: doc.requestorName,
        itemRequested: doc.itemRequested,
        requestCreatedDate: new Date(doc.requestCreatedDate),
        lastEditedDate: new Date(doc.lastEditedDate),
        status: doc.status
    } as ItemRequest));

    const sortedRequests = sortItemRequests(typedRequests)
    
    return paginate(sortedRequests, page, PAGINATION_PAGE_SIZE).data;
}

export async function createNewRequest(request: any): Promise<ItemRequest> {

    const validatedRequest = validateCreateItemRequest(request);
    if (!validatedRequest) {
        throw new InvalidInputError("created item request");
    }

    const db = await connectToDatabase();
    const collection = db.collection("requests");

    const requests = await collection.find().toArray();

    // Very similar to above
    const typedRequests = requests.map(doc => ({
        id: doc.id,
        requestorName: doc.requestorName,
        itemRequested: doc.itemRequested,
        requestCreatedDate: new Date(doc.requestCreatedDate),
        lastEditedDate: new Date(doc.lastEditedDate),
        status: doc.status
    } as ItemRequest));

    const nextId = generateId(typedRequests)

    const date = new Date();
    // this is the logic to create the new request and use validatedRequest and the newRequest
    // to override
    const newRequest: ItemRequest = {
        id: nextId,
        requestorName: validatedRequest.requestorName,
        itemRequested: validatedRequest.itemRequested,
        requestCreatedDate: date,
        lastEditedDate: date,
        status: RequestStatus.PENDING,
    };

    await collection.insertOne(newRequest);
    return newRequest;
}

export async function editStatusRequest(request: any): Promise<EditStatusRequest> {

    const validatedRequest = validateEditStatusRequest(request);
    if (!validatedRequest) {
        throw new InvalidInputError("edit item request");
    }

    const db = await connectToDatabase();
    const collection = db.collection("requests");
    
    const editedItemRequest = await collection.findOneAndUpdate(
        { id: validatedRequest.id },
        // as stated in BACKEND.md we need to also edit the lastEdited Date
        { $set: { status: validatedRequest.status, lastEditedDate: new Date() } },
        { returnDocument: "after" }
    );

    if (!editedItemRequest) {
        throw new InvalidInputError("edit item ID");
    }
    // return this new modified request
    return {
        id: editedItemRequest.id,
        status: editedItemRequest.status
    } as EditStatusRequest;
}
