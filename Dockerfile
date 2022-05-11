FROM ubuntu:18.04
MAINTAINER ksp27695.kp@gmail.com 
RUN apt-get update && apt-get install -y curl software-properties-common
RUN apt install openjdk-11-jre-headless -y
RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt install nodejs -y
RUN apt install mysql-server -y && npm install -g generator-jhipster
RUN mkdir /opt/new
COPY . /opt/new
WORKDIR /opt/new/
RUN service mysql start
RUN jhipster jdl poc.jdl && ./mvnw
