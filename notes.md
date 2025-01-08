# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [X] Read the README [please please please]
- [X] Something cool!
- [X] Back-end
  - [X] Minimum Requirements
    - [X] Setup MongoDB database
    - [X] Setup item requests collection
    - [X] `PUT /api/request`
    - [X] `GET /api/request?page=_`
  - [X] Main Requirements
    - [X] `GET /api/request?status=pending`
    - [X] `PATCH /api/request`
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes
- [X] Front-end
  - [X] Minimum Requirements
    - [X] Dropdown component
    - [X] Table component
    - [X] Base page [table with data]
    - [X] Table dropdown interactivity
  - [X] Main Requirements
    - [X] Pagination
    - [X] Tabs
  - [X] Above and Beyond
    - [X] Batch edits
    - [X] Batch deletes

# Notes

<!-- Notes go here -->


for the input data, make sure to include double quotes for the attribute names. for example,
for the PUT request, it should be 
{
    "requestorName": "Jane Doe",
    "itemRequested": "Flashlights"
}
and the input type would be JSON.