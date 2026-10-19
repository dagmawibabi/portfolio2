---
title: My Thoughts on Vibe-coding 
date: 2026-10-19
description: I’m going to cover two ideas, one is my thoughts on vibe-coding and two, how I personally use AI in my projects and work. So let’s just dive in…
category: "Tech"
---

![image](/blog-images/MyThoughtsOnVibeCoding/MyThoughtsOnVibeCoding.jpg)

I would like to keep my thoughts precise and short for this piece, so let’s get to it. I’m going to cover two ideas, one is my thoughts on vibe-coding and two, how I personally use AI in my projects and work. So let’s just dive in…

Vibe-coding has been trending for a while now, and it seems to be the great big savior from manual software programming for both technicals and non-technicals. Then social influencers took over and both good and bad software engineers started promoting it and brought forth the software slop era. Vibe-coding, like anything tech, has both pros and cons. The pros are being preached everywhere, like fast ideation, prototyping, personal apps, helping non-technicals make software and few more that usually revolve around the entrance level of software engineering for non-technicals and revolving around efficiency while writing code for technicals. But I would like to focus on the cons, mostly because you need to be presented an unbiased perspective of both sides. So here are some narratives you are missing out…

1. **The people telling you to vibe-code are great engineers themselves**

A properly trained software engineer can produce incomparably greater vibe-coded projects than a non-technical. So if you think you are learning to be a software engineer and considering yourself as a programmer just because of your vibe-coded projects, I’m sorry but you’ve been lied to. The same model in the hands of you and another good software engineer, tasked with building the same app idea, will produce far different apps — meaning it’s the person in the driver seat that determines the output quality often. In-fact a software engineer using a previous frontier model will produce far better sites than a non-technical using the latest frontier models.  

This gap is even wider when the project requires external connections that manually require you setting up accounts, configuring systems and scouting for resources and tools to use. System design is also another important topic that most people lack and refuse to learn and trust the design of these models. The people telling you to vibe-code are great engineers themselves, take away their coding models today and they’ll get right back into building quality products unlike you who sadly can’t do the same. If vibe-coding is all that matters, then ask yourself why OpenAI isn’t hiring you, an avid vibe-coder, than that 5x engineer who completed their leetcode regularly?

2. **You are a meat-proxy if you don’t learn while vibe-coding**

A friend told me this term, and I really liked it. The concept is this: when you’re vibe-coding, say for 40 minutes, and you’re waiting for completion or doing some other task meanwhile. You are giving 40 minutes of your life that you’re not getting back. Gone, just like that! 

As amazing as AI has been, learning has declined across fields. So for you to sit for 40 minutes, doom scrolling while the task is complete is such a horrible waste of your life. So here is my suggestion. Though reviewing every line of the code produced is not manageable (unless you’re working on the firmware of pacemakers lol), you can ask the coding agent for what packages it used, what dependencies were considered, what the overall architecture and design is, and quiet frankly asking how it built some of the features. These are the steps you can take to actually learn in those 40 minutes. 

While working or building side-projects, I often make the coding agent generate technical markdown files for me to read. It’s been a practice for a long while for me and I have been learning a lot of new things through it. New approached, new tools in my inventory and furthermore it has let me understand the approaches and iron out some decision flaws it took and add more features building on what I’ve learnt. In-fact I generate so many of these markdown files I needed a markdown manager and reader. So use your time and money very well. Why would you spent 40 minutes of your life and $20 of your money to gain nothing of value?

3. **Vibe-coders from these AI companies aren’t using the same models as you**

Do you think Andrej Karpathy, the guy who coined the term vibe-coding, is using Opus 5.5 for his work at Anthropic? Do you think OpenAI engineers are using the same version of GPT Astra to build Codex? Most people in the AI ecosystem, specially close to SF, know that these companies don’t use the commercial version of the latest models, they often have a far better model internally used on their own products, and unprohibited unlike the commercial version. 

So when a person like Andrej tells you to vibe-code, he’s speaking in light of the absolute latest models they’re using internally, or the models they get early access to. So don’t beat yourself up thinking you couldn’t build the same things as them with your $100 subscription of Claude Max. 

4. **Other people aren’t accountable to your business, you are!**

Saddens me to see a lot of people telling others to stop caring for their product’s source and fully “embrace vibe-coding”. It’s so crazy to me that people were telling others to do this back in the Claude 3.5 Sonnet and GPT 4o era, while some others were doing this back in the GPT 3 era. Now I look back at those people and consider them to be the absolute dumbest people that have been advising unhealthy, uninformed, and hype fueled content to their followers. In-fact they had nothing to lose, they got the social media engagement and got their payouts, but you? Well you are stuck with your slop of a site made by Sonnet 3.5

So ignore the noise, I often unfollow a lot of people that usually farm engagement on socials. As much as I can I try to listen to the advices of people that use AI but also invest a lot of their efforts caring and understanding their products, training their own models, and who can get back into maintaining their products if their AI providers were gone today. I recommend people like Dax and The Primeagen on Twitter who I seem to consider very based in their opinions, are great engineers and are working on AI as well. 

5. **Every notable software product currently had it’s base written by humans**

