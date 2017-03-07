---
title: Client overview
---

## Summary information
Age of Guilds client is fully written on [Unity3d]. Why we choice unity? Primary is expertize reasons: [Aler Denisov](@alerdenisov) has more than six years of experience with Unity. But in other hand unity have a lot of advantages, such as:
- Friendly engine with nice learning curve
- Excellent documentation and amount of training materials
- CSharp is great as middleware language ([more details][csharp])
- Great and huge community
- Unlimited possibilities without low-level code

## Structure of client
As a huge project, AOFG requires a structure that allows to implement new features as well as maintain previous. 

![Alt text](https://g.gravizo.com/g?
@startuml;
%28*%29 --> if "Some Test" then;
  -->[true] "activity 1";
  if "" then;
    -> "activity 3" as a3;
  else;
    if "Other test" then;
      -left-> "activity 5";
    else;
      --> "activity 6";
    endif;
  endif;
else;
  ->[false] "activity 2";
endif;
a3 --> if "last test" then;
  --> "activity 7";
else;
  -> "activity 8";
endif;
@enduml
)

[Unity3d]:https://unity3d.com
[csharp]:#CSharp