# ionic-rocketjump

Ionic :gem: + Rocketjump :rocket: = :heart:


### `useIonRunRj`

```js
// Choose between react or redux rj
import { rj } from 'react-rocketjump'
// or
import { rj } from 'redux-rocketjump'

import { useIonRunRj } from 'ionic-rocketjump'

const RjObject = rj({
  effect,
})
// ...
const [state, actions] = useIonRunRj(RjObject, [
  deps.maybe(23),
  // other deps...
], {
  // Should trigger clean on new effect? Default: true
  cleanOnNewEffect: true,
  // Should trigger run on ionViewDidEnter default: true
  runOnEnter: true,
  // Should trigger clean on useIonViewDidLeave default: false
  cleanOnLeave: false,
})
```

React version only:
```js
import { useIonRunRj } from 'ionic-rocketjump/react'
```

Redux version only:
```js
import { useIonRunRj } from 'ionic-rocketjump/redux'
```
