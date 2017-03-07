---
title: Age of Guilds Server
navigation: Overview
---

# Age of Guilds Server solution
First version of AOFG and prototype is based on [ServUO](https://github.com/servuo/servuo), but in future we 'll move to [SpatialOS](https://spatialos.improbable.io/) completelly. If you're ready to research and help us to do this: go to discussion on ~~issue~~forum or join to gitter.

## Ultima Online as a reference
As you already know (if not it's a perfect time to find out) AOFG is modern version of Ultima Online. Not so simple, but it's true. Very first and core inspiration is a old OSI-style Ultima Online.

Why it's important? Because, when we're speaking about server is a place where game is lives. Client is just remote viewer. Each game mechanic should (and will) be implemented on server side. Hence there is a fact: server can be splitted on few parts: **backend** and **gameplay**.


## Backend
From a backend solution we're waiting:
- Stable and fast communication protocol
- Lossless data storage
- Scalability (clustering)

#### More information in [Backend Section](/backend/readme.md)


## Gameplay
From game logic middleware we're waiting:
- Easy way to implement any idea
- Thread safety and concurrency resources
- Clean and simple API from anything to anything

#### More information in [Gameplay Section](/gameplay/readme.md)
