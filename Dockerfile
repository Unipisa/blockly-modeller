FROM eclipse-temurin:17-jre

RUN mkdir /app
WORKDIR /app

# Install wget
RUN apt-get update && apt-get install -y wget

# Download PlantUML server JAR
RUN wget https://github.com/plantuml/plantuml-server/releases/download/v1.2024.5/plantuml-server.jar

EXPOSE 8080

CMD ["java", "-jar", "plantuml-server.jar"]

