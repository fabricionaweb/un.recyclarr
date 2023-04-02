// Document onload
$(function () {
  // Elements
  const $form = $("form[name=crontab]")
  const $schedule = $form.find("[name=schedule]")
  const $custom = $form.find("[name=custom]")
  const $apply = $form.find("[name=apply]")
  const $run = $form.find("[name=run]")
  const $response = $form.find("#response")
  const $create = $("[name=create]")
  const $edit = $(".yml-edit")
  // Variables
  let currentSchedule = $schedule.val()
  let currentCustom = $custom.val()
  // Objects
  const nchan = new NchanSubscriber("/sub/recyclarr", {
    subscriber: "websocket",
  })
  const Services = {
    // Run on manual
    run: () => $.post("/webGui/include/StartCommand.php", { cmd: "recyclarr nchan" }),
    // Save crontab
    save: ({ schedule, custom }) => $.post("/plugins/un.recyclarr/Update.php", { schedule, custom }),
    // Create config file
    create: (fileName) => $.post("/plugins/un.recyclarr/Create.php", { fileName }),
    // Read config file
    read: (fileName) => $.get("/plugins/un.recyclarr/Open.php", { fileName }),
    // Edit config file
    edit: ({ fileName, contents }) => $.post("/plugins/un.recyclarr/Edit.php", { fileName, contents }),
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
    $apply.attr("disabled", this.value === currentSchedule && $custom.val() === currentCustom)
  })

  // Handle the custom changes
  $custom.on("input", function () {
    // Disable apply button if same value
    $apply.attr("disabled", this.value === currentCustom && $schedule.val() === currentSchedule)
  })

  // Dispatch when click on Run manual
  $run.on("click", function () {
    // When close SweetAlert modal
    const onSwalClose = () => {
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
          text: "<pre id='swaltext'></pre><hr>",
          customClass: "nchan",
          html: true,
          animation: "none",
          showConfirmButton: true,
          confirmButtonText: "Done",
        },
        onSwalClose
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

  // Create config file
  $create.on("click", function () {
    const onCreateLoad = () => {
      // Just refresh the page
      window.refresh()
    }

    const onCreateError = ({ responseJSON = {} }) => {
      const { message = "Internal error" } = responseJSON
      // Log the error
      console.error("onCreateError", message)
      // Show feedback
      swal.showInputError(message)
    }

    // When SweetAlert is confirmed
    const onSwalConfirm = (fileName) => {
      // Quicky validate fileName (backend does it better)
      if (!fileName || /^[\w\-. ]+$/.test(fileName) === false) {
        return swal.showInputError("Invalid file name. Dont use especial characters")
      }
      // Send the request
      Services.create(fileName).then(onCreateLoad).catch(onCreateError)
    }

    // Open SweetAlert modal
    swal(
      {
        title: "Create config file",
        text: "Enter the file name",
        type: "input",
        animation: "none",
        showLoaderOnConfirm: true,
        showCancelButton: true,
        closeOnConfirm: false,
      },
      onSwalConfirm
    )
  })

  // Edit yml
  $edit.on("click", function (event) {
    event.preventDefault()

    // Variables
    let editor
    // Read data-attr
    const { fileName } = this.dataset

    // Start ace editor
    const startAce = (elementId) => {
      editor = ace.edit(elementId, {
        mode: "ace/mode/yaml",
        theme: `ace/theme/${aceTheme}`,
        keyboardHandler: "ace/keyboard/vscode",
        printMargin: false,
        tabSize: 2,
      })
      // Focus first line
      editor.focus()
    }

    // Handle the save request
    const onEditLoad = () => {
      // Just close the sweet-alert
      swal.close()
    }

    // Handle edit error
    const onEditError = ({ responseJSON = {} }) => {
      const { message = "Internal error" } = responseJSON
      // Log the error
      console.error("onEditError", message)
      // Enable editor again
      editor.setReadOnly(false)
      // Show feedback
      swal.showInputError(message)
    }

    // When SweetAlert save is click
    const onSwalConfirm = () => {
      // Disable edit mode
      editor.setReadOnly(true)
      // Get content
      const contents = editor.getValue()
      // Send save request
      Services.edit({ fileName, contents }).then(onEditLoad).catch(onEditError)
    }

    // Open SweetAlert modal
    const onReadLoad = (content) => {
      swal(
        {
          title: fileName.endsWith(".yml") ? fileName : `${fileName}.yml`,
          text: `<pre id='swaltext'>${content}</pre> \
            ${
              fileName.endsWith(".yml")
                ? `<a href="?name=${fileName}" data-file-name="${fileName}" class="failed yml-delete">Delete</a>`
                : ""
            }
          `,
          customClass: "nchan", // Use same class but not using nchan here
          html: true,
          animation: "none",
          showLoaderOnConfirm: true,
          confirmButtonText: "Save",
          showCancelButton: true,
          closeOnConfirm: false,
        },
        onSwalConfirm
      )

      // Start ace editor - asuming swal is ready
      startAce("swaltext")
    }

    // Send request to run (manual)
    Services.read(fileName).then(onReadLoad)
  })

  // Bind delete click
  $("body").on("click", ".sweet-alert .yml-delete", function (event) {
    event.preventDefault()

    // Read data-attr
    const { fileName } = this.dataset

    // Open SweetAlert confirm
    swal({
      title: `Delete ${fileName}?`,
      text: "This operation is irreversible",
      type: "warning",
      confirmButtonText: "Delete",
      animation: "none",
      showLoaderOnConfirm: true,
      showCancelButton: true,
      closeOnConfirm: false,
    })
  })
})
