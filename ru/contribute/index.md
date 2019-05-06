---
title: "Общая информация"
description: "Общая информация о разработке Age of Guilds"
---

**Age of Guilds** разрабатываемая коммьюнити многопользовательская игра, где игроки присоединяются к группе других игроков и принимают на себя определенную роль для продвижения гильдии к цели и достижению общего успеха. Вместе (как группа) игроки должны следить за общим состоянием их гильдии и противодействовать вражеским силам (как неигровым персонажам, так и другим игрокам) цель которых противодействовать успеху других групп.

Разработка проекта такого масштаба – сложная задача. Для упращения разработки мы выделили три почти независимых конвеера разоработки:
* [Server engineering](/en/contribute/server/index.md)
* [Client development](/en/contribute/client/index.md)
* [Content production](/en/contribute/content/index.md)

## Основные особенности

### Удобство разработки
Age of Guilds разрабатывается на широко известном и популярном игровом движке – ~~[Unity](https://unity3d.com)~~. Это приносит огромное количество готовых инструментов, позволяющих увеличить продуктивность разработки и качество конечного продукта. Больше информации в ~~[Инструменты и технологии](/en/contribute/client/tech-stack.md)~~

### Data-oriented design
Age of guilds придерживается DOD подхода в разработке. Состояние игры – это коллекция всех сущностей и ассоциированных с ними данных (комнопентов), когда _будущее состония_ – результат применение всех систем над текущим состояние. Подробнее в ~~[Entity Component System](/en/contribute/ecs.md)~~

### Воксели
Миры в Age of Guilds создаются из трехмерных пикселей (~~[вокселей](/en/contribute/client/voxel.md)~~) с невероятным уровенем детализации. Каждый кубический метр мира содержит 32 768 (32\*32\*32) вокселя.

### Децентрализация
The world of Age of Guilds is a collection of independent realms which hosted as well as found by peers. 

### Real enomonic system
Any entities were made of ~~[SHARDs](/en/economics/shard.md)~~. SHARD is valuable, limited resource spreaded between early adopters, developers and contributors to maintain and host realms. 
SHARDs stored and managed as crypto token in public blockchain network.