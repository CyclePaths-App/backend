podman build ./ -t cyclepaths-backend
podman run -d --name=CyclePaths_Backend --replace -p 8000:8000 cyclepaths-backend
