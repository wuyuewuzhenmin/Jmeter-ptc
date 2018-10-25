# PTC 

Performance test center. Docker based service to help user manage, organize, execute JMeter test and get detailed performance report. 

### Prerequisites

Docker is properly installed and configured

## Getting Started

Download Docker image from Docker hub:
  - [mongo](https://hub.docker.com/_/mongo/): Mongo db
  - [ptc](https://hub.docker.com/r/wankutuzi/ptc/): JMeter master along with PTC main service
  - [jmeterslave](https://hub.docker.com/r/wankutuzi/jmeterslave/):JMeter slave to execute test and send report back to master
  
### Note 
- [jmeterslave](https://hub.docker.com/r/wankutuzi/jmeterslave/) and [jmetermaster](https://hub.docker.com/r/wankutuzi/jmetermaster/) are built base on [jmeter3.0base](https://hub.docker.com/r/wankutuzi/jmeter3.0base/)
- [ptc](https://hub.docker.com/r/wankutuzi/ptc/) is built base on jmetermaster
- Feel free to edit the [Dockerfile](workbench/docker%20file) and build your own docker image with selected version of Java/JMeter/NodeJS etc.

### Deployment
1. Start mongo db. Bind default mongo db port **27017** to selected server port
```
docker run -dit -p 27017:27017 --name mongo mongo
```
2. Start as many JMeter slaves as needed
```
docker run -dit --name slave1 jmeterslave
docker run -dit --name slave2 jmeterslave
docker run -dit --name slave3 jemterslave
```
3. Inspect IP address of jmeter slave(s). 
```
docker inspect --format '{{ .Name }} => {{ .NetworkSettings.IPAddress }}' $(docker ps -a -q)
```
Start PTC(JMeter master) by passing in mongo and slave information. 
```
docker run -it -p <server port>:<container port 8080 by default> -e mongoAdd=<IP Address of mongo db> -e mongoPort=<Port of mongo db> -e slaves=<Slave IP separated by comma> --name ptc ptc
```
![alt text](/workbench/command.png)

4. If you saw "db conncetion established", you are ready to go. Visit http://localhost:8080 to use PTC

## Running the tests

1. Register and login the system
2. Create a project if there isn't any
3. Go to Performance Testing->JMeter test page to add a test
- Specify _mandatory_ information of a test:
  - Choose a project
  - Fill in test name 
  - Upload a JMeter test case
- Specify _optional_ information:
  - Fill in host and port
  - Other parameters by dragging the sliders
  
- Click save button, test will be executed automatically. Check execution status in 'Execution History' section
![alt text](/workbench/test.png)
4. After test status becomes to 'Finished', click log to check the [report](/workbench/dashboard).![alt text](/workbench/report.png)

### Note
You can define parameters like thread user, rampup time... directly in JMeter test case, that way the parameters you specified on web page won't take effect. Otherwise, use `${__p()}` to take the parameter. Here is an [sample case](/workbench/PTC.jmx)

## Manage your case
1. **Object**
Tests are organized under project. Open an object 
- All tests that under this project will be listed
- Object name and description can be updated
- Object can be deleted only if there is no test under it
2. **Test**
A test contain a JMeter case and related configuration. Open a test:
- Test execution history will be listed
- Test can be updated by changing the case and/or the configuration
- Test can be re-executed directly by click the 'Play' button
- Test can be deleted, and all its execution history will be deleted together
3. **Activity**
To log some major events like test creation and update
- You can check activity on homepage-> dashboard
- If a test gets deleted, all its related activities will be deleted too

## Permission Control
First registered user is super user, and others will be normal user
- Super user can visit all data(Project, test, test execution log etc.
- Normal user can only visit the data created by himself/herself 

## Authors

**Wenwen Yang**
wenwen.yang88@gmail.com


## License
