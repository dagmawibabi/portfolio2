---
title: Claude in GTA SA
date: 2026-11-27
description: A quick and simple guide on how to set up Claude in GTA SA, a GTA San Andreas mod I made where you can talk to Claude inside the game, make it follow you as a character and even run cheats for you.
category: "Tech"
---

![image](/blog-images/ClaudeInGTASA/banner.webp)

So I was setting up GTA San Andreas again with some graphics mods and one thing led to another and now Claude lives inside the game. You type `claude` like a cheat code, a chat box pops up, you ask it something and it answers you right there on the screen as subtitles. And it doesn't just talk. It can spawn cars, change the weather, run cheat codes, follow you around as a character, help you with the mission you're currently on and even make everyone on the street follow you and fall down worshipping you. Yes, that last one is real lol.

Here's a quick demo of it in action.

![Claude in GTA SA demo](/blog-images/ClaudeInGTASA/demo.mp4)

This is a very quick guide on how to get it running. So let's get to it.

### What You Need

Before anything, here is what you need.

1. **GTA San Andreas v1.0 US**

   This is the version most PC mods are made for (the HOODLUM or "compact" exe). If you have the Steam or Rockstar Launcher version you'll have to downgrade it first, otherwise the mod will NOT work.

2. **Ultimate ASI Loader**

   This is what lets the game load mods. Get `Ultimate-ASI-Loader.zip` (the one WITHOUT `_x64`, GTA SA is a 32-bit game) from [here](https://github.com/ThirteenAG/Ultimate-ASI-Loader/releases) and put `dinput8.dll` in your game folder, right next to `gta_sa.exe`.

3. **CLEO 4.4**

   The scripting library the mod runs on. Get `CLEO4.zip` from [here](https://github.com/cleolibrary/CLEO4/releases) and copy `CLEO.asi`, `bass.dll` and the `cleo` folder into your game folder. Don't copy its `vorbisFile.dll` and `vorbisHooked.dll`. That's another ASI loader and you already have one. Two loaders = mods load twice = crash. Ask me how I know.

4. **Python 3**

   Get it from [python.org](https://www.python.org/downloads/) and make sure you tick **"Add python.exe to PATH"** during the install.

5. **Claude Code**

   This is how the mod actually talks to Claude. Install [Claude Code](https://claude.com/claude-code), open a terminal, type `claude` and log in with your Claude account once. That's it, you don't touch it again.

6. **SilentPatch** (recommended)

   Not required but it fixes a ton of the game's old bugs. Get `SilentPatchSA.zip` from [here](https://github.com/CookiePLMonster/SilentPatch/releases) and put it in a `scripts` folder in your game folder. Quick tip: if you have two monitors and the game closes right after the "Device Selection" window, open `SilentPatchSA.ini` and set `UseDesktopRefreshRate=0`. That one took me a while to figure out.

### Installing the Mod

Now the easy part. [Download Claude in GTA SA](/blog-images/ClaudeInGTASA/Claude%20in%20GTA%20SA.zip) (it's tiny, about 19 KB), extract it and copy EVERYTHING into your GTA San Andreas folder (the one with `gta_sa.exe`). Your folder should look something like this:

```
GTA San Andreas/
├── gta_sa.exe
├── dinput8.dll
├── CLEO.asi
├── bass.dll
├── Play GTA with Claude.bat
├── cleo/
│   └── claude_chat.cs
└── claude_chat/
    ├── bridge.py
    ├── settings.json
    └── Start Claude Chat.bat
```

### Playing

1. Double-click **`Play GTA with Claude.bat`**. It starts the Claude bridge in a small window and then opens the game. Keep that window open while you play.
2. Load your save (or start a new game).
3. Type **`claude`** on your keyboard, just like you'd type a cheat.
4. Type your message and press **Enter**. Backspace on an empty line closes the box.

Claude takes a few seconds to answer so think of it like texting a friend, not a live call. You can keep playing while you wait.

### Things to Try

- `where am i?`
- `follow me` → Claude spawns as a girl and follows you around, gets in your car and fights with you
- `be a guy` or `be a nurse` → changes how she/he looks
- `give her an AK`
- `make everyone follow me` → everyone around you, even people driving, comes and stands in a circle around you
- `worship me` → and now they all fall down around you lol
- `let them go`
- `give me a jetpack` or `give me full health and money` → it types the actual cheat codes for you
- `how do i do this mission?` → it knows which mission you're on
- `stop commenting` → Claude also reacts to things on its own (wanted stars, low health, missions starting), this turns that off

### If Something Goes Wrong

- **"No reply from Claude"**: the bridge window isn't running. Start the game with `Play GTA with Claude.bat` instead of `gta_sa.exe`.
- **Typing `claude` does nothing**: CLEO isn't loading. Make sure `dinput8.dll`, `CLEO.asi` and the `cleo` folder are all next to `gta_sa.exe`.
- **The game crashes on start**: try removing your other mods one by one. In my case it was a widescreen fix that didn't like my dual monitor setup.
- **Want faster but dumber answers?** Open `claude_chat/settings.json` and change `"sonnet"` to `"haiku"`.

Every message (and every reaction) uses your Claude usage just like a normal chat, so keep that in mind.

### My Thoughts

![You: hey claude you there?](/blog-images/ClaudeInGTASA/hey-claude.webp)

![Claude is thinking...](/blog-images/ClaudeInGTASA/thinking.webp) ![Claude: Yeah homie, I'm here](/blog-images/ClaudeInGTASA/reply.webp)

Modding this game was so fun, [CLEO](https://github.com/cleolibrary/CLEO4/releases) is what I used for this mod, it's the scripting library and it's pretty darn good and easy to understand, not to mention very up-to-date, and I went into a whole new rabbit hole of game modding and sites I haven't seen before and this is just the surface, there's so much that can be done with script mods and AI. 

Doing this feels like some weird mashup of the future and the past. Putting a 2026 technology inside a game made 21 years ago is just epic! Reading "Claude is thinking..." while the scene is some low poly art style limited by the tech of its time is a bit poetic tbh. For context when the game came out, the PS2 only had 32MB of RAM and 300 MHz CPU. Then there's Claude running in massive datacenters.

San Andreas was one of my most favorite games, and now it's even more. Just epic!
