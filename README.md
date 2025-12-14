# CyclePaths-Backend

The backend.

## Running Instructions:

The backend is composed of two parts, the database and the backend.

### Initial setup:

Before you can run the code, you will need to make a [.env](./.env) file in the root directory of
the repository. Without this, many of the variables will not be set correctly and the code will
error out. Simply copy and paste the content from [.env.example](./.env.example) to a new file
called `.env`, and modify if necessary.

Also please make sure that you have `npm` and `podman` installed. You can check by running `npm -v`
and `podman -v` respectively.

Note: You should also be able to use `docker`, by simply replacing "podman" with "docker" in all
of the commands and scripts. However, this has not been tested, so if you try it let us know if it
works \:\)

### Setting up the database:

First run `npm i` to get all of the necessary dependencies.

Then run the script in `./scripts/setup.sh`. This will download the correct container and run
migrations on the database. (Note: if running directly from the terminal, you may have to run
`chmod +x ./scripts/setup.sh`)

### Running the backend:

First run `npm i`, if you haven't done so already, to install all the necessary dependencies.

Then you can run `npm run dev` to host the backend on port 8000 (or whichever one you specify in
the [.env](./.env) file), or you can run `npm run test` to run the testing suite.

Finally, if you want to build the container, you can run the script in [./scripts/build_backend.sh]
(./scripts/build_backend.sh). The backend container can then be run by running the commented out
command in the same file
(`podman run -d --name=CyclePaths_Backend --replace -p 8000:8000 cyclepaths-backend`).
