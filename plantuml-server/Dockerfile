FROM openjdk:17-slim
RUN mkdir /app
WORKDIR /app

# Download plantuml server jar
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/plantuml/plantuml-server/releases/download/v1.2024.5/plantuml-server.jar

EXPOSE 8080

CMD ["java", "-jar", "plantuml-server.jar"]
