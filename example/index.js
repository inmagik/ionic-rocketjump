import 'regenerator-runtime/runtime'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { IonApp, IonPage, IonRouterOutlet, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route, Link } from 'react-router-dom'
import { rj } from 'react-rocketjump'
import rjLogger from 'react-rocketjump/logger'
import { useIonRunRj } from 'ionic-rocketjump'
import '@ionic/react/css/core.css'

rjLogger()

const NoopState = rj({
  name: 'N00P',
  effect: () => Promise.resolve(23),
})


const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path={'/'} exact={true} component={Page} />
          <Route path={'/2'} exact={true} component={Page2} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

const Page = () => {
  // useIonViewDidEnter(() => [
  //   console.log('Enter Page 1')
  // ])
  // useIonViewDidLeave(() => {
  //   console.log('Leave Page 1')
  // })
  const [count, setCount] = useState(0)
  useIonRunRj(NoopState, [count], {
    cleanOnLeave: true,
    runOnEnter: true,
    cleanOnNewEffect: false,
  })

  return (
    <IonPage>
      <h1>Page 1</h1>
      <div>

        <button onClick={() => setCount(c => c + 1)}>Count {count}</button>
      </div>
      <Link to='/2'>Page 2</Link>
    </IonPage>
  )
}

const Page2 = () => {
  // useIonViewDidEnter(() => [
  //   console.log('Enter Page 2')
  // ])
  // useIonViewDidLeave(() => {
  //   console.log('Leave Page 2')
  // })
  return (
    <IonPage>
      <h1>Page 2</h1>
      <Link to='/'>Page 1</Link>
    </IonPage>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
