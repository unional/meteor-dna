# API Documentation for DNA
Datum Network Architecture has the following set of APIs:

* **Datum Raw Database API**: This API allow direct access to the database. Current implementation is based on mongodb so the design language is heavily influenced by it. This API is more subject to change as the architecture matures. This API resides under `Dna.datums`.
* **Datum API**: This API provides abstracted access to DNA. All interactions are scoped to the Datum level and user of this API do not requires to understand how the information are stored in the database. This API resides under `Dna.Datum`.
* **DNA system API**: This API provides a fully functional system for user to interact with DNA. It includes caching and referencing of searches and other state managements so that user can interactive with DNA as an application. This API resides under `Dna.app`. **I'm envisioning this like a command line application without the display. More like a scripting language such as python/ruby for DNA.**

## Refer to source doc or generated API Doc.