The quality of output of AI models writing code from scratch and writing on top of an already established codebase are wildly incomparable. I have seen this first hand and at this point and it’s part of my current workflow. I usually build the starting core of my serious products personally or at work. In-fact, I sometimes take it slightly further and I don’t even let the AI initiate the boilerplate (eg: I actually manually create a folder and run `flutter create new_app` or `npx sv create` ) and then whatever is the important part for that project (could be the API and Database, or the design language) I start making it. Then it’s after a certain point that I start vibe-coding on top of. This has visible perks. One is that the AI will learn your pattern of coding and organization and follow along. So even if you want to review it’s far more manageable. Two is that it will learn your design taste much better. I’m not only talking about the UI design but also system design. 

So when a company like Vercel or Anthropic vibe-code during work, they’re building on top of massive codebases that were written by some of the best engineers they could find. So building on top of that they were able to out produce any other vibe-coded project out there. That’s not even the only case. Even companies that started off vibe-coded will hire good engineers once they get the investment and get their newly hired engineers rewriting some of the important pieces of the product manually. So you have to see that vibe-coding isn’t the technical solution, but a way of prototyping an idea, getting market hype and getting investors — after that these vibe-coded company founders don’t hire another vibe-coder, they hire another capable engineer that’s able to write code and system design. 

### The way I use AI in my workflows

I am a full stack web and mobile developer, I am also a DevOps engineer and can also train AI models from start to end, fine-tune and deploy. I usually make sites and apps for my clients at work, and I am building autonomous personal research agents at ScholarXIV. 

At work, some of my colleagues fully vibe-code on the work projects, but meetings are so embarrassing when they’re asked technical questions or even simple explanations of how their features work and they struggle to explain and see them quickly prompt their AI models for answers. I usually use to manually code at work, which made me slower to deliver than most of my colleagues, but I seem to be the only one who seem to understand the requirements and the functionality properly and was able to guide the product roadmap properly. 

The I opted in for vibe-coding, at first I fell for the “embrace vibe-coding” motto and just did it, but maintaining that app and going through the codebase to fix a tiny issue became the most traumatizing experience, not to mention I didn’t know what was going behind the scenes. That’s when I started generating markdown files and also making a living documentation for the project, and actually started auditing and working in smaller pieces. 

Then in ScholarXIV, I built the mobile app which has over 30k downloads manually, then when the time came to build the site, I rewrote and prototyped ScholarXIV around 5 times in 5 different tech stacks all manually. Then I proceeded to keep manually building some of the beloved features of ScholarXIV manually for nearly a year. At that point most of the important features and core flows (like research gathering, AI chats, design, and CI/CD) were all setup and working flawlessly. 

Then me and my team started vibe-coding on top of that solid base. My team is very excellent, I consider my co-founder to be the best Svelte dev in town, and our lead designer to be the best designer (and also an engineer btw) in the tech space. When these two people get tasks and use AI to build it they’ve been producing really good and working products with the ability to explain to me how they did it and what’s being used behind the scenes. 

And as for me, in ScholarXIV, I usually divide tasks with AI. I set and design the requirements and features I need, I even pick the exact packages and tools to use and then give the prompt of building what I wanted following the already established system and UI design. Then I pick another task within ScholarXIV and manually build it. In personal projects, I usually prototype and experiment a lot. I vibe-code and see some ideas come to life (like recently I built a decentralized social media app called Mentos) and through the process I learnt so much by asking technical question, exploring some different architectures and even asking it to ELI5. 

But there are things I don’t use AI for. Running my business is one, and training models is the other. My business decisions, that requires transaction of money, ads and marketing, cold reach and events are all handled manually. Then training and hosting models, benchmarking models and gathering and cleaning data is all a manual task. Which has been so exciting for me. Which is also something I recommend others to do. So that’s my workflow with AI. 

### Outro 

![image](/blog-images/MyThoughtsOnVibeCoding/BashForkBomb.jpg)

Programming is a way of solving a problem. It’s a way of looking at the world. It’s a really fun and exciting way. Programming isn’t writing code, it isn’t the output and it isn’t system requirement documents. It’s the whole process of thinking from start to finish, ins and outs. I recommend everyone to learn programming with any language they’re comfortable with, just like I recommend everyone to get the basics of calculus in Math. Before you start vibe-coding I recommend you to learn to create a site from start to finish, and be able to deploy it. This is useful for you as a person and will go to help you make even more useful and quality products when you start using AI models to code. 

Most of all, avoid the noise. It’s been like 2 years since people have spammed us with their slop sites but we haven’t seen any notable product built that way. Even the slop master product itself OpenClaw required a lot of manual coding to bring stability and security fixed, but even after all of that it’s still a mess of a project and products that were built properly from scratch like Meta’s Muse or Figure’s Hark are beating adoption and are far superior than OpenClaw. Remember OpenClaw has access to infinite tokens from OpenAI, while the other companies hired extraordinary engineers to build their own versions of proactive personal assistants. So avoid the noise, focus, and start building and solving a real problem.

The `:(){ :|:& };:` code in the image is a stylized version of the famous Bash Fork Bomb, it's a dangerous one-line shell command that repeatedly created new processes until the computer runs out of resources making the computer freeze and unresponsive. Most people don't know how to read this code, yet it's dangerous, unmaintainable and results in a catastrophe. Better yet, lots of influencers have been posting it and lots of people run it in their terminals and crashed their computers. This is how I see some vibe-coders, running code their don't understand, not learning what it does, unmaintainable and though it won't crash instantly, it will eventually lead to the collapse of it. So take care writing your fork bombs and releasing to production.
