import * as Services from "./modules/services"
import * as SweetAlert from "./modules/sweet-alert"

class App {
  constructor() {
    this.selectors()
    this.state()
    this.listeners()
  }

  selectors() {
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
  }

  // Some in memory variables
  state() {
    this.nchan = new NchanSubscriber("/sub/recyclarr", { subscriber: "websocket" })
    this.currentSchedule = this.$schedule.val()
    this.currentCustom = this.$custom.val()
  }

  nchanLog = (data) => {
    // To prevent previous messages
    if (data === "[DONE]") return

    const $box = $(`#${SweetAlert.preElement}`)
    $box.append(`${data}\n`)
    $box.scrollTop($box[0]?.scrollHeight)
  }

  onScheduleChange = () => {
    // Always clean feedback message
    this.$response.html("")
    // For CUSTOM we enable the input
    this.$custom.toggleClass("hidden", this.value !== "CUSTOM")
    // Disable apply button if same value
    const hasNoChanges = this.value === this.currentSchedule && this.$custom.val() === this.currentCustom
    this.$apply.attr("disabled", hasNoChanges)
  }

  onCustomInput = () => {
    // Disable apply button if same value
    const hasNoChanges = this.value === this.currentCustom && this.$schedule.val() === this.currentSchedule
    this.$apply.attr("disabled", hasNoChanges)
  }

  onRunClick = async (event) => {
    event.preventDefault()

    // Disable the button to prevent miss clicks
    this.disabled = true
    // Start nchan listener
    this.nchan.start()
    // Send request to run
    await Services.run().then(SweetAlert.logs)
    // Enable the button again
    this.disabled = false
    // Stop nchan listener
    this.nchan.stop()
  }
}

new App()
