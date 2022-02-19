EARP - Enhanced Automated Reporting Platform Version 2.0
========================================================
The **Enhanced Automated Reporting Platform** is a real-time, persistent, document/data processing system aimed primarily at compliance functions in highly regulated environments such as financial services, gaming operations, food safety and telecommunications. What makes it ideal for such environemts is its that the system sacrifices performance in order to ensure a high-level of data persistence and security. Each process is segregated in order to emulate *real-life* situations when processing information. In highly regulated environments departments work as federated functions having internal controls between each department to ensure that there is an arms-length approach towards data processing.  Modern software design normally implements access controls based on roles and group roles of the person accessing the system. However these access control are limited to the upper layers of the application such as during User Interface. Deep down the system is using shared code. The EARP introduces a middle layer between the shared code and the User Interface and data storage. This middle layer allows departments to own their own code. The EARP even allows each department to code their own functions using a rules-based engine without the need of having to resort to software development.

The rules-engine faciliates the process of creating rules. It works on a simple paradigm - *if `condition` then `action`*.

More information on the rules-engine is provided below.

The other critcal feature of the EARP is data persistence. The application does not use computer memory to intermittently store data between processes. Instead it works from a hard copy of the data after being comitted from the previous process. When a process is complete, a new version of the processed data is comitted for other process to use further down the pipeline. Such design sacrifices some performance but in return ensures a high degree of datapersistency. It is possible to pull the plug on the entire EARP at any moment in time and when it restarts it continues exactly where it left off without any user intervention or loss of data.

Documents can be uploaded to the platform using different technologies such as FTP, HTTP and S3. The new version can also process data blobs and streaming data resulting from RSS feeds, Web-sockets, MQTT and AMQP.



The most distinctive functional differentiation in the new version is the addition of a rules engine that works on functions rather static parameters.

Conventions
-----------
In this document the following conventions are used:

* `Application` and `EARP` means the Enhanced Automated Reporting Platform.
* `Owner` means the owner of a task or process.
* A `task`  is made from one or more `processing_units` that collectively carries out a complete a *real-life* function

Programming Languages Used
----------------------------
The Application is written entirely in **javascript** using **nodeJS framework.**


Overall Structure of the Application
----------------------------
The main purpose of the application is to process any form of data. The processing can be on the data itself or its metadata. Beofre any data can be processed a list of processing modules have to be outlined together with how the data flows from one module to another. This is done by building a [Directed Graph](https://en.wikipedia.org/wiki/Directed_graph) of nodes and edges.

Rules Engine
----------------------------
[Overview](docs/rulesengine/Rules-Engine.md)
[Flow Controls](docs/rulesengine/Flow-Control-API.md)
