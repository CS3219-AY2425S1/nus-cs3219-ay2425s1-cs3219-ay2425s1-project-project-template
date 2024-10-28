# Kubernetes Instructions

## Prerequisites

- [**Minikube**](https://minikube.sigs.k8s.io/docs/)

  To run a local Kubernetes cluster, we
  recommend using Minikube on your local machine.

## Getting Started

1. Ensure that the Metrics Server add-on is enabled. Else, the autoscaling will not work.

2. For Minikube:

    ```sh
    # For Horizontal Pod Autoscaling
    minikube addons enable metric-server

    # For Nginx Ingress Controller
    # Install
    minikube addons enable ingress
    # Verify
    kubectl get pods -n ingress-nginx
    ```

3. For Kubernetes:

    ```sh
    # Metric Server
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

    # Ingress Controller
    # Install
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml
    # Deploy with load balancer (GKE, AKS, EKS)
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml
    # Validate
    kubectl get pods --all-namespaces -l app.kubernetes.io/name=ingress-nginx
    kubectl get services ingress-nginx-controller --namespace=ingress-nginx
    ```

4. Run the command from the project root:

    ```sh
    make k8s-up
    ```

## Load Testing

1. Run the load test script:

    ```sh
    ./scripts/k8s-load-test.sh
    ```

    In its current configuration, it will run a load testing container to ping the user-service.
    Add more services and their respective ports as desired.

    Also, this will ping the service's `/health` endpoint, if configured. Else, it will not work.

2. Run the command:

    ```sh
    kubectl -n peerprep get all
    ```

    You should be able to see the Horizontal Pod AutoScaler scaling up the services in respond to 
    resource demand.

3. Run <kbd>Ctrl</kbd>+<kbd>C</kbd> to interrupt and
    terminate the load tester.

## Exposing the Ingress Controller

1. If you haven't already, run the command from the project root:

    ```sh
    make k8s-up
    ```

2. Run the command to set up the ingress controller:

    ```sh
    kubectl apply -f ./k8s/ingress/06-nginx-ingress.yaml
    ```

3. Run the command to expose the ingress controller:

    ```sh
    minikube tunnel
    ```

4. Edit your `/etc/hosts` file and add the following at the bottom:

    ```txt
    127.0.0.1 peerprep-g16.net
    ```

5. Visit `http://peerprep-g16.net` in your browser.

## Running the Minikube Service without Ingress

1. Run the command to set up the cluster:

    ```sh
    make k8s-up
    ```

2. Expose the service:

    ```sh
    minikube -n peerprep service frontend
    ```

    A browser window should launch, directing you to the application's frontend.
