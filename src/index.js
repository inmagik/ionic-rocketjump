import {
  isObjectRj as isObjectReactRj,
  useRj as useReactRj,
} from 'react-rocketjump'
import {
  isObjectRj as isObjectReduxRj,
  useRj as useReduxRj,
} from 'redux-rocketjump'
import createUseIonRunRj from './createUseIonRunRj'

export function useIonRunRj(rjObject, ...params) {
  let useRj
  if (isObjectReactRj(rjObject)) {
    useRj = useReactRj
  } else if (isObjectReduxRj(rjObject)) {
    useRj = useReduxRj
  } else {
    throw new Error(`[ionic-rocketjump] Bad Rocketjump Object.`)
  }
  const useIonRunRjForged = createUseIonRunRj(useRj)
  return useIonRunRjForged(rjObject, ...params)
}
