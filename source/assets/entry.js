import * as Services from "./modules/services"
import * as Modal from "./modules/sweet-alert"
import * as Ace from "./modules/ace-editor"

class App {
  constructor() {
    this.selectors()
    this.state()
    this.listeners()
    this.version()
  }

  selectors() {
    this.$title = $("#title")
    this.$form = $("form[name=crontab]")

    // Schedule available options
    this.$schedule = this.$form.find("select[name=schedule]")
    // Custom cron input text
    this.$custom = this.$form.find("input[name=custom]")
    // Button to apply changes
    this.$apply = this.$form.find("button[name=apply]")
    // Button to manual run
    this.$run = this.$form.find("button[name=run]")
    // Displays feedback messages for schedule changes
    this.$response = this.$form.find("#response")

    // Button to create new config
    this.$create = $("button[name=create]")
    // Icon and config name to edit
    this.$edit = $("a.yml-edit")
  }

  listeners() {
    // Listen to nchan to append manual logs
    this.nchan.on("message", this.nchanLog)

    // When changing the cron schedule option
    this.$schedule.on("change", this.onScheduleChange)
    // When changing the custom cron value
    this.$custom.on("input", this.onCustomInput)
    // When calling manual run
    this.$run.on("click", this.onRunClick)
    // When apply schedule changes
    this.$form.on("submit", this.onScheduleSubmit)
    // When clicking on New Config
    this.$create.on("click", this.onCreateClick)
    // When editing a config
    this.$edit.on("click", this.onEditClick)
    // When click on delete (inside the Modal)
    $("body").on("click", ".sweet-alert .yml-delete", this.onDeleteClick)
  }

  // Some in memory variables
  state() {
    this.nchan = new NchanSubscriber("/sub/recyclarr", {
      subscriber: "websocket",
    })
    this.currentSchedule = this.$schedule.val()
    this.currentCustom = this.$custom.val()
  }

  // Prints current version in header
  version = async () => {
    const version = await Services.getVersion()
    this.$title.append(`<span class="right"><small>v${version}<small></span>`)
  }

  nchanLog = (data) => {
    // To prevent previous messages
    if (data === "[DONE]") return

    const $box = $(`#${Modal.preElement}`)
    $box.append(`${data}\n`)
    $box.scrollTop($box[0]?.scrollHeight)
  }

  onScheduleChange = () => {
    // Get form values
    const schedule = this.$schedule.val()
    const custom = this.$custom.val()

    // Always clean feedback message
    this.$response.html("")
    // For CUSTOM we enable the input
    this.$custom.toggleClass("hidden", schedule !== "CUSTOM")

    // Disable apply button if same value
    const hasNoChanges =
      schedule === this.currentSchedule && custom === this.currentCustom
    this.$apply.attr("disabled", hasNoChanges)
  }

  onCustomInput = () => {
    // Get form values
    const schedule = this.$schedule.val()
    const custom = this.$custom.val()

    // Disable apply button if same value
    const hasNoChanges =
      schedule === this.currentSchedule && custom === this.currentCustom
    this.$apply.attr("disabled", hasNoChanges)
  }

  onRunClick = async (event) => {
    event.preventDefault()

    // Disable the button to prevent miss clicks
    this.$run.attr("disabled", true)
    // Start nchan listener
    this.nchan.start()

    // Send request to run
    await Services.runManual().then(Modal.logs)

    // Enable the button again
    this.$run.removeAttr("disabled")
    // Stop nchan listener
    this.nchan.stop()
  }

  onScheduleSubmit = async (event) => {
    event.preventDefault()

    // Get form values
    const schedule = this.$schedule.val()
    const custom = this.$custom.val()

    // Disable apply button to prevent miss click
    this.$apply.attr("disabled", true)

    // Send request to save
    try {
      const response = await Services.updateCron({ schedule, custom })

      // Change current state values
      this.currentSchedule = schedule
      this.currentCustom = custom

      // Show feedback
      this.$response
        .removeClass("failed")
        .addClass("passed")
        .html(response?.message)
    } catch (response) {
      const message = response?.responseJSON?.message || "Internal error"
      // Log the error
      console.error("onScheduleSubmit", response)
      // Enable apply button again
      this.$apply.removeAttr("disabled")

      // Show feedback
      this.$response.removeClass("passed").addClass("failed").html(message)
    }
  }

  onCreateClick = () => {
    // Open SweetAlert modal dialog
    Modal.create(async (fileName) => {
      try {
        // Quicky validate fileName (backend does it better)
        if (!fileName || /^[\w\-. ]+$/.test(fileName) === false) {
          throw {
            responseJSON: {
              message: "Invalid file name. Dont use especial characters",
            },
          }
        }

        // Send the request
        await Services.createConfig(fileName)

        // Just refresh the page (maybe later we can improve it)
        window.refresh()
      } catch (response) {
        const message = response?.responseJSON?.message || "Internal error"
        // Log the error
        console.error("onCreateClick", response)
        // Enable apply button again
        this.$apply.removeAttr("disabled")
        // Show feedback
        Modal.showInputError(message)
      }
    })
  }

  onEditClick = async (event) => {
    event.preventDefault()
    // Get value from data-set
    const { fileName } = event.currentTarget.dataset

    try {
      // Get file contents and open modal
      await Services.viewConfig(fileName).then(Modal.edit(fileName))

      // Disable edit mode
      Ace.setReadOnly(true)
      // Get content
      const contents = Ace.getValue()
      // Send save request
      await Services.updateConfig({ fileName, contents })

      // Just close the sweet-alert
      Modal.close()
    } catch (response) {
      const message = response?.responseJSON?.message || "Internal error"
      // Log the error
      console.error("onEditClick", response)
      // Enable editor again
      Ace.setReadOnly(false)
      // Show feedback
      Modal.showInputError(message)
    }
  }

  onDeleteClick = (event) => {
    event.preventDefault()
    // Get value from data-set
    const { fileName } = event.currentTarget.dataset

    // Open SweetAlert modal confirmation
    Modal.del(fileName)(async () => {
      try {
        // If confirmed, request delete
        await Services.deleteConfig(fileName)
        // Just refresh the page (maybe later we can improve it)
        window.refresh()
      } catch (response) {
        const message = response?.responseJSON?.message || "Internal error"
        // Log the error
        console.error("onDeleteClick", response)
        // Show feedback
        Modal.showInputError(message)
      }
    })
  }
}

new App()
