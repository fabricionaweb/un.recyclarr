// Document onload
$(function () {
  // Elements
  const $form = $("form[name=recyclarrSettings]")
  const $schedule = $form.find("[name=schedule]")
  const $custom = $form.find("[name=custom]")
  const $apply = $form.find("[name=apply]")
  const $run = $form.find("[name=run]")
  const $response = $form.find("#response")
  // Variables
  let currentSchedule = $schedule.val()
  let currentCustom = $custom.val()
  // Objects
  const nchan = new NchanSubscriber("/sub/recyclarr", {
    subscriber: "websocket",
  })
  const Services = {
    run: () =>
      $.post("/webGui/include/StartCommand.php", { cmd: "recyclarr nchan" }),
    save: ({ schedule, custom }) =>
      $.post("/plugins/un.recyclarr/Update.php", { schedule, custom }),
  }

  // Register the listener
  nchan.on("message", function (data) {
    // To prevent previous messages
    if (data === "[DONE]") return

    const $box = $("pre#swaltext")
    $box.append(`${data}\n`)
    $box.scrollTop($box[0]?.scrollHeight)
  })

  // Handle the select changes
  $schedule.on("change", function () {
    // Always clean feedback message
    $response.html("")
    // For CUSTOM we enable the input
    $custom.toggleClass("hidden", this.value !== "CUSTOM")
    // Disable apply button if same value
    $apply.attr(
      "disabled",
      this.value === currentSchedule && $custom.val() === currentCustom
    )
  })

  // Handle the custom changes
  $custom.on("input", function () {
    // Disable apply button if same value
    $apply.attr(
      "disabled",
      this.value === currentCustom && $schedule.val() === currentSchedule
    )
  })

  // Dispatch when click on Run manual
  $run.on("click", function () {
    // When close SweetAlert modal
    const onManualRunClose = () => {
      // Enable the button again
      this.disabled = false
      // Stop nchan listener
      nchan.stop()
    }

    // Open SweetAlert modal
    const onRunLoad = () => {
      swal(
        {
          title: "recyclarr sync",
          text: "<pre id='swaltext' style='white-space:pre-wrap'></pre><hr>",
          customClass: "nchan",
          html: true,
          animation: "none",
          showConfirmButton: true,
          confirmButtonText: "Done",
        },
        onManualRunClose
      )
    }

    // Disable the button to prevent miss click
    this.disabled = true
    // Start listener
    nchan.start()
    // Send request to run (manual)
    Services.run().then(onRunLoad)
  })

  // Dispatch when click on Apply
  $form.on("submit", function (event) {
    event.preventDefault()

    // Get form values
    const { value: schedule } = this.schedule
    const { value: custom } = this.custom
    // Disable apply button to prevent miss click
    this.apply.disabled = true

    const onSaveLoad = ({ message }) => {
      // Change current values
      currentSchedule = schedule
      currentCustom = custom
      // Show feedback
      $response.removeClass("failed").addClass("passed").html(message)
    }

    const onSaveError = ({ responseJSON = {} }) => {
      const { message = "Internal error" } = responseJSON
      // Log the error
      console.error("onSaveError", message)
      // Enable apply button again
      this.apply.disabled = false
      // Show feedback
      $response.removeClass("passed").addClass("failed").html(message)
    }

    // Send request to save
    Services.save({ schedule, custom }).then(onSaveLoad).catch(onSaveError)
  })
})
