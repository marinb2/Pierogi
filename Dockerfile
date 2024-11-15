FROM maven:3.8.5-openjdk-17 AS build
COPY ./IzvorniKod/backend/classmate/. .
RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/classmate-0.0.1-SNAPSHOT.jar classmate.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "classmate.jar"]