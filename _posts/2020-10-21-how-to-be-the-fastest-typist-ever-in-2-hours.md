---
layout: post
title: 'HOW TO BE THE FASTEST TYPIST EVER IN 2 HOURS'
# subtitle: ''
date: 2020-10-20
tags: [fun, programming]
bigimg: /img/automation.jpg
---

I have a godly typing speed of 193 words per minute with 100% accuracy. You don’t believe me?
Okay, check out my certificate [here](https://www.ratatype.com/u2623367/certificate/) provided by an infamous typing site.

![](/img/typecert.jpg) 

Even though you have seen the certificate, you would have to be madly gullible to believe that I actually type that fast.
No, I didn't photoshop it. Neither am I that good at typing. Instead, I used my programming skills to
achieve the goal. It was a fairly easy task and I got everything done in 2 hours. 


I used `puppeteer` which is a `Node.js` library to control
Chromium browser. It can be used to automate stuffs like clicking buttons, visiting pages, sending keypresses. I could have
used `selenium` with `python` too for the same thing, but I preferred puppeteer with `javascript` because it is convenient to 
use node.js and client side vanilla javascript with `window` and `document` object exposed in the same script. Do I even make
sense here? I might, later. Lets see some code.

```javascript
const puppeteer = require('puppeteer');
(async () => {
    const type_url = "https://www.ratatype.com/typing-test/test/";
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.bringToFront();
    await page.goto(type_url, { waitUntil: 'networkidle0' });
    await page.click('button#startButton');
})();
```

With just 10 lines of code after installing puppeteer with `npm`, I got a full fledged chromium browser which opens url
to the typing test and clicks start button to start the test. Awesome. Also, I came up with an interesting finding. I was always confused whether
to use **semicolons** or not in javascript at first. Then, I came to a conclusion that it doesn't matter anyways as I realized
javascript uses **ASI** (Automatic Semicolon Insertion) during runtime. So, even if we leave semicolons, it will insert them
based on some rules anyways. But on running the above code without semicolon in first line, to my surprise, I got an error.
```bash
/Users/mac/projects/typebeater/ratatype.js:17
(async () => {
^

TypeError: require(...) is not a function
    at Object.<anonymous> (/Users/mac/projects/typebeater/ratatype.js:17:1)
    at Module._compile (internal/modules/cjs/loader.js:1176:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1196:10)
    at Module.load (internal/modules/cjs/loader.js:1040:32)
    at Function.Module._load (internal/modules/cjs/loader.js:929:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)
    at internal/main/run_main_module.js:17:47
```

What happened was an ambiguity arises when using self-invoking anonymous function. For example
```js
const a = 'hello'
(()=>{
    console.log('world')
})()
```
We expect above script to print 'world', but we get an error instead because above statement is treated as:

```js
const a = 'hello'(()=>{
    console.log('world');
})()
```
Here, hello is treated as a function and called. And thus, `is not a function` error. So, It is safer to use semicolons in javascript.


Anyways, I got the page opened in puppeteer controlled Chromium browser, I inspected the elements of the site and noticed that
all texts to be typed were available inside a `<div>` with class `"mainTxt"`. I extracted all texts easily with client side
vanilla javascript that can be used with `page.evaluate()` function provided by `puppeteer`.

```js
allTexts = await page.evaluate(()=>{
		text = ''
		for(e of document.getElementsByClassName('mainTxt')[0].childNodes){
			text += e.innerText
		}
		return text
	});
```
I had all texts to be typed in the test in memory. Now, I had to send keypress events to simulate typing. I tried to fire keypress
event in javascript with `dispatchEvent` method, but for some reasons, it didn't work. I don't know why. I tried to attach
eventListener to the element, I bubbled the event to ripple all over the DOM, but none of them worked. So, I decided to send
keypress directly from the operating system. I thought I could write a simple script from scratch in node to send keypress,
but I gave up before trying. I tried to use `robotjs`, `node-key-sender` libraries, but they didn't meet my expectations.

In the end, I decided to turn to my friend `python` and the renowned library for automating GUI stuffs, the very best, `pyautogui`
. I had to send the variable `allTexts` from above node code, to the python script. I decided to send them as command line args.
For example: `python keypress.py 'all texts to be typed'`. To do this, I used node's built-in library called `child-process`.
Lets see some code.

```javascript
const { spawn } = require('child_process');
const pythonPath = '/usr/local/bin/python3';

args = ['keypress.py', allTexts]
const pythonProcess = spawn(pythonPath, args)

pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString())
});

pythonProcess.stderr.on('data', (data) => {
    console.log(data.toString())
});
```

`spawn` calls the python script called 'keypress.py' with allTexts sent as argument. `stdout` and `stderr` listen for success
and error messages flushed by the process respectively. `data` is recieved as `Buffer` object and has to be converted to `String` first
to be readable.

Now, in `keypress.py` file, we extract all characters to be typed and press respective keys sequentially using `pyautogui.press` method.

```python
texts = sys.argv[-1]
for text in texts:
    pyautogui.press(text, pause=0.033)
```
You can change the value of `pause` to tune the typing speed that you want. Final result looked like this.
<video autoplay muted loop style="width: 100%;"> <source src="/img/fastest.mp4" type="video/mp4"> </video>

Cool, isn't it? Everything worked as expected. But I still need to validate its me who typed. So I automated login tasks with my
credentials and was able to get the certification too. It was a fun thing to program.
If you want to checkout the full code, here's a [link](https://github.com/isaurav0/typebeater) to github repo.
Change credentials and beat all typing tests.