# Kubernetes Instructions

## Prerequisites

- Minikube
  To run a local Kubernetes cluster, we
  recommend using Minikube on your local machine.

## Getting Started

1. Ensure that the Metrics Server add-on is enabled. Else, the autoscaling will not work.

2. For Minikube:

    ```sh
    minikube addons enable metric-server
    ```

3. For Kubernetes:

    ```sh
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
    ```

4. Run the command from the project root:

    ```sh
    make k8s-up
    ```

5. Run the load test script:

    ```sh
    ./scripts/k8s-load-test.sh
    ```

    In its current configuration, it will run a load testing container to ping the user-service.
    Add more services and their respective ports as desired.

    Also, this will ping the service's `/health` endpoint, if configured. Else, it will not work.

6. Run the command:

    ```sh
    kubectl -n peerprep get all
    ```

    You should be able to see the Horizontal Pod AutoScaler scaling up the services in respond to 
    resource demand.

7. Run <kbd>Ctrl</kbd>+<kbd>C</kbd> to interrupt and 
    terminate the load tester.
