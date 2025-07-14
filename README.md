# ==================================
# Personal Notes & Bookmark API cURL Commands
# ==================================
# --- AUTHENTICATION ---
✅ 
# ✅ Register a new user

```bash
  curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123"
  }'

```


# ✅ Log in and get a token (save the token from the response!)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'
```
📌 Response includes a token — save it and include it as a Bearer token in headers for the following endpoints.

# --- NOTES ---
# ✅ Create a new note
```bash

curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This note was created via cURL.",
    "tags": ["personal", "work"]
  }'
```

# ✅ Get all notes
```bash

curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer <TOKEN>"
  ```
# ✅ Get a note by ID
```bash

curl -X GET http://localhost:5000/api/notes/<NOTE_ID> \
  -H "Authorization: Bearer <TOKEN>"

```
# ✅ Update a note
```bash

curl -X PUT http://localhost:5000/api/notes/<NOTE_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content",
    "tags": ["updated"]
  }'
```

# ✅ Delete a note
```bash

curl -X DELETE http://localhost:5000/api/notes/<NOTE_ID> \
  -H "Authorization: Bearer <TOKEN>"
```
# ✅ Toggle a note's favorite status
```bash

curl -X PATCH http://localhost:5000/api/notes/<NOTE_ID>/favorite \
  -H "Authorization: Bearer <TOKEN>"

```
# --- BOOKMARKS ---

# Create Bookmark
```bash

curl -X POST http://localhost:5000/api/bookmarks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "description": "MDN Docs for JS",
    "tags": ["docs", "js"]
  }'

```
# Get All Bookmarks
```bash

curl -X GET http://localhost:5000/api/bookmarks \
  -H "Authorization: Bearer <TOKEN>"

```

# Get Bookmark by ID
```bash

curl -X GET http://localhost:5000/api/bookmarks/<BOOKMARK_ID> \
  -H "Authorization: Bearer <TOKEN>"
```
# Update Bookmark
```bash

curl -X PUT http://localhost:5000/api/bookmarks/<BOOKMARK_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://updated-url.com",
    "description": "Updated description",
    "tags": ["updated"]
  }'
```
✅ 
# ✅ Delete a bookmark
```bash

curl -X DELETE http://localhost:5000/api/bookmarks/<BOOKMARK_ID> \
  -H "Authorization: Bearer <TOKEN>"
```
# ✅ Toggle a bookmark's favorite status
```bash

curl -X PATCH http://localhost:5000/api/bookmarks/<BOOKMARK_ID>/favorite \
  -H "Authorization: Bearer <TOKEN>"```
