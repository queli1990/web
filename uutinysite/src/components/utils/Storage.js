class Storage {
  set(key, value) {
    if (typeof value !== "string") {
      value = JSON.stringify(value)
    }
    sessionStorage.setItem(key, value)
  } 
  get(key) {
    return JSON.parse(sessionStorage.getItem(key))
  }
}

let store = new Storage()

export default store