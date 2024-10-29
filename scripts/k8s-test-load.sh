#!/bin/sh

ns=peerprep

load_test_service() {
  service_name=$1
  port=$2
  if [[ -z $service_name || -z $port ]]; then
    echo "Improper args: load_test_service <SERVICE_NAME> <POD>"
    exit 1
  fi

  kubectl run -i \
    --tty "$service_name-service-load-test" \
    --rm \
    -n $ns \
    --image=busybox \
    --labels="peerprep.network.$service_name-api=true" \
    --restart=Never \
    -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://$service_name-service:$port/health && echo; done"
}

load_test_service user 9001
