export class RemoveHandler {
  constructor(indexes) {
    this.indexes = indexes && indexes.filter(Boolean).length ? indexes : null

    this.index = 1
  }

  element(element) {
    if (!this.indexes || this.indexes.includes(String(this.index++))) {
      element.remove()
    }
  }
}
