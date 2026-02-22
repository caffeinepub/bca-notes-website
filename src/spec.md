# Specification

## Summary
**Goal:** Add PDF upload and management functionality organized by subject to BCA Hub.

**Planned changes:**
- Create backend data structure to store PDF files with subject, title, description, and file blob
- Implement backend CRUD operations for PDF management with admin-only access control
- Add admin panel interface for uploading and managing PDFs with subject selection
- Create public-facing interface for browsing and viewing PDFs organized by subject
- Implement React Query hooks for PDF operations following existing patterns

**User-visible outcome:** Admins can upload and manage PDF files organized by subject through the admin panel. Authenticated users can browse, filter, and view/download PDFs organized by subject through a new PDFs section in the navigation.
