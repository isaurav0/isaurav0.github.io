---
layout: post
title: Running servers as daemons
subtitle: 
# image: /img/linuxlogo.png
tags: [linux, daemons]
date: 2020-04-11
bigimg: /img/laptop.jpg
---


A wise man once said, “To access your server anytime, you gotta keep it running all the time.”. You can't do 
other stuffs if you use the shell to run your server. It is of no issue during development because you are on your local computer. You have GUI. You can 
start a new tab anytime you want and do your stuffs. But during the stage of deployment, it can be a mess. 
We generally SSH to a VM from command line. We start the server. It starts. We want to keep it running. So we cannot Ctrl+C.
All we are left to do by then is to stare at the black screen while we question about every life choices we made and try hard not to break down. 
Furthermore, servers need to withstand system failures, reboots, server crash and what not for stability.

In order to handle these situations like a boss, we make some tweakings. We summon our inner demons. Kidding, nothing spiritual 
I'm going to write here. What I'm talking about is daemons. As wiki describes it, a daemon (/ˈdiːmən/ or /ˈdeɪmən/) is a 
computer program that runs as a background process, rather than being under the direct control of an interactive user. 
In a nutshell, daemons work behind the curtain. 


1. **Using screen command**

    I find screen command super useful. So the basic idea of screen is to create new terminal sessions which can be detached and reattached to the main session. 
    To install screen 
    ```bash
    sudo apt install screen
    ```
    For OSX, 
    ```bash
    brew install screen
    ```
    You can read documentation of screen to become a screen ninja but the most basic and redundant use case
    involves the following steps.

    i. Create and start a new screen. 

    ```bash
        screen -S screenname
    ```  
    In the new screen just created, you can run your server or any application you choose to. 

    ii. Use key combination ```Ctrl+A d``` to detach from currently active screen. And by now, your application
        will be running in background. 

    iii. Reattach the screen again

    ```bash
        screen -r screenname
    ```   

    iv. You can always query for active screens.

    ```bash
        screen -ls
    ```        



2. **Using systemd**

    Systemd is the best choice since we are setting up a server and server needs to be stable and withstand
    system reboots, server failure and lots more. We can't afford server to be down because of simple issues and it is not ideal
    to restart server time and again after each system reboot. So it is always a good idea to have knowledge about systemctl services
    in your arsenal. 

    I'm going to take a node.js server as a example here. If we were to start this server manually, we would do something like
    ```bash
    /path/to/node /path/to/server.js
    ```

    Now, to start this server as a service, first we need to create a service file. Service files are generally located at 
    ```/etc/systemd/system/```.