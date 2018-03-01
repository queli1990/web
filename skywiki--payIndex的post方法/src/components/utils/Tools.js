class Tools {
  isVip () {
    let User = JSON.parse(localStorage.getItem('userInfo'))
    if (User === null) { return false }

    let exceedTime = new Date(User.dueTime).getTime()
    let currtTime = new Date().getTime()

    if (User.isVip === 1 && exceedTime > currtTime) {
      return true
    }
    return false
  }
  isLogin () {
    let User = JSON.parse(localStorage.getItem('userInfo'))
    if (User === null) { return false } else { return true }
  }
}

let tools = new Tools()

export default tools
