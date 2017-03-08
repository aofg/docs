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
Complete safe for user                                         | ❌ | ✔️️ 




### See also:
- [IPackage] — base package interface (should be implemented to load succesefully)

[client]:/client/README.md
[IPackage]:/api/client/IPackage.md