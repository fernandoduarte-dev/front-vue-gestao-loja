import { reactive } from "vue"

export const ToastStore = reactive({
  show: false,
  message: "",
  type: "success", // success | error

  open(message, type = "success") {
    this.message = message
    this.type = type
    this.show = true

    setTimeout(() => {
      this.show = false
    }, 3000)
  }
})