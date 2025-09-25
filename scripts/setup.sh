# Create a postgresql container
podman run -d --name=CyclePaths_DB --replace -e POSTGRES_PASSWORD=123abc456efg -p 5432:5432 postgres:17.6-alpine3.22;\

# TODO: some nonsense to get it to create a database called `cyclepaths_db``
### inside container:
# ``` bash
# psql -U postgres          # open up the postgres interface
# CREATE TABLE cyclepaths_db;  # make the database
# \q                        # exit postgres interface
# exit;                     # exit container
# ```


# Run migration
knex migrate:latest