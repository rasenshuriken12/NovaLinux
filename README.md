# NovaLinux 🖥️

### A Browser-Based Linux Desktop & Terminal Simulator

NovaLinux is an interactive **Linux-inspired operating system simulator** that runs directly in a web browser. It provides a simulated desktop environment with a terminal, virtual file system, system utilities, and everyday applications such as Calendar, Clock, Notes, Files, and Settings.

The project is designed for **learning, experimentation, and demonstrating operating-system concepts** without requiring a real Linux installation.

> **Note:** NovaLinux is a simulation. It does not run an actual Linux kernel or execute commands on the host operating system.

---

## ✨ Features

### 🖥️ Desktop Environment

* Linux-inspired desktop interface
* Top bar and system controls
* Application launcher
* Dock
* Quick settings
* Window management
* Shutdown/halt screen

### 💻 Terminal Simulator

Practice Linux-style commands through an interactive terminal.

Supported commands include:

```text
ls       cd       pwd       cat      echo
touch    mkdir    rm        cp       mv
head     tail     wc        grep     find
locate   tree     stat      sort     uniq
rev      uname    whoami    id       hostname
arch     lscpu    env       ping     wget
```

The terminal provides:

* Command history
* Working-directory navigation
* Linux-style prompts
* Tab completion
* Simulated system information
* Realistic command output

### 📁 Virtual File System

NovaLinux includes a simulated file system that behaves similarly to a basic Linux directory structure.

Users can:

* Create files and directories
* Remove files
* Copy and move files
* Read file contents
* Navigate directories
* Search files
* Inspect file information

The virtual file system is stored using the browser's **localStorage**.

### 🧰 Built-in Applications

| Application | Purpose                              |
| ----------- | ------------------------------------ |
| Terminal    | Practice Linux commands              |
| Files       | Explore the virtual file system      |
| Help        | View available commands and features |
| Nova AI     | Offline command explanation          |
| Calendar    | Manage and view dates                |
| Clock       | Display time                         |
| Notes       | Create and store notes               |
| Settings    | Configure simulator preferences      |

---

## 🏗️ Project Architecture

NovaLinux is primarily built using **HTML, CSS, and JavaScript**.

```text
novalinux/
│
├── index.html
├── build.py
├── README.md
│
├── css/
│   ├── 01-base.css
│   ├── 02-apps.css
│   └── 03-phone.css
│
└── js/
    ├── 01-core.js
    ├── 02-fs.js
    ├── 03-commands.js
    ├── 04-window-manager.js
    │
    ├── apps/
    │   ├── 05-terminal.js
    │   ├── 06-files.js
    │   ├── 07-help.js
    │   ├── 08-nova-ai.js
    │   ├── 09-calendar.js
    │   ├── 10-clock.js
    │   ├── 11-notes.js
    │   └── 12-settings.js
    │
    ├── 13-shell.js
    └── 14-boot.js
```

### Core Components

**Core System**
Handles global state and common utilities.

**Virtual File System**
Provides the simulated directories, files, and file operations.

**Command Engine**
Implements Linux-style commands and generates simulated output.

**Shell**
Connects terminal input with the command engine.

**Window Manager**
Controls application windows and desktop interactions.

**Applications**
Individual JavaScript modules implement the built-in applications.

**Boot System**
Initializes the simulator and starts the desktop environment.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rasenshuriken12/NovaLinux.git
cd Novalinux
```

### 2. Run the Project

Since NovaLinux is a browser-based application, it can be served using Python's built-in HTTP server:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

in your browser.

---

## 🔨 Building the Standalone Version

NovaLinux includes a Python build script that combines the project's CSS and JavaScript files into a standalone HTML file.

Run:

```bash
python3 build.py
```

The generated standalone file can be used for sharing or archiving the simulator without requiring the original project structure.

---

## 💾 Data Storage

NovaLinux uses browser **localStorage** to persist simulator data.

Examples include:

```text
nova-fs
nova-notes
nova-settings
nova-hist
nova-events
nova-qs
```

Because the data is stored locally in the browser, it is tied to the browser origin being used.

For example:

```text
file://
```

and

```text
http://localhost:8000
```

may have separate stored data.

---

## 🎯 Learning Objectives

NovaLinux can be used to understand concepts such as:

* Operating-system interfaces
* Linux command-line workflows
* File systems
* Shells and commands
* Process/system information
* Window management
* Application architecture
* Browser storage
* Modular JavaScript
* Frontend state management
* Software simulation

It can also serve as a foundation for experimenting with more advanced concepts such as simulated processes, permissions, users, networking, package management, and system monitoring.

---

## ⚠️ Limitations

NovaLinux is intentionally a **simulation**, so commands do not interact with the real operating system.

For example:

```bash
rm file.txt
```

only modifies NovaLinux's virtual file system.

It does **not** delete files from your computer.

Similarly, simulated commands such as `ping`, `wget`, or system-information commands generate simulated results rather than performing unrestricted host-level operations.

---

## 🔮 Future Improvements

Potential future features include:

* Simulated user accounts and permissions
* Process manager
* CPU and RAM monitoring simulation
* Package manager
* Simulated networking
* More Linux commands
* File permissions such as `chmod` and `chown`
* Simulated `/proc` and `/sys`
* More desktop customization
* Improved mobile interface
* Terminal scripting support
* Virtual applications marketplace
* AI-powered Linux tutoring
* Interactive OS learning challenges

---

## 🛠️ Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript**
* **Python** — build tooling
* **Browser localStorage**
* **Linux-inspired CLI concepts**

No external backend is required to run the core simulator.

---

## 📚 Project Purpose

NovaLinux was created as an educational and experimental project that combines **web development and operating-system concepts** into an interactive environment.

Instead of simply reading about Linux commands, users can interact with a simulated computer, explore its file system, open applications, and practice terminal commands in a safe environment.

---

## 🤝 Contributing

Contributions and improvements are welcome.

A typical workflow is:

```bash
git checkout -b feature/my-feature
```

Make your changes, test the simulator, and then submit a pull request.

When adding new JavaScript modules, maintain the existing numbered load order and update `index.html` accordingly.

---

## 📄 License

Add your preferred license here, for example:

```text
MIT License
```

---

### ⭐ If you find NovaLinux useful, consider starring the repository!





