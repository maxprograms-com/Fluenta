# Fluenta DITA Translation Manager

![Fluenta logo](https://www.maxprograms.com/images/fluenta_128.png)

Fluenta manages the translation workflow of DITA projects by combining two open standards from OASIS: *DITA* and *XLIFF*.

If your workflow involves DITA content and requires a structured, standards-based translation process, Fluenta provides a consistent way to prepare, manage, and deliver translations.

---

## Typical workflow

1. Analyze the DITA project structure
2. Extract translatable content into XLIFF
3. Translate using CAT tools
4. Reintegrate translations back into the DITA project

---

## Why Fluenta

- Designed specifically for DITA translation workflows
- Uses XLIFF for interoperability with CAT tools
- Handles complex DITA features such as conref, keyref, and specialization
- Designed for large, structured DITA documentation projects
- Reduces manual file handling by generating consolidated translation packages

---

## How it works

Fluenta follows the workflow defined by the OASIS DITA Adoption Technical Committee. For details, see:

- <https://www.maxprograms.com/articles/ditaxliff.html>
- <https://www.ditatranslation.com/articles/ditaxliff.html>

---

## Installation

Download ready-to-use installers (recommended):

👉 <https://www.maxprograms.com/products/fluentadownload.html>

---

## Building from source

### Requirements

- Java 21 LTS (<https://adoptium.net/>)
- Gradle 9.2 or newer (<https://gradle.org/>)
- Node.js 24.14.0 LTS or newer (<https://nodejs.org/>)

### Build

```bash
git clone https://github.com/rmraya/Fluenta.git
cd Fluenta
gradle
npm install
```

### Run

```bash
npm start
```

---

## Source code and subscriptions

Fluenta source code is available on GitHub and can be downloaded, compiled, modified, and used free of charge.

We offer subscriptions that include installers, technical support, bug fixes, and feature requests. Subscription fees support ongoing development and help maintain the quality and reliability of Fluenta.

The version included in the official installers can be used with a free 30-day trial by requesting an evaluation key. After the trial period expires, a subscription is required.

Subscription keys are available from the Maxprograms Online Store and cannot be shared or transferred between machines.

Subscription version includes unlimited email support at [tech@maxprograms.com](mailto:tech@maxprograms.com).

Installers may occasionally be updated before the corresponding source code changes appear in this repository. Source code updates are published later, once they are ready for release.

---

## Differences summary

| Differences | Source Code | Subscription Based |
| ----------- | :---------: | :----------------: |
| Ready-to-use installers | No | Yes |
| Notarized macOS launcher | No | Yes |
| Signed launcher and installer for Windows | No | Yes |
| Headless mode (CLI scripts) | No | Yes |
| Technical support | Peer support at <https://groups.io/g/maxprograms/> | Email + peer support |

---

## Legal

License information for all included components is available in the [licenses](licenses/README.md) directory.
