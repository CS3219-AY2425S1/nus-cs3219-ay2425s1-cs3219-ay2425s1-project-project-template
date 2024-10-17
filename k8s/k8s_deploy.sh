# 1. Apply the Persistent Volume Claims (PVCs) for MongoDB
kubectl apply -f mongo-question-db/mongo-question-pvc.yaml
kubectl apply -f mongo-user-db/mongo-user-pvc.yaml

# 2. Apply the MongoDB services (deployments + services)
kubectl apply -f mongo-question-db/
kubectl apply -f mongo-user-db/

# 3. Apply the backend services (deployments + services)
kubectl apply -f question-service/
kubectl apply -f user-service/

# 4. Apply the frontend service (deployment + service)
kubectl apply -f frontend/
