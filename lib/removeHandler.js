export class RemoveHandler {
  constructor(indexes) {
    this.indexes = indexes && indexes.length ? indexes : null

    this.index = 1
  }

  element(element) {
    if (!this.indexes || this.indexes[String(this.index++)]) {
      element.remove()
    }
  }
}
