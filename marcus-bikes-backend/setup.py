from setuptools import setup, find_packages

setup(
    name="marcus-bikes-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "pydantic",
        "python-dotenv",
        "psycopg2-binary",
    ],
) 