# Question Service

## Pre-requisites

1. Python 3.12
2. [`pipx`](https://pipx.pypa.io/stable/installation/)
3. [Poetry](https://python-poetry.org/docs/#installing-with-pipx) -- _dependency management for Python_
4. Docker (for local MongoDB server)

---

## Quick start

> MongoDB is run locally as a Docker container -- Atlas may be used for production

1. Create a virtual environment

```bash
# install dependencies
poetry install
```

2. Create a local database

```bash
make db
```

<details>
    <summary>Without <code>make</code></summary>

    ```bash
    docker run --name question-db -p 27017:27017 -d \
    	-e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
    	-e MONGO_INITDB_ROOT_PASSWORD=secret \
    	-e MONGO_INITDB_DATABASE=questions_db \
    	-e INIT_QUESTION_COLLECTION=questions \
    	alxarkar/cs3219-ay2425s1-g40-question

    ```

</details>

3. Run the server

```bash
make server
```

<details>
    <summary>Without <code>make</code></summary>

    ```bash
    poetry run uvicorn question_service.main:app --reload
    ```

</details>

---

## Dev

### Adding packages

```bash
poetry add <package name>@version
poetry add -D <package name>@version

poetry remove <package name>
poetry remove -D <package name>
```

### Lint and format

```bash
make lint
make format
```

### Test

```
make test
```
