FROM jmeter_master:4.0

WORKDIR /opt/PTC
COPY / /opt/PTC
RUN mkdir -p /opt/PTC/public/cases && mkdir -p /opt/data \
&&  apt install -y python python-pip \
&& pip install requests \
&& pip install pycrypto 
CMD js app
