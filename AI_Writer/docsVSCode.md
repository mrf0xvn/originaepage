---

### **Step 1:**

On Windows, navigate to:
`C:\Users\<your folder user name>\.codex`

Find the file named **config.toml** and open it to edit.

Delete all existing content and paste the following config, then save:

```
model = "cx/gpt-5.4-xhigh"
model_provider = "KenDev-API"
sandbox_mode = "danger-full-access"

# Available KenDev-API models:
# cx/gpt-5.4
# cx/gpt-5.4-xhigh
# cx/gpt-5.4-high
# cx/gpt-5.3-codex
# cx/gpt-5.3-codex-xhigh
# cx/gpt-5.3-codex-high
# cx/gpt-5.3-codex-low
# cx/gpt-5.3-codex-none
# cx/gpt-5.3-codex-spark
# cx/gpt-5.2-codex
# cx/gpt-5.2
# cx/gpt-5.1-codex-mini
# cx/gpt-5.1-codex-mini-high
# cx/gpt-5.1-codex-max
# cx/gpt-5.1-codex
# cx/gpt-5.1
# cx/gpt-5-codex
# cx/gpt-5-codex-mini

[model_providers.KenDev-API]
name = "KenDev-API"
base_url = "http://14.225.255.58:20128/v1"
wire_api = "responses"

[windows]
sandbox = "unelevated"
```

---

### **Step 2: Configure auth.json**

Go to:
`C:\Users\<your folder user name>\.codex`

Find the file **auth.json**, delete everything inside, and paste the following:

```json
{
  "auth_mode": "apikey",
  "OPENAI_API_KEY": "<your key>"
}
```

Save and exit.

---

### **Notes:**

* You may lose previous chat sessions.
* Open **VS Code → Extensions**, install **Codex**, and make sure you're using the latest version before configuring.
* After finishing the setup, restart VS Code. If it looks like the expected result (as in the image), then everything is working correctly.

---

### **Limitations:**

* Currently, subagents are not working, so it runs independently only.
* To change the model, edit this line in `config.toml`:

```
model = "cx/gpt-5.4-xhigh"
```

---

### **Supported models (working well):**

```
# cx/gpt-5.4
# cx/gpt-5.4-xhigh
# cx/gpt-5.4-high
# cx/gpt-5.3-codex
# cx/gpt-5.3-codex-xhigh
# cx/gpt-5.3-codex-high
# cx/gpt-5.3-codex-low
# cx/gpt-5.3-codex-none
# cx/gpt-5.3-codex-spark
# cx/gpt-5.2-codex
# cx/gpt-5.2
# cx/gpt-5.1-codex-mini
# cx/gpt-5.1-codex-mini-high
# cx/gpt-5.1-codex-max
# cx/gpt-5.1-codex
# cx/gpt-5.1
# cx/gpt-5-codex
# cx/gpt-5-codex-mini
```

---

