Vue.config.devtools = true

const passSize = 40
const mazeWidth = 1200
const mazeHeight = 800
const maxHistory = 20

const vm = new Vue({
  el: '#app',
  data: () => ({
    maze: [],

    start: null,
    end: null,

    settingStartEnd: null,

    histories: [],
    record: '',
    draw: true,

    sleep: 100,
    path: [],
    current: {
      row: undefined,
      col: undefined,
    },
  }),
  created() {
    window.t = this
    this.maxHistory = maxHistory
    this.initPasses()

    const debounceRecordHistory = _.debounce(this.handleRecordHistory, 300)

    this.debounceRecordHistory = maze => {
      if (!this.record) {
        this.record = maze
      }

      return debounceRecordHistory()
    }
  },
  methods: {
    handleRecordHistory() {
      const maze = this.record
      if (
        maze &&
        (maze != this.histories[this.histories.length - 1]) &&
        (maze != JSON.stringify(this.maze))
      ) {
        this.histories.push(maze)
        if (this.histories.length > maxHistory) {
          this.histories.shift()
        }
      }
      this.record = ''
    },
    initPasses() {
      let maze
      try {
        maze = JSON.parse(localStorage.getItem('maze'))
      } catch (e) {

      }

      if (maze) {
        this.maze = maze
        return
      }

      this.resetPasses()
    },
    resetPasses() {
      let maze = []
      for (let row = mazeHeight / passSize - 1; row >= 0; row--) {
        maze[row] = []
        for (let col = mazeWidth / passSize - 1; col >= 0; col--) {
          maze[row][col] = 0
        }
      }

      this.maze = maze
    },
    getIndex(e) {
      const maze = this.$refs.maze
      const x = Math.floor((e.pageX - maze.offsetLeft) / passSize)
      const y = Math.floor((e.pageY - maze.offsetTop) / passSize)

      return { x, y }
    },
    onSetPass(e) {
      const { x, y } = this.getIndex(e)

      const row = y
      const col = x

      if (this.settingStartEnd) {
        if (this.maze[row][col]) {
          this[this.settingStartEnd] = { row, col }
        }
        this.settingStartEnd = null
        return
      }

      this.setPass(x, y, this.draw)
    },

    setPass(x, y, set) {
      let maze = JSON.stringify(this.maze)

      this.debounceRecordHistory(maze)

      maze = JSON.parse(maze)

      const row = y
      const col = x

      maze[row][col] = set
      this.maze = maze
    },

    passPosStyle(row, col) {
      return {
        left: `${col * passSize}px`,
        top: `${row * passSize}px`,
      }
    },

    onStartDrag(e) {
      if (e.buttons == 1) {
        this.startDraw = true
      }
    },

    onStopDrag(e) {
      this.startDraw = false
    },
    onDragging(e) {
      if (this.startDraw) {
        this.onSetPass(e)
      }
    },
    onReset() {
      this.record = JSON.stringify(this.maze)
      this.resetPasses()
      this.handleRecordHistory()
    },

    onSetStartEnd(type) {
      this.settingStartEnd = type
    },

    onUndo() {
      const maze = this.histories.pop()

      if (maze) {
        this.maze = JSON.parse(maze)
      }
    },
    onGo() {
      go(this.maze, this.start, this.end, this.path, this.current, this.sleep)
    },
  },
  watch: {
    maze() {
      ['start', 'end'].forEach(type => {
        const t = this[type]
        if (t && !this.maze[t.row][t.col]) {
          this[type] = null
        }
      })
      localStorage.setItem('maze', JSON.stringify(this.maze))
    },
  },
})
