# Use an OpenJDK 21 image as the base
FROM jelastic/maven:3.9.5-openjdk-21

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Install dependencies and build the project
RUN ./mvn clean install

# Copy the built JAR file
COPY target/service-question-0.0.1-SNAPSHOT.jar app.jar

# Expose port 3000 for the backend service
EXPOSE 3000

# Set the environment variable to connect to MongoDB
ENV SPRING_DATA_MONGODB_URI="mongodb://mongodb:27017/question_db"

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
