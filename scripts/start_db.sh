echo "Staring container..."
podman start CyclePaths_DB

echo "Waiting for PostgreSQL to be ready..."
until podman exec CyclePaths_DB pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "Running migration..."
knex migrate:latest > /dev/null 2>&1 # Eating the output garbage to make it prettier. If you need to debug the migrations, get rid of ``> /dev/null 2>&1`
echo "Database setup :)"
