#!/usr/bin/env python
"""
Database migration script for Marcus Bikes Backend.
Run this script to apply all pending database migrations.
"""

import os
import sys
import subprocess

def run_migrations():
    """Run Alembic migrations to update the database schema."""
    print("Running database migrations...")
    
    try:
        # Execute the migration command
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            check=True,
            capture_output=True,
            text=True,
        )
        
        # Print output
        print(result.stdout)
        
        if result.stderr:
            print("Errors/Warnings:")
            print(result.stderr)
            
        print("Migration completed successfully!")
        return 0
        
    except subprocess.CalledProcessError as e:
        print(f"Migration failed with error code {e.returncode}")
        print(e.stdout)
        print("Error details:")
        print(e.stderr)
        return e.returncode

if __name__ == "__main__":
    # Change to the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Add the current directory to the Python path so that the app module can be found
    if script_dir not in sys.path:
        sys.path.insert(0, script_dir)
    
    # Set PYTHONPATH environment variable
    os.environ["PYTHONPATH"] = script_dir
    
    sys.exit(run_migrations()) 