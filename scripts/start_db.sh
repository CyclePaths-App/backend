podman run -d --name CyclePaths_db --replace -e POSTGRES_PASSWORD=123abc456efg -p 5432:5432 postgres:17.2;
# run migrations