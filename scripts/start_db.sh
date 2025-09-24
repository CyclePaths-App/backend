# start up an already working container.
podman start CyclePaths_DB
# run migrations
sleep 1 # give the container a bit to set up.
knex migrate:latest
