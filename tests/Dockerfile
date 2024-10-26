FROM python:3.12.7-alpine3.20
COPY . /tests
WORKDIR /tests
RUN pip install -r requirements.txt

CMD ["python3", "run_tests.py"]