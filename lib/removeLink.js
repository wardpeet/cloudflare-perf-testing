export class RemoveLink {
  constructor(args) {
    this.args = args
  }
  element(element) {
    let isMatch = true
    Object.keys(this.args).forEach(key => {
      if (element.getAttribute(key) !== this.args[key]) {
        isMatch = false
      }
    })

    if (isMatch) {
      element.remove()
    }
  }
}
