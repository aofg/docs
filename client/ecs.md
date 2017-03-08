---
title: Rentitas and Entity-Component-Systems
navigation: Rentitas & ECS
---

Smallest part of packages is a **[Components]**. It's the raw data for one aspect of the _entity_. **[Entity]** is nothing more then just containers. They don't care about anything and just provide methods to add, remove and modify components. As result of working with their compoents raise corresponding events to a systems.

Components should be simple as possible and don't create any logic, here is real example of `Name` component:
```cs
public class Name : IThingsComponents 
{
  public string Value { get; set; }
}
```

And example of usage it:
```cs
playerEntity.UpdateName("KILLER_2008");
```

> <small>Information</small><br/>
> Why component is a class not a structure? <br>Because of groups, reusage and caching. More details in [Rentitas](https://github.com/alerdenisov/Rentitas)

---

Another part of libraries is a **[Systems]**. They're listening entity's events and react on them. Systems is only one way to implement logic of library. Any logic work should be started at corresponding event: on start, each update or when some data has been changed.

> <small>Information</small><br/>
> An example of a name update is a line of code from the system

Behaviour of system execution configures by corresponding interface: `IInitializeSystem`, `IExecuteSystem`, `IReactiveSystem<>`, `ICleanupSystem`.

[Systems] live inside a [Scenario]

Pool is 





### See also:
- [IPackage] — base package interface (should be implemented to load succesefully)

[client]:/client/README.md
[IPackage]:/api/client/IPackage.md
[Kernel]:/api/client/Kernel.md
[Components]:/client/ecs.md#Component
[Entity]:/client/ecs.md#Entity
[Systems]:/client/ecs.md#Sytems
[Pool]:/client/ecs.md#Pool
[Scenario]:/client/ecs.md#Scenario
[Trusted libraries]:/client/packages.md#Trusted