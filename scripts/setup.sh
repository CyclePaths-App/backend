echo "Downloading container (if not downloaded already), and starting the container."
podman run -d --name=CyclePaths_DB --replace -e POSTGRES_PASSWORD=123abc456efg -p 5432:5432 postgis/postgis:17-3.6-alpine;

echo "Waiting for PostgreSQL to be ready..."
until podman exec CyclePaths_DB pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "Creating database inside Postgresql..."
echo 'CREATE DATABASE cyclepaths_db;\q' | podman exec -it CyclePaths_DB psql -U postgres;

echo "Running migration..."
knex migrate:latest > /dev/null 2>&1 # Eating the output garbage to make it prettier. If you need to debug the migrations, get rid of ``> /dev/null 2>&1`
echo "Database setup :)"