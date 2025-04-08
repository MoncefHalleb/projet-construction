# Use Amazon Corretto 17
FROM amazoncorretto:17

# Define the build argument for the JAR file
ARG JAR_FILE=target/eureka-server-0.0.1-SNAPSHOT.jar

# Copy the built JAR file into the container
COPY ${JAR_FILE} app.jar

# Expose Eureka Server port
EXPOSE 8761

# Run Eureka Server
ENTRYPOINT ["java", "-jar", "/app.jar"]
