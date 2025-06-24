#!/bin/bash

# Build lại Docker image (nếu cần)
# docker build -t my-node-app .

# Chạy container, ánh xạ cổng 3002:1110
docker run -p 3002:1110 my-node-app
