// This css already exists in dynamix
export const preElement = "swaltext"

// To prompt confirm delete
export const del = () => {}

// To dialog new config
export const create = () => {}

// To display nchan logs
export const logs = () =>
  new Promise((resolve) => {
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
  })

// To render ace-editor when editing
export const edit = () => {}
