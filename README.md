[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G02
### 3 ways to access the application: 
1. Public hosted website *(public containerization)*
2. Docker compose up locally *(local containerization)*
3. Individual services wind up *(local development)*


### Public hosted website:
You can access the PeerPrep application at https://frontend-1079323726684.asia-southeast1.run.app (note that matching service might be down as it is too **expensive** for us to host matching service 24/7)

How to deploy website to public:

1. Deploy a Redis instance on Google memorystore (it's too expensive to host this 24/7), and then obtain its ip address to plug into the build arguments in the script below. In this example, the ip addr is 10.189.63.187 (see image below)
![image](resources/images/redis-instance.png)

2. Deploy a RabbitMQ instance via CloudAMQP (free tier). Currently, one of our members, Wei Rui, has done this already so just contact him to get the full confidential RabbitMQ URL (hosted on CloudAMQP) to plug into the build arguments in the script below

3. Ensure you have plugged in the necessary details from step 1 and step 2 into the script below. Build each service (with environment variable provided wherever needed) and push to gcr. *If this is your first time docker pushing to gcr, you would need to link your Google account with docker first, and then select the PeerPrep project. Do that before proceeding.* 

  ```sh
  cd backend/user_service
  docker build -t user_service .
  docker tag user_service gcr.io/peerprep-g02/user_service
  docker push gcr.io/peerprep-g02/user_service

  cd ../question_service 
  docker build --build-arg USER_SERVICE_BACKEND_URL=https://user-service-1079323726684.asia-southeast1.run.app -t question_service .
  docker tag question_service gcr.io/peerprep-g02/question_service
  docker push gcr.io/peerprep-g02/question_service

  cd ../collab_service
  docker build --build-arg USER_SERVICE_BACKEND_URL=https://user-service-1079323726684.asia-southeast1.run.app --build-arg REDIS_URL=redis://{DEPLOY_REDIS_INSTANCE_ON_GOOGLE_MEMORYSTORE_AND_OBTAIN_IP_ADDR_AND_THEN_PLUG_IT_HERE}:6379 -t collab_service .
  docker tag collab_service gcr.io/peerprep-g02/collab_service
  docker push gcr.io/peerprep-g02/collab_service

  cd ../matching_service
  docker build --build-arg USER_SERVICE_BACKEND_URL=https://user-service-1079323726684.asia-southeast1.run.app --build-arg QUESTION_SERVICE_BACKEND_URL=https://question-service-1079323726684.asia-southeast1.run.app --build-arg REDIS_URL=redis://{DEPLOY_REDIS_INSTANCE_ON_GOOGLE_MEMORYSTORE_AND_OBTAIN_IP_ADDR_AND_THEN_PLUG_IT_HERE}:6379 --build-arg RABBITMQ_URL=amqps://taorzqvx:{CONTACT_WEI_RUI_TO_GET_PASSWORD_AND_THEN_PLUG_IT_HERE}@armadillo.rmq.cloudamqp.com/taorzqvx --build-arg COLLAB_SERVICE_BACKEND_URL=https://collab-service-1079323726684.asia-southeast1.run.app -t matching_service .
  docker tag matching_service gcr.io/peerprep-g02/matching_service
  docker push gcr.io/peerprep-g02/matching_service

  cd ../history_service
  docker build --build-arg USER_SERVICE_BACKEND_URL=https://user-service-1079323726684.asia-southeast1.run.app --build-arg QUESTION_SERVICE_BACKEND_URL=https://question-service-1079323726684.asia-southeast1.run.app -t history_service .
  docker tag history_service gcr.io/peerprep-g02/history_service
  docker push gcr.io/peerprep-g02/history_service

  cd ../../frontend
  docker build --build-arg VITE_QUESTION_SERVICE_BACKEND_URL=https://question-service-1079323726684.asia-southeast1.run.app --build-arg VITE_MATCHING_SERVICE_WS_BACKEND_URL=wss://matching-service-1079323726684.asia-southeast1.run.app --build-arg VITE_COLLAB_SERVICE_WS_BACKEND_URL=wss://collab-service-1079323726684.asia-southeast1.run.app --build-arg VITE_COLLAB_SERVICE_BACKEND_URL=https://collab-service-1079323726684.asia-southeast1.run.app --build-arg VITE_USER_SERVICE_BACKEND_URL=https://user-service-1079323726684.asia-southeast1.run.app --build-arg VITE_HISTORY_SERVICE_BACKEND_URL=https://history-service-1079323726684.asia-southeast1.run.app -t frontend .
  docker tag frontend gcr.io/peerprep-g02/frontend
  docker push gcr.io/peerprep-g02/frontend
  ```
  Go to Google Cloud container/artifact registry to see your pushed images at gcr. Google Cloud container/artifact registry can be found by going to Cloud Console and then typing container registry:
  ![image](resources/images/cloud-console.png)

  You should be able to see your just pushed images in gcr:
  ![image](resources/images/container-registry.png) 

4. In order to allow our Cloud Run hosted applications/websites to be able to access the (internal) ip addr of Redis, you would also need to set up a Serverless VPC access in Google Cloud Console (another paid service). This Serverless VPC access is bascially a Google Cloud feature that allows serverless services (like Cloud Run, Cloud Functions, and App Engine) to communicate securely and privately with resources inside a Virtual Private Cloud (VPC) network. It bridges the gap between serverless environments (which don't have their own dedicated network) and VPC-based resources, such as databases, Redis instances, or any other internal services running within the VPC. ![image](resources/images/serverless-vpc-access.png)

5. Go to Cloud Run and for each services, deploy container via service
![image](resources/images/deploy-container.png)

6. Fill in the details accordingly. For our frontend service example, container image URL should be `gcr.io/peerprep-g02/frontend`. Service name could be anything, like `frontend`. Region choose the region closest to you. Scroll down and remember to configure the container port number to suit the exposed container port as defined by the `Dockerfile` as well.
![image](resources/images/deploy-service-1.png)
![image](resources/images/deploy-service-2.png)
Repeat this until all services are hosted (note that **matching** and **collab** services requires step 7)

7. When deploying/re-deploying **matching** and **collab** services on Google Cloud Run, configure the networking settings by ticking "Connect to a VPC for outbound traffic" and select "Use Serverless VPC Access connectors" and choose the Serverless VPC access connector which you had just set up (see image below)
![image](resources/images/configure-networking-settings.png)

### Docker compose up locally:
```
cd project-root/
docker compose build
docker compose up -d
```

Access the frontend at `localhost:3000`. Note that this method (`docker compose up -d`) might take awhile as the matching service is only started after rabbitMQ is set up (which takes awhile)

### Individual services wind up:
For each backend service, cd into them and run `node server.js` or `nodemon server.js` \
For the frontend service, cd into it and run `npm run dev`
