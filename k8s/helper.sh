# kubectl apply -f rabbitmq/
# kubectl apply -f redis/

# kubectl apply -f user-service/
# kubectl apply -f question-service/
# kubectl apply -f frontend/
# kubectl apply -f matching-service/
kubectl apply -f collaboration-service/
# kubectl apply -f mongo-question-db/
# kubectl apply -f jobs/

# kubectl rollout restart deployment user-service
# kubectl rollout restart deployment mongo-question
# kubectl rollout restart deployment frontend
# kubectl rollout restart deployment matching-service
kubectl rollout restart deployment collaboration-service
# kubectl rollout restart deployment question-service
