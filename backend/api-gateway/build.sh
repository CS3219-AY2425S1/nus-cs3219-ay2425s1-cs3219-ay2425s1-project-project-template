#!/bin/bash

appimage=apigateway
containername="my-api-gateway"
containerPort=8000
localPort=8000

# remove existing containers if found
docker ps -a | grep $containername
if [[ $? == 0 ]]; then
    docker stop $containername
    docker rm $containername
fi

stop=$1
if [[ "x$stop" != "x" ]]; then
    echo "Container $containername terminated" 
    exit 0
fi


docker images | grep $appimage
if [[ $? == 0 ]]; then
    docker rmi $appimage
fi

docker build -t $appimage -f Dockerfile.dev .

docker run --name $containername -p $localPort:$containerPort -v $(pwd):/app -d $appimage