import React from 'react'
import { Route, Link } from 'react-router-dom'
import { IonReactRouter } from '@ionic/react-router'
import { IonApp, IonPage, IonRouterOutlet, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react'
import { render, act } from '@testing-library/react'
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils'

const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path={'/'} exact component={Page1} />
          <Route path={'/2'} exact component={Page2} />
        </IonRouterOutlet>
        <Link to='/'>Link1</Link>
        <Link to='/2'>Link2</Link>
      </IonReactRouter>
    </IonApp>
  )
}

const Page1 = ({ location }) => {
  useIonViewDidEnter(() => {
    console.log('Enter Page 1')
  })
  useIonViewDidLeave(() => {
    console.log('Leave Page 1')
  })
  console.log('Render Page 1')
  return (
    <IonPage>
      Page1
    </IonPage>
  )
}
const Page2 = ({ location }) => {
  useIonViewDidEnter(() => {
    console.log('Enter Page 2')
  })
  useIonViewDidLeave(() => {
    console.log('Leave Page 2')
  })
  console.log('Render Page 2')
  return (
    <IonPage>
      Page2
    </IonPage>
  )
}

describe('useIonRunRj', () => {
  it('should be awesome', async () => {
    const { getByText } = render(<App />)
    // FIXME: this cause a @ionic type error
    // https://github.com/ionic-team/ionic/issues/20809
    await act(async () => {
      await fireEvent.click(getByText('Link2'))
    })
  })
})
