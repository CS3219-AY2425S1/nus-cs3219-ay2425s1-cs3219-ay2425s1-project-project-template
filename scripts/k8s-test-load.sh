#!/bin/sh

load_test_service() {
  service_name=$1
  if [[ -z $service_name ]]; then
    echo "Improper args: load_test_service <SERVICE_NAME>"
    exit 1
  fi

  kubectl run -i \
    --tty "$service_name-service-load-test" \
    --rm \
    --image=busybox \
    --labels="peerprep.network.$service_name-api=true" \
    --restart=Never \
    -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://$service_name-service/health; done"
}

load_test_service user
