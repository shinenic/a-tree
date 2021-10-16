/**
 * @typedef Step
 * @type {object}
 * @property {string} selector
 * @property {string|JSX.Element} content
 * @property {'top'|'left'|'right'|'bottom'} position
 * @property {function} initAction
 */

/**
 * @typedef TourState
 * @type {object}
 * @property {boolean} isStarting
 * @property {Step[]} steps
 * @property {number} currentStep start from zero
 */

/** @type {TourState} */
export const initialState = {
  isStarting: false,
  steps: [],
  currentStep: 0,
}

/**
 * @param {TourState} state
 * @param {object} action
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEPS': {
      const validSteps = action.payload.steps.filter(({ selector }) =>
        document.querySelector(selector)
      )
      validSteps.forEach((step) => step?.initAction?.())

      return {
        ...state,
        steps: validSteps,
      }
    }
    case 'START':
      if (!state.steps || state.steps.length === 0) {
        return state
      }

      return {
        ...state,
        isStarting: true,
        currentStep: 0,
      }
    case 'NEXT': {
      if (state.steps.length - 1 === state.currentStep) {
        return {
          ...state,
          isStarting: false,
        }
      }

      return {
        ...state,
        currentStep: state.currentStep + 1,
      }
    }
    case 'PREV': {
      if (state.currentStep === 0) {
        return state
      }

      return {
        ...state,
        currentStep: state.currentStep - 1,
      }
    }
    case 'FINISH':
      return {
        ...state,
        isStarting: false,
      }
    default:
      throw new Error(`Unknown Type: ${action.type}`)
  }
}
