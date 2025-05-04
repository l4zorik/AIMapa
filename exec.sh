#!/bin/bash

# Spuštění aplikace v Dockeru
docker build -t aimapa .
docker run -p 3000:3000 aimapa
