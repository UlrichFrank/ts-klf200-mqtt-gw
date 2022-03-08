# velux-to-mqtt-gw

[![mqtt-smarthome](https://img.shields.io/badge/mqtt-smarthome-blue.svg)](https://github.com/mqtt-smarthome/mqtt-smarthome)

Bridge Velux KLF200 gateway messages to mqtt messages.

# Docker

This application is intended to be executed using docker. Example docker compose usage:

```
veluxmqtt:
  hostname: veluxmqtt
  image: ulrichfrank/veluxmqtt:1.0.0
  volumes:
    - ./config/veluxmqtt:/var/lib/veluxmqtt:ro
  restart: always 
  depends_on:
   - mosquitto
```
