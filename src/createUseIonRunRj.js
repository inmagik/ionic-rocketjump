import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import {
  getRunValuesFromDeps,
  shouldRunDeps,
  getMetaFromDeps,
} from 'rocketjump-core'
import {
  useIonViewDidEnter,
  useIonViewDidLeave,
} from '@ionic/react'

const DefaultConfig = {
  cleanOnNewEffect: true,
  runOnEnter: true,
  cleanOnLeave: false,
}

export default function createUseIonRunRj(useRj) {
  return function useIonRunRj(
    rjObject,
    runArgs = [],
    rawConfig,
    ...params
  ) {
    // Normalize config support 4 original shouldCleanOnNewEffect boolean param
    let config
    if (typeof config === 'boolean') {
      config = { ...DefaultConfig, cleanOnNewEffect: rawConfig  }
    } else {
      config = { ...DefaultConfig, ...rawConfig }
    }
    // Expand config
    const shouldCleanOnNewEffect = config.cleanOnNewEffect
    const shouldRunOnEnter = config.runOnEnter
    const shouldCleanOnLeave = config.cleanOnLeave

    const didMount = useRef(false)

    const [state, originalActions] = useRj(rjObject, ...params)
    const { run, clean } = originalActions

    const [withMeta, setWithMeta] = useState({})
    const prevWithMeta = useRef(null)

    const runValues = getRunValuesFromDeps(runArgs)
    const prevRunValues = useRef(null)

    const maybePerformRun = useCallback(() => {
      const shouldRun = shouldRunDeps(runArgs)

      if (shouldRun) {
        const meta = getMetaFromDeps(runArgs, prevRunValues.current)
        // Add meta only if setWithMeta in called along with last args update
        let hackRunWithMeta = {}
        if (prevWithMeta.current && prevWithMeta.current !== withMeta) {
          hackRunWithMeta = withMeta
        }
        run.withMeta({ ...meta, ...hackRunWithMeta }).run(...runValues)
      }

      prevRunValues.current = runValues
      prevWithMeta.current = withMeta

      // spreading run arguments as deps means:
      // every time a run arguments changes (Object.is comparison)
      // a run is triggered and (if configured) a clean to clean up
      // the old effect related state
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clean, run, shouldRunOnEnter, shouldCleanOnNewEffect, ...runValues])

    // NOTE: cause useIonViewDidEnter didn't handle
    // a clean callback as useEffect does we do this
    // to trigger clean effect on subsequent values changes
    const [cleanNextTime, setNextClean] = useState(false)

    useIonViewDidEnter(() => {
      if (shouldRunOnEnter) {
        maybePerformRun()
        if (shouldCleanOnNewEffect && !cleanNextTime) {
          setNextClean(true)
        }
      }
    })

    useIonViewDidLeave(() => {
      if (shouldCleanOnLeave) {
        clean()
      }
    })

    useEffect(() => {
      if (shouldRunOnEnter && !didMount.current) {
        return
      }
      const shouldRun = shouldRunDeps(runArgs)
      return () => {
        if (shouldCleanOnNewEffect && shouldRun) {
          clean()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldCleanOnNewEffect, shouldRunOnEnter, cleanNextTime, ...runValues])

    // Trigger run on run values changes
    useEffect(() => {
      if (!didMount.current) {
        // Now is MOUNTED!
        didMount.current = true
        // The first run will triggered by useIonViewDidEnter
        if (shouldRunOnEnter) {
          return
        }
      }

      maybePerformRun()
    }, [shouldRunOnEnter, maybePerformRun])

    const actions = useMemo(
      () => ({
        ...originalActions,
        withNextMeta: setWithMeta,
      }),
      [setWithMeta, originalActions]
    )

    return useMemo(() => [state, actions], [state, actions])
  }
}
