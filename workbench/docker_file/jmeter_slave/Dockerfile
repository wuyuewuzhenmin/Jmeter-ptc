# Use jmeter3.0base build jmter slave

FROM jmeter_base:4.0

RUN  mkdir -p /opt/data \
&&  apt install -y python python-pip \
&& pip install requests \
&& pip install pycrypto 
# Ports to be exposed from the container for JMeter Slaves/Server
EXPOSE 1099 50000

# Application to run on starting the container
ENTRYPOINT $JMETER_HOME/bin/jmeter-server \
                        -Dserver.rmi.localport=50000 \
                        -Dserver_port=1099
