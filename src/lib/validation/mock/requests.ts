import {
  MockCreateItemRequest,
  MockRequestStatus,
} from "@/lib/types/mock/request";

function isValidMockString(str: any, lower?: number, upper?: number): boolean {
  if (typeof str !== "string" || str.trim() == "") {
    return false;
  }
  if ((lower && str.length < lower) || (upper && str.length > upper)) {
    return false;
  }
  return true;
}

function isValidMockName(name: string): boolean {
  return isValidMockString(name, 3, 30);
}

function isValidMockItemRequested(item: string): boolean {
  return isValidMockString(item, 2, 100);
}

export function isValidMockStatus(status: any): boolean {
  return (
    isValidMockString(status) &&
    Object.values(MockRequestStatus).includes(status as MockRequestStatus)
  );
}

export function isValidMockId(id: any): boolean {
  return typeof id === "number" && id > 0;
}

export function validateMockCreateItemRequest(
  request: any
): MockCreateItemRequest | null {
  if (!request.requestorName || !request.itemRequested) {
    return null;
  }
  if (
    !isValidMockName(request.requestorName) ||
    !isValidMockItemRequested(request.itemRequested)
  ) {
    return null;
  }
  const newCreateItemRequest: MockCreateItemRequest = {
    requestorName: request.requestorName,
    itemRequested: request.itemRequested,
  };
  return newCreateItemRequest;
}
