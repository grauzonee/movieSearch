# Background File Ingestion and Search Service

A Node.js service that processes uploaded CSV/JSON files asynchronously with a Redis-backed queue, indexes the data into OpenSearch, and provides a search API.

## Features
- Async background processing with [BullMQ](https://docs.bullmq.io/)
- Streaming CSV/JSON parsing for large files
- OpenSearch indexing for fast queries
- REST API for upload, status, and search

## Tech Stack
Node.js · Express · Redis · BullMQ · OpenSearch · Multer

## How It Works
1. **Upload** – File sent to `/upload` → stored temporarily → job added to Redis.
2. **Process** – Worker reads, transforms, and indexes data into OpenSearch.
3. **Search** – Query `/search` to retrieve indexed records.

## API
- `POST /upload` – upload file, returns job ID
- `GET /status/:jobId` – check job status
- `GET /search?q=term` – search indexed data
