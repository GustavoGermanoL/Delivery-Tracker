# Estágio 1: Construção (Build)
# Vamos usar uma imagem que já tem Maven e Java 17 para compilar
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY pom.xml .
COPY src ./src

# Roda o comando para gerar o .jar (pulando testes para ser mais rápido)
RUN mvn clean package -DskipTests

# Estágio 2: Execução (Runtime)
# Agora pegamos uma imagem leve só com Java para rodar o app
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copia o .jar gerado no estágio anterior para cá
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta 8080 (onde o Spring roda)
EXPOSE 8080

# Comando para iniciar o app
ENTRYPOINT ["java", "-jar", "app.jar"]