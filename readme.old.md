
<img src="https://github.com/zCrin/pratos/blob/master/static/img/logo.png?raw=true"  id="logo" alt="logo" width="160px" height="160px">

Pratos
===================

Git : 
![Github All Releases](https://img.shields.io/github/downloads/pratos/pratos/total.svg) 
![GitHub commit activity the past week, 4 weeks, year](https://img.shields.io/github/commit-activity/y/zCrin/pratos.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/zCrin/pratos.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/zCrin/pratos.svg)

-------------
npm : 
![npm](https://img.shields.io/npm/dw/pratos.svg)
![npm](https://img.shields.io/npm/v/pratos.svg)

-------------
Introduction 
-------------
What if I told you that you can control your house with Siri AND you computer ? You won't believe me "Apple won't allow people to use HomeKit without an iPhone !". And you would be right ! But that was before Pratos !
### What is Pratos ? 
It's a NodeJS webserver that connects to HomeBridge in order to control your house. You can add plugins to make it more personal. "Jarvis is with you" (ref. iron man)
> **Note:**

> - You must have installed HomeBridge from this repo :  https://github.com/nfarina/homebridge

## Installation 

 - Be sure to have correctly installed HomeBridge
 - In a console run : `sudo visudo` and at the end of the file add `%www-data  ALL=(ALL:ALL) ALL`
 - Then create a new directory with `mkdir pratos` 
 - As you installed HomeBridge previously, you should be able to run **node** and **npm** (if you can't re-install the last version of npm and node)
 - Then do `cd pratos`  to access your new directory
 - And run `npm install pratos`
 - Edit the file in */conf/settings.json* 
 > You have to edit Homebridge pin, host, and port with your own settings, you can add an email address. In the default file there are plugins. Remove them from the block plugins or install them with `npm install pratos_<plugin_name>_plugin`

## Access Pratos :  ##
Run `node server.js` from Pratos directory in order to start Pratos. 
Go on http://[your_server_ip]:3000/
If everything works, fine you should see a password page.
The default password is "543678". You can change it at anytime in the settings file.

[![NPM](https://nodei.co/npm/pratos.png)](https://nodei.co/npm/pratos/)