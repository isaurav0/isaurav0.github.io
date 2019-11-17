---
layout: post
title: Cool commands for linux terminal
subtitle: Here is a short list of some of my favorite linux terminal commands.  
# image: /img/linuxlogo.png
tags: [linux, tutorial]
date: 2019-02-15 
---

The commands I list here might not be quite useful but they are fun :p Check these out when you're bored. Some commands here wont be installed already but are available on repositories. In that instance, install them with your package manager. 

1. Weather  
	Did you know you can check weather forecast of any city from terminal? With this command you can. Your terminal will suggest if you should take umbrella to work today or not ;)     

	```bash
	curl http://wttr.in/pokhara 
	```
	![](/img/weather.png)  
2. htop  
	htop is an interactive process viewer(similar to windows' task manager).  Needless to say, it looks hot and in the mean time you can inspect processes ongoing.  

	```bash
	htop
	```

	![](/img/htop.png) 

3. banner  
	With this command, you can get nicely formatted text of asterisks.  

	```bash
	banner text
	```

	![](/img/banner.png)



4. lolcat  
	lolcat provides rainbow coloring effect for text console display. Remember, it doesnt come pre-installed in your system. So install it from package manager your distro supports.  

	```bash
	echo 'text' | lolcat
	```

	![](/img/lolcat.png)

5. sl  
	sl generates a moving ASCII train. According to its man page, it is developed to cure habit of mistyping. When someone mistypes sl for ls, they suffer. You can combine sl with lolcat to generate rainbow colored train. :D  

	```bash
	sl 
	```  
	![](/img/sl.png)
  

	
