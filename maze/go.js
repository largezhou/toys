const go = async(maze, start, end, path, current, wait) => {
  for (let t of [start, end]) {
    if (!t) {
      alert('起止点都必须设置')
      return
    }

    if (!maze[t.row][t.col]) {
      alert('起止点不在路径上')
      return
    }
  }

  /**
   * 是否到了终点
   *
   * @returns {boolean}
   */
  const checkEnd = pos => {
    return pos.row == end.row &&
      pos.col == end.col
  }

  /**
   * 是否是障碍
   *
   * @param pos
   *
   * @returns {boolean}
   */
  const checkBlock = pos => {
    try {
      return (pos.row >= maze.length) ||
        (pos.col >= maze[0].length) ||
        (pos.row < 0) ||
        (pos.col < 0) ||
        !maze[pos.row][pos.col]
    } catch (e) {
      log(pos)
      throw e
    }
  }

  /**
   * 检测是不是往回走了
   *
   * @param pos
   *
   * @returns {boolean}
   */
  const checkBackward = pos => {
    if (path.length == 0) {
      return false
    }

    const backward = path[path.length - 1]

    return (backward.row == pos.row) && (backward.col == pos.col)
  }

  const getNext = pos => {
    const forwards = [
      // 上
      {
        row: -1,
        col: 0,
      },
      // 右
      {
        row: 0,
        col: 1,
      },
      // 下
      {
        row: 1,
        col: 0,
      },
      // 左
      {
        row: 0,
        col: -1,
      },
    ]

    if (posForwards[pos.row] === undefined) {
      posForwards[pos.row] = []
    }

    if (posForwards[pos.row][pos.col] === undefined) {
      posForwards[pos.row][pos.col] = -1
    }

    let forward
    let next

    do {
      posForwards[pos.row][pos.col]++

      if (posForwards[pos.row][pos.col] > 3) {
        return false
      }

      forward = forwards[posForwards[pos.row][pos.col]]
      next = {
        row: pos.row + forward.row,
        col: pos.col + forward.col,
      }

    } while (checkBlock(next) || checkBackward(next))

    return next
  }

  current.row = start.row
  current.col = start.col

  // 记录所有路径点已经走过的方向
  const posForwards = []

  const realGo = () => {
    setTimeout(() => {
      log('go')

      if (!checkEnd(current)) {
        const next = getNext(current)

        if (next) {
          path.push({ ...current })
          current.row = next.row
          current.col = next.col
          current.forward = maze[next.row][next.col].forward
        } else {
          const backward = path.pop()

          if (!backward) {
            alert('没路了')

            return
          } else {
            current.row = backward.row
            current.col = backward.col
            current.forward = backward.forward
          }
        }

        realGo()
      } else {
        alert('到咯')
      }
    }, wait)
  }

  realGo()
}
