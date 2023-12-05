let Editor

export const start = (elementId) => {
  Editor = ace.edit(elementId, {
    mode: "ace/mode/yaml",
    // aceTheme is global defined using php vars
    theme: `ace/theme/${aceTheme || "tomorrow"}`,
    keyboardHandler: "ace/keyboard/vscode",
    printMargin: false,
    tabSize: 2,
  })

  // Disables promtp and settings
  Editor.commands.removeCommand("showSettingsMenu")
  Editor.commands.removeCommand("openCommandPalette")

  // Focus first line
  Editor.focus()
}

// Just repass
export const setReadOnly = (value = true) => Editor.setReadOnly(value)
export const getValue = () => Editor.getValue()
