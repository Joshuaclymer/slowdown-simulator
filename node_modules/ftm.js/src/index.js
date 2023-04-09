class ftm {
  constructor () {
    this.timers = []
  }

  define (name) {
    this.timers.push(name)
    return this
  }

  start (name) {
    console.time(name)
    return this
  }

  startAll () {
    this.timers.map(timer => console.time(timer))
    return this
  }

  stop (name) {
    console.timeEnd(name)
    return this
  }

  stopAll () {
    this.timers.map(timer => console.timeEnd(timer))
    return this
  }
}

export default new ftm()
