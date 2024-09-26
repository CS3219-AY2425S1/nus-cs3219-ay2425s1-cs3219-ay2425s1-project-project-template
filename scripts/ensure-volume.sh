#!/bin/sh

check_or_create_docker_volume() {
  local volume_name=$1

  # Check if the volume exists
  if docker volume inspect "$volume_name" > /dev/null 2>&1; then
    echo "Docker volume '$volume_name' already exists."
  else
    # Create the volume if it doesn't exist
    echo "Docker volume '$volume_name' does not exist. Creating it..."
    docker volume create "$volume_name"
    echo "Docker volume '$volume_name' created."
  fi
}

service_names=("user" "collab" "question")

for app in "${service_names[@]}"; do
  check_or_create_docker_volume "$app-db-docker"
done

