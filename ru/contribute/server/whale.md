---
title: "Whale Architecture"
---










# Abstract

# Motivation

# Stack

# Data flow

```mermaid
graph LR;
    frontend[Whale Front-end]-->api[Whale API]
    subgraph API
        api-->backend[Whale Backend]
        api-->proxy[Proxy]
    end

    proxy-->auth[Authentication Service]
```