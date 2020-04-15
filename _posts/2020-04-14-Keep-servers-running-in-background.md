---
layout: post
title: Running servers as daemons
subtitle: 
# image: /img/linuxlogo.png
tags: [linux, daemons]
date: 2020-04-14
bigimg: /img/laptop.jpg
---


A wise man once said, “To access your server anytime, you gotta keep it running all the time.” You can’t make use of shell if you use the shell to run your server. It is of no issue during development because you are on your local computer. You have GUI. You can 
start a new tab anytime you want and do your stuffs. But during the stage of deployment, it can be a mess. 
We generally SSH to a VM from command line. We start the server. It starts. We want to keep it running. So we cannot Ctrl+C.
All we are left to do by then is to stare at the black screen while we question about every life choices we made and try hard not to break down. 
Furthermore, servers need to withstand system failures, reboots, server crash and what not for stability.

In order to handle these situations like a boss, we make some tweakings. We summon our inner demons. Kidding, nothing spiritual 
I'm going to write here. What I'm talking about is daemons. As wiki describes it, a daemon (/ˈdiːmən/ or /ˈdeɪmən/) is a 
computer program that runs as a background process, rather than being under the direct control of an interactive user. 
In a nutshell, daemons work behind the curtain. Thus, we don't have to assign a dedicated shell for them to run. And we can exit from tty anytime and still 
have them doing good work for us in background. I'm going to write about two methods I use to make servers run in background. 


1. **Using screen command**

    I find screen command super useful. So the basic idea of screen is to create new terminal sessions which can be detached and reattached to the main session. 
    To install screen 
    ```bash
    $ sudo apt install screen
    ```
    For OSX, 
    ```bash
    $ brew install screen
    ```
    You can read documentation of screen to become a screen ninja but the most basic and redundant use case
    involves the following steps.

    i. Create and start a new screen. 

    ```bash
        $ screen -S screenname
    ```  
    In the new screen just created, you can run your server or any application you choose to. 

    ii. Use key combination ```Ctrl+A d``` to detach from currently active screen. And by now, your application
        will be running in background. 

    iii. Reattach the screen again

    ```bash
        $ screen -r screenname
    ```   

    iv. You can always make queries for active screens.

    ```bash
        $ screen -ls
    ```        



2. **Using systemd**

    Systemd is the best choice since we are setting up a server and server needs to be stable and withstand
    system reboots, server failure and lots more. We can't afford server to be down because of simple issues and it is not ideal
    to restart server time and again manually after each system reboot. So its better to have knowledge about systemctl services
    in your arsenal. 

    I'm going to take a node.js server as a example here. If we were to start this server manually, we would do something like
    ```bash
    $ /path/to/node /path/to/server.js
    ```

    In case of a django server, it would be
    ```bash
    $ /path/to/virtualenv/bin/python /path/to/manage.py runserver
    ```

    Now, to start this server as a service, first we need to create a service file. Service files are generally located at ```/etc/systemd/system/```.
    Let's create a service file called myserver.service using the following command.
    ```bash
    $ touch /etc/systemd/system/myserver.service
    ```

    Inside myserver.service, you write configuration about the execution to be performed, order of execution, 
    behavior upon restart or failures and so on. A basic configuration file should be looks like this.

    ```bash
    [Unit]
    Description=Example Server As A service
    Requires=After=mysql.service                        # only if server needs to run after other services, eg: mysql

    [Service]
    ExecStart=/path/to/node /path/to/server.js          #this is the part where you start your server
    Restart=always
    RestartSec=10                                       #this restarts server after 10 seconds in case of failure
    # Output to syslog
    StandardOutput=syslog                   #logs can be viewed with rsyslog and journalctl
    StandardError=syslog
    SyslogIdentifier=myserveridentifier 

    [Install]
    WantedBy=multi-user.target
    ```

    `Description` can be any combination of alphanums, better if the combination makes sensible phrase. `ExecStart` is the main line you
    want to modify as per your needs. `WantedBy` is a sort of preset of when to execute the service. multi-user.target normally defines a system state 
    where all network services are started up and the system will accept logins, but a local GUI is not started. Most Likely, you won't need to modify this. 
    If you want to have more control over configuration file and looking for exploring more, I suggest to read from [here.](https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files).
    
    
    If you want to stick to the basics, above configuration is enough to get server running with few more steps.

    After making proper configurations to service file, you need to enable the service. 
    ```bash
    $ systemctl enable myserver
    ```
    
    Then you can start server with the good old systemctl command that you might already have used multiple times.
    ```bash
    $ systemctl start myserver
    ```

    These are some more commands you'll need at times too. 
    ```bash
    $ systemctl disable myserver
    $ systemctl restart myserver
    $ systemctl stop myserver
    ```

    **Setting up logging server**  

    Logging is a vital mechanism to keep track of how your server is doing. A good log helps not only in analyzation of traffic but also in troubleshooting and
    debugging. So setting up a central logserver is never a bad idea. I'm going to write about setting up logging server
    with `rsyslog` which manages syslogs in ubuntu systems by default. 

    Create a new file in /etc/rsyslog.d 
    ```bash
        $ sudo touch /etc/rsyslog.d/filename.conf
    ```

    Now we tell the file to save logs of our server using `SyslogIdentifier`. In our case it is `myserveridentifier`. So write the following code inside `/etc/rsyslog.d/filename.conf`.
    ```bash
        if $programname == 'myserveridentifier' then /var/log/syslog
        & stop
    ```

    After writing appropriate configurations successfully, restart rsyslog service.
    ```bash
        $ sudo systemctl restart rsyslog
    ```

    To view the logs,
    ```bash
        $ sudo journalctl -u myserveridentifier
    ```

    You can save logs in a external file too. Create a file mylogfile.log anywhere you like. In `/etc/rsyslog.d/filename.conf` file, 
    replace `/var/log/syslog` with location of your logfile. Give syslog permission to write to the file.
    ```bash
        $ sudo chown syslog /path/to/mylogfile.log
    ```

    And restart rsyslog again. And you will have logs saved in mylogfile.log.     


Personally, I prefer systemd over screen in case of setting up servers because services are more immune to unexpected failures and can save us from headaches. Furthermore we can make maximum use of central logging server. 