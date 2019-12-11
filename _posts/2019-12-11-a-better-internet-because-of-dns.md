---
layout: post
title: A better internet because of DNS
subtitle: 
# image: /img/linuxlogo.png
tags: [network, security]
date: 2019-12-10
bigimg: /img/dns.png
---

DNS stands for Domain Name System, which is basically a method of assigning cute nicknames to ugly IP addresses.
Every devices on network has their IP addresses. I dont want to talk about IP addresses in detail in this blog, however 
IP addresses distinguish devices on the network. Suppose we want to browse facebook, what we are normally doing is
making some https requests to facebook's server. And to make request to facebook's server, we need to know the server's IP address. 
It is a pain in somewhere to remember a numerical jargon like 192.168.10.33. This is where the great DNS comes to rescue.

DNS server works somehow the same way as phonebook app in our phone. By simplying remebering the names and not their phone number, 
we can make a call to people we want. DNS server contains ip address and domain name of servers. For example: when we enter www.facebook.com in our browser,
according to the nameserver provided to us, generally by our ISP, it is translated to corresponding ip address and connection is made. 

In *nix systems, nameserver is stored in a configuration file called resolv.conf. If you want query which nameserver is currently being used by your device, navigate to the
file /etc/resolv.conf. You can do this by typing following command. 


```bash
	cat /etc/resolv.conf
```

You might find something like 
```bash
	nameserver ip-address
```

Here's a **cool hack**. If your ISP has disabled some sites, you can simply change nameserver's ip address from
resolv.conf file to point other nameservers. Google's nameserver's ip address is 8.8.8.8. If you want a faster internet
with no restrictions as made by your ISP, **change your nameserver ip-address to 1.1.1.1.** If you open 1.1.1.1 in your browser, you might find that 1.1.1.1 is ip address of DNS server of 
Cloudfare. 


To do this, open /etc/resolv.conf file with your favorite text editor, delete or comment the line which contains previous nameserver. 
Change ip address of nameserver to 1.1.1.1. 

```bash
	nameserver 1.1.1.1
```

There you go, with a faster internet and with no restrictions as made by Nepal government. 