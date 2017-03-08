---
title: Client overview
---

## Summary information
Age of Guilds client is fully written on [Unity3d]. Why we choice unity? Primary is expertize reasons: [Aler Denisov](@alerdenisov) has more than six years of experience with Unity. But in other hand unity have a lot of advantages, such as:
- Friendly engine with nice learning curve
- Excellent documentation and amount of training materials
- CSharp is great as middleware language
- Great and huge community
- Unlimited possibilities without low-level code


## Structure of client
As a huge project, AOFG requires a structure that allows to implement new features as well as maintain previous. At base of any system stays: _data_, _logic_ and _bus_. 

- The data layer of structure is a way to handle any kind of information required to make system live.
- The logic layer defines the way of interaction with the state.
- The bus layer is a road for data events or in other words: the path of notification logic on the change data

No matter what kind of system we're implementing, data, logic and bus is already required. AOFG wants to manage that as well as possible with next requirements:

- **Modular** — extend layers with external modules agains solid system
- **Safe** — allow to user decide what kind of information is available for module (read\write rights)
- **Strict** — strong conventions and one-way to implement

Here is born the next structure:

![](/_static/client-structure-0.png)

**Binary** is a final execution file of game that loads required (based on configs) list of dependencies (packages) from local cache or remote repository. **Package** is strict form of part of system. Final binary doesn't care about amount of packages required to 
makes game live, but binary can to load them as well as execute.

More information about [packages in a certain section][packages].

[Unity3d]:https://unity3d.com
[packages]:/client/packages.md