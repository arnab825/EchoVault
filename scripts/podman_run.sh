#!/usr/bin/env bash
set -e

echo "========================================="
echo " Starting EchoVault on Podman Desktop    "
echo "========================================="

# Validate compose configuration
podman compose config

# Build and start services in background
podman compose up --build -d

echo ""
echo "EchoVault containers are running:"
podman compose ps
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "To view logs: podman compose logs -f"
echo "To stop:      podman compose down"
