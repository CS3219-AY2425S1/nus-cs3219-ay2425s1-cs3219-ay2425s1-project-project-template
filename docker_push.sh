docker buildx build --platform linux/amd64 -t gcr.io/peerprep-438713/user-service:latest --push ./UserService
docker buildx build --platform linux/amd64 -t gcr.io/peerprep-438713/frontend-service:latest --push ./frontend
docker buildx build --platform linux/amd64 -t gcr.io/peerprep-438713/question-service:latest --push ./QuestionService
