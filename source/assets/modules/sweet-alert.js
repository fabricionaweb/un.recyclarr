import * as Ace from "./ace-editor"

// This css already exists in dynamix
export const preElement = "swaltext"

// To prompt confirm delete
// Cant be promise because of the implementation
export const del = (fileName) => (callback) =>
  swal(
    {
      title: `Delete ${fileName}?`,
      text: "This operation is irreversible",
      type: "warning",
      confirmButtonText: "Delete",
      animation: "none",
      showLoaderOnConfirm: true,
      showCancelButton: true,
      closeOnConfirm: false,
    },
    callback
  )

// To dialog new config
// Cant be promise because of the implementation
export const create = (callback) =>
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
    callback
  )

// To display nchan logs
export const logs = async () =>
  new Promise((resolve) =>
    swal(
      {
        title: "recyclarr sync",
        text: `<pre id='${preElement}'></pre><hr>`,
        customClass: "nchan",
        html: true,
        animation: "none",
        showConfirmButton: true,
        confirmButtonText: "Done",
      },
      resolve
    )
  )

// To render ace-editor when editing
export const edit = (fileName) => async (contents) => {
  const isSecrets = !fileName.endsWith(".yml")

  return new Promise((resolve) => {
    swal(
      {
        title: isSecrets ? `${fileName}.yml` : fileName,
        text: `<pre id='${preElement}'>${contents}</pre> \
            ${
              // Delete button
              isSecrets
                ? ""
                : `<a href="?name=${fileName}" data-file-name="${fileName}" class="localURL failed yml-delete">Delete</a>`
            }
          `,
        customClass: "nchan", // Use same class but not using nchan here
        html: true,
        animation: "none",
        showLoaderOnConfirm: true,
        confirmButtonText: "Save",
        showCancelButton: true,
        closeOnConfirm: false,
        allowEscapeKey: false,
      },
      resolve
    )

    // Start ace editor - assuming sweet-alert is ready
    Ace.start(preElement)
  })
}

// Just repass
export const showInputError = swal.showInputError
export const close = swal.close
