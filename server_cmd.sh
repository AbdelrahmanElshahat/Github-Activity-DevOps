#!/usr/bin/env bash
export version=$1
docker-compose -f docker-compose.yml up --detach
