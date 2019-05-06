---
title: "Общая информация"
description: "Общая информация про разработку игрового клиента Age of Guilds"
---

Игровой клиент Age of Guilds придерживается модульной архитектуры и разрабатывается на игровом движке Unity. 

# Исходный код и репозитории

Основной репозиторий клиента aofg-client, содержит Unity-проект с UPM зависимостями. 

1) Выполните в терминале/командной строке: `git clone https://github.com/aofg/aofg-client.git`
2) Откройте склонированный проект в Unity 2018.3 или моложе
3) Дождитесь установки зависимостей (может занять некоторое время)
4) Запустите проект

# Entity Component Systems

# Модульная архитектура



# Архитектура проекта

```mermaid
graph LR;
    module[Module Loader]-->render[Rendering Modules]
    subgraph Rendering
        render-->world2buffer[World to Volume Buffer]
        render-->buffer2image[Volume Buffer to Image]
    end
    
    module-->network[Networking Modules]
    subgraph Networking
        network-->netclient[Client Connection]
        network-->prediction[World State Predition]
        network-->interpolation[World State Interpolation]
    end
    
    module-->world[World Modules]
    subgraph World
        world-->mobiles[Moblies]
        world-->static[Environmnet]
        world-->dynamic[World Entities]
        world-->actions[Interaction]
    end

    module-->input[Player Input Modules]
    subgraph Input
        input-->mouse[Mouse & Keyboard Input]
        input-->gamepad[Gamepad Input]
        input-->bot[Bot API]
    end

    module-->account[Authentication Modules]
    subgraph Authentication
        account-->crypto[Cryptographic Signature]
        account-->offchain[Offchain Communication]
        account-->onchain[Blockchain Communication]
    end
```

## Модули Age of Guilds

Весь программный код клиента упакован в отдельные модули и взаимодействует через обмен

## Системные требования

| | Минимальные | Рекомендуемые |
|:-|:-|:-|
| **Операционная система** | MacOS X 10.14 или Windows 10 | |
| **Центральный процессор** | 4 ядра на 2.4 GHz | 8 ядер на 3 GHz |
| **Оперативная память** | 8 GB | 16 GB |
| **Видео-карта** | GTX 1050 4 GB | GTX 1070 TI 8GB |
| **Хранилище** | 7200 RPM HDD | SSD |



* Rendering
* Networking
* User Interfaces
* Modding