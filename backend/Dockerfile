FROM --platform=linux/arm64 gradle:8.4-jdk17-jammy AS build

WORKDIR /app
COPY . .
RUN gradle clean build -x test

FROM --platform=linux/arm64 eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY src/main/resources/data.json ./data.json

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]