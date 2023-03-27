// Document onload
$(function () {
  // Selectors
  const $form = $("form[name=recyclarrSettings]")
  const $schedule = $form.find("[name=schedule]")
  const $apply = $form.find("[type=submit]")
  const $run = $form.find("[name=run]")
  // Variables
  const currentSchedule = $schedule.val()
  const nchan = new NchanSubscriber("/sub/recyclarr", {
    subscriber: "websocket",
  })

  // Register the listener
  nchan.on("message", function (data) {
    // To prevent previous process output messages
    if (data === "_DONE_") return

    const $box = $("pre#swaltext")
    $box.append(`${data}\n`)
    $box.scrollTop($box[0]?.scrollHeight)
  })

  // Disable apply button when theres no change
  $schedule.on("change", function () {
    $apply.attr("disabled", this.value === currentSchedule)
  })

  // Dispatch when click on Run manual
  $run.on("click", function () {
    // Disable the button to prevent miss click
    this.disabled = true

    // Start listener
    nchan.start()

    // When close SweetAlert modal
    const onManualRunClose = () => {
      // Enable the button again
      this.disabled = false

      // Stop nchan listener
      nchan.stop()
    }

    // Open SweetAlert modal
    const onManualRunLoad = () => {
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

    // Call the script to run
    $.post(
      "/webGui/include/StartCommand.php",
      { cmd: "recyclarr" },
      onManualRunLoad
    )
  })
})
