# https://github.com/PaulBratslavsky/getting-started-with-knex-and-postgress?tab=readme-ov-file
podman run -d --name=CyclePaths_DB --replace -e POSTGRES_PASSWORD=123abc456efg -p 5432:5432 postgres:17.6-alpine3.22;
# run migrations