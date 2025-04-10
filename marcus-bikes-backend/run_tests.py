import os
import sys
import pytest

if __name__ == "__main__":
    # Get the absolute path to the backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Add the backend directory to the Python path
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
    
    # Set PYTHONPATH environment variable
    os.environ["PYTHONPATH"] = backend_dir
    
    # Run the tests
    sys.exit(pytest.main(["tests"])) 