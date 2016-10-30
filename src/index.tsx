import * as React from "react"
import * as ReactDOM from "react-dom"
import { createStore, applyMiddleware, combineReducers } from "redux"
import { Provider, connect } from "react-redux"
import { createAction, handleActions, Action } from "redux-actions"
import * as Rx from "rxjs"

// React Component
class App extends React.Component<any, any> {
  render() {
    const { syncCounter, asyncCounter } = this.props;
    return (
      <div>
        <div>
          Hello, React with RxJS.
        </div>
        <div>
          sync-counter: {syncCounter.count} <button onClick={this.clicked.bind(this)}>count up</button>
        </div>
        <div>
          async-counter: {asyncCounter.count} {asyncCounter.message}
        </div>
      </div>
    )
  }
  clicked() {
    this.props.dispatch(createAction("SYNC-COUNT-UP")(this.props));
  }
}

// Reducers
const syncCounter = handleActions({
  "SYNC-COUNT-UP": (state: any, action: Action<any>) => Object.assign({}, state, {count: state.count + 1}),
}, {count: 0} /* initial state */)

const asyncCounter = handleActions({
  "ASYNC-COUNT-UP": (state: any, action: Action<any>) => Object.assign({}, state, {count: action.payload}),
  "ASYNC-COUNT-UP-COMPLETED": (state: any, action: Action<any>) => Object.assign({}, state, {message: "completed"}),
}, {count: 0} /* initial state */)

const reducer = combineReducers({
  syncCounter,
  asyncCounter,
})

// Configure to render
const devtools = (window as any).devToolsExtension && (window as any).devToolsExtension()
const middlewares = applyMiddleware()
const store = createStore(reducer, devtools, middlewares);
const MyApp = connect((a: any) => a)(App);

ReactDOM.render(
  <Provider store={store}>
    <MyApp />
  </Provider>
  , document.getElementById('main')
);

// Repeatedly emits by RxJS
var source = Rx.Observable
    .interval(500 /* ms */)
    .take(5)
    .map(x => x * 2)
    .subscribe(
      (x) => store.dispatch(createAction("ASYNC-COUNT-UP")(x)),
      () => null,
      () =>  store.dispatch(createAction("ASYNC-COUNT-UP-COMPLETED")()),
    );

