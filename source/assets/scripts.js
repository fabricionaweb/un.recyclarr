// Document onload
$(function () {
  // Elements
  const $form = $("form[name=recyclarrSettings]")
  const $schedule = $form.find("[name=schedule]")
  const $apply = $form.find("[name=apply]")
  const $run = $form.find("[name=run]")
  const $response = $form.find("#response")
  // Variables
  let currentSchedule = $schedule.val()
  // Objects
  const nchan = new NchanSubscriber("/sub/recyclarr", {
    subscriber: "websocket",
  })
  const Services = {
    run: () =>
      $.post("/webGui/include/StartCommand.php", { cmd: "recyclarr nchan" }),
    save: (schedule) =>
      $.post("/plugins/un.recyclarr/Update.php", { schedule }),
  }

  // Register the listener
  nchan.on("message", function (data) {
    // To prevent previous messages
    if (data === "[DONE]") return

    const $box = $("pre#swaltext")
    $box.append(`${data}\n`)
    $box.scrollTop($box[0]?.scrollHeight)
  })

  // Disable apply button when theres no change
  $schedule.on("change", function () {
    // Clean feedback message
    $response.html("")
    // Disable apply button if same value
    $apply.attr("disabled", this.value === currentSchedule)
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
    // Get selected schedule value
    const { value: schedule } = this.schedule
    // Disable apply button to prevent miss click
    this.apply.disabled = true

    const onSaveLoad = ({ message }) => {
      // Change current selected value
      currentSchedule = schedule
      // Show feedback
      $response.removeClass("failed").addClass("passed").html(message)
    }

    const onSaveError = ({ responseJSON }) => {
      // Log the error
      console.error("onSaveError", responseJSON?.message)
      // Enable apply button again
      this.apply.disabled = false
      // Show feedback
      $response.removeClass("passed").addClass("failed").html("Error saving")
    }

    // Send request to save
    Services.save(schedule).then(onSaveLoad).catch(onSaveError)
  })
})
