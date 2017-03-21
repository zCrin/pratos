Pratos
===================


Introduction 
-------------
What if I told you that you can control your house with Siri AND you computer ? You won't believe me "Apple won't allow people to use HomeKit without an iPhone !". And you would be right ! But that was before Pratos !
## What is Pratos ?##
It's a NodeJS webserver that connects to HomeBridge in order to control your house. You can add plugins to make it more personal. "Jarvis is with you" (ref. iron man)
> **Note:**

> - You must have installed HomeBridge from this repo :  https://github.com/nfarina/homebridge

####  Installation ###

 - Be sure to have correctly installed HomeBridge
 - In a console run : `sudo visudo` and at the end of the file add `%www-data  ALL=(ALL:ALL) ALL`
 - Then create a new directory with `mkdir pratos` 
 - As you installed HomeBridge previously, you should be able to run **node** and **npm** (if you can't re-install the last version of npm and node)
 - Then do `cd pratos`  to access your new directory
 - And run `npm install pratos`
 - Edit the file in */conf/settings.json* 
 > You have to edit Homebridge pin, host, and port with your own settings, you can add an email address. In the default file there are plugins. Remove them from the block plugins or install them with `npm install pratos_<plugin_name>_plugin`

###  Access Pratos :  ###
Run `node server.js` from Pratos directory in order to start Pratos. 
Go on http://[your_server_ip]:3000/
if everything works, fine you should see a password page.
The default password is "543678". You can change it at anytime in the settings file.