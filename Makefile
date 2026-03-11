run:
	cd backend && uvicorn main:app --host 0.0.0.0 --port 8000

dev:
	cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

install:
	pip install -r requirements.txt
