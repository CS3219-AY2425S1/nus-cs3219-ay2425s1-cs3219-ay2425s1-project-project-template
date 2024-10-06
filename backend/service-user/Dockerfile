# Use an OpenJDK 21 image as the base
FROM jelastic/maven:3.9.5-openjdk-21

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Install dependencies and build the project
RUN mvn clean install

# Copy the built JAR file
COPY target/service-user-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8081 for the backend service
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
