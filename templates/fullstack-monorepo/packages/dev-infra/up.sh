#!/bin/bash

export DOCKER_GATEWAY_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.Gateway}}{{end}}' feelgood_reverse_proxy)
echo "Your docker gateway ip: $DOCKER_GATEWAY_IP"
cat ./docker-compose.yml | envsubst | (docker compose -f - up -d || docker-compose -f - up -d )