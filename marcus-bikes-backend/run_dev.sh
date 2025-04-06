#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Seed the database
python seed.py

# Run the API server with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload 