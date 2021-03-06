![Logo](admin/proxy.png)
# ioBroker.proxy
=================

[![NPM version](http://img.shields.io/npm/v/iobroker.proxy.svg)](https://www.npmjs.com/package/iobroker.proxy)
[![Downloads](https://img.shields.io/npm/dm/iobroker.proxy.svg)](https://www.npmjs.com/package/iobroker.proxy)
[![Tests](https://travis-ci.org/ioBroker/ioBroker.proxy.svg?branch=master)](https://travis-ci.org/ioBroker/ioBroker.proxy)

[![NPM](https://nodei.co/npm/iobroker.proxy.png?downloads=true)](https://nodei.co/npm/iobroker.proxy/)

## Usage
Allows to access defined URLs or local files via one web server.

Specified routes will be available under ```http://ip:8082/proxy.0/context/...```. Of course port, protocol, "proxy.0", can variate depends on settings.

## Configuration
- Extend WEB adapter: For which web instance will active this proxy.
- Route path: Path for proxy. If "/proxy.0", so the routes will be available under ```http://webIP:8082/proxy.0/...```
- Error timeout(ms): Minimal interval between retries if the requested resource was unavailable or returned error.

## Sample settings
| Context        |      URL                                           |      Description                                   |
|----------------|:---------------------------------------------------|:---------------------------------------------------|
| admin/         | http://localhost:8081                              | access to admin page                               |
| router/        | http://192.168.1.1                                 | access to local router                             |
| cam/           | http://user:pass@192.168.1.123                     | access to webcam (e.g. call http://ip:8082/proxy.0/cam/web/snapshot.jpg) |
| dir/           | /tmp/                                              | access to local directory "/tmp/"                  |
| dir/           | tmp/                                               | access to local directory "/opt/iobroker/tmp"      |
| file.jpg       | /tmp/picture.jpg                                   | access to local file "/tmp/picture.jpg"            |

**Not all devices can be accessed via proxy. 

Some devices wants to be located in the root ```http://ip/``` and cannot run under ```http://ip/proxy.0/context/```.

You can read more about context [here](https://www.npmjs.com/package/http-proxy-middleware#context-matching)

Additionally the user can define the route path for proxy requests.

## Changelog
### 1.0.1 (2018-03-01)
* (bluefox) Fixed error: after 10 timeouts the web cam was never reachable
* (bluefox) Ready for Admin3

### 1.0.0 (2017-10-09)
* (bluefox) do not allow the error generation to fast

### 0.2.0 (2017-03-13)
* (bluefox) fix run-mode

### 0.0.1 (2017-01-09)
* (bluefox) initial commit