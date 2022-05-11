1. install Docker 
Set up the repository
Update the apt package index and install packages to allow apt to use a repository over HTTPS:

     $ sudo apt-get update
     
     $ sudo apt-get install \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

2. Add Docker’s official GPG key:

     $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

3. Use the following command to set up the stable repository. To add the nightly or test repository, add the word nightly or test (or both) after the word stable in the commands below. Learn about nightly and test channels.

     $ echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

4. Install Docker Engine
Update the apt package index, and install the latest version of Docker Engine, containerd, and Docker Compose, or go to the next step to install a specific version:

     $ sudo apt-get update
     
     $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

5. Now you need to clone Github repository

     $ git clone https://github.com/kalpeshspatil/poc.git
     
     $ cd poc

6. Start docker composer using below command

     $ docker-compose up

You can access application on http://localhost:8080, Default credentials as below

    User : admin
    
    Pass : admin
