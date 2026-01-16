# Estágio 1: Construção (Build)
# MUDANÇA AQUI: Trocamos o temurin-17 pelo temurin-21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia os arquivos do projeto
COPY pom.xml .
COPY src ./src

# Compila o projeto
RUN mvn clean package -DskipTests

# Estágio 2: Execução (Runtime)
# MUDANÇA AQUI TAMBÉM: Usamos o Java 21 para rodar
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copia o .jar gerado
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta 8080
EXPOSE 8080

# Inicia o app
ENTRYPOINT ["java", "-jar", "app.jar"]