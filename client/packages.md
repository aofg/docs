---
title: Client packages overview
navigation: Packages
---

## Summary
**Package** is a strict form of data that implements some additional feature of [client] application. Inside package application could find next kind of data:
- **Managed C# library** — precompiled .dll library
- Any amount of **Lua scripts** 
- Bundled content resources

## C# libraries
Age of Guilds is using C# as a primary language to implement of the core features. It's pretty oblivious in case of Unity, but as alternative we've the LUA. Let's compare them:

Statement                                                      | C# | LUA
--------                                                       |----|-----
Low-level access to other packages                             | ✔️️ | ❌ 
Completely safe for the user                                   | ❌ | ✔️️ 
Could be loaded at runtime                                     | ✔️️ | ✔️️ 
Could introduce API for other packages                         | ✔️️ | ✔️️ 
Could implement static type of data ([components][Components]) | ✔️️ | ❌ 
Executes in other thread then rendering                        | ❌ | ✔️️ 
Easy to implement small features                               | ❌ | ✔️️ 

We could to continue the list, but already oblivious C# isn't great at all things. And most important is a rights. For a safety reasons we don't allow to execute third-party DLL without the user's permissions. Of couse, [trusted libraries] has a rights by default. 

### Rights and safety
Because of possibility to load third-parties libraries and design of C#, we're asking users about right to execute library at first start as well as after updates. 

We thought about the separation of access rights, but found it unnecessary. While libraries work in a shared environment, they can pass through defense and obtain data from inaccessible fields. It's how C# works.

### Anatomy of C# libraries
In general terms, C# library is a container of [Kernels][Kernel] that are a containers of **[Pools][Pool]** as well as a **[Scenario]**. **[Scenario]** define order of [systems] execution which listen of changes inside a [Pool] that is a service where **[entities][Entity]** are creating as well as destroing and managing. **[Entity]** is a container of **[Components]**. Blaah.. Let's take a look on sceme:

![](/_static/anatomy-0.png)

> <small>Information</small><br/>
> It's okay if you find it too complex. Because of it's core thing and LUA is a easiest way to implement something simple.

#### More information about architecture and conventions in corresponding section: [ECS](/client/ecs.md)

### Lua scripts
In opposite side of C# libraries lives Lua. It's simple way to implement logic without understanding of whole system.

Most important things what you should to know before we go:
- Lua scripts store data for future **only** inside special storage: `self:$store`
- Lua script will be executed at selected moment: on start, on each tick, when dependent data will been changed.
- Lua script doesn't change anything outside directly and can only commit request on change.

For example code of display current health as a label on screen:
```lua
function OnStart() 
  self.$injections.gameUI:createLabel('CurrentHealth', 0, 0, 150, 30)
function OnUpdate(dt)
  local current = self.$injections.player:get('Health').Value
  self.$injections.gameUI:getLabel('CurrentHealth'):updateText(tostring(current))
```

**Pretty simple, ins't?** It's because of extensions [API](/client/api/README.md)!

#### See also:
- [Tutorial: Simple package](/guides/simple/README.md) — your very first package
- [ECS and Rentitas](/client/ecs.md) — heart of AOFG as well as C# libraries
- [Extensions API](/client/api/README.md) — easiest way to change someting
- [Trusted libraries](/client/trusted.md)


[client]:/client/README.md
[IPackage]:/api/client/IPackage.md
[Kernel]:/api/client/Kernel.md
[Components]:/client/ecs.md#Component
[Entity]:/client/ecs.md#Entity
[Systems]:/client/ecs.md#Sytems
[Pool]:/client/ecs.md#Pool
[Scenario]:/client/ecs.md#Scenario
[Trusted libraries]:/client/packages.md#Trusted