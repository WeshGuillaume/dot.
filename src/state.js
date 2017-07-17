
/**
 * State management
 *
 * a State contains the following:
 *  - the current column parsed
 *  - the current source line
 *  - the input left to parse
 *
 * The store is the actual object containing the values
 * The relevant store is the last one
 *
 * Lookahead is implemented by providing two utilities to the state
 *  function: save and reset. It will create a copy of the current store
 *  and remove that copy if an error occured and the input was consumed
 *
 * Usage:
 *
 * const state = createState('1+2')
 * const input = state('input') // 1+2
 * state.save()
 * state('input', input.slice(1))
 * state() // { input: '+2' }
 * state.reset()
 * state() // { input: '1+2' }
 *
 * TODO: - provide a state.apply function in case of success
 *       - change the accessing methods 
 */
function createState (input) {

  const defaultStore = {
    column: 0,
    line: 1,
    input,
  }

  const stores = [defaultStore]
  const getter = () => stores.slice(-1)[0]

  const manager = (key, value) => {
    if (!key) { return getter() }
    if (value === undefined) { return getter()[key] }
    return (stores[stores.length - 1][key] = value)
  }

  manager.save = () => stores.push(Object.assign({}, getter()))
  manager.reset = () => stores.length > 1 ? stores.pop() : false

  return manager
}

export { createState }
