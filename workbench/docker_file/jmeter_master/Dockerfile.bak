# Use jmeter3.0base build jmeter master

FROM jmeter3.0base

# install node & npm

RUN apt-get -y install nodejs

# install node from binary incase network is invalid.
#RUN cd /opt/PTC/node/ \
#	&& tar -xzf node-v8.1.1-linux-x64.tar.gz \
#	&& rm node-v8.1.1-linux-x64.tar.gz

# Ports to be exposed from the container for JMeter Master
EXPOSE 60000