import React, { Component } from 'react'
import './App.scss'
import { Route, Link } from 'react-router-dom'

import AuthenticatedRoute from './auth/components/AuthenticatedRoute'
import Header from './header/Header'
import SignUp from './auth/components/SignUp'
import SignIn from './auth/components/SignIn'
import SignOut from './auth/components/SignOut'
import ChangePassword from './auth/components/ChangePassword'

import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'

const datamuse = require('datamuse')

class App extends Component {
  constructor () {
    super()

    this.state = {
      user: null,
      flashMessage: '',
      flashType: null,
      wordInput: '',
      wordList: []
    }

    this.inputUpdated = this.inputUpdated.bind(this)
  }

  //  Updates the text field and performs api calls to datamuse
  inputUpdated(event) {
    this.setState({wordInput: event.target.value})

    datamuse.words({sp: event.target.value + '*', md: 'dp', max: 1000})
      .then((json) => {
        console.log(json)
        this.setState({wordList: json})
      })
  }

  setUser = user => this.setState({ user })

  clearUser = () => this.setState({ user: null })

  flash = (message, type) => {
    this.setState({ flashMessage: message, flashType: type })

    clearTimeout(this.messageTimeout)

    this.messageTimeout = setTimeout(() => this.setState({flashMessage: null
    }), 2000)
  }

  render () {
    const { flashMessage, flashType, user } = this.state

    return (
      <React.Fragment>
        
        {flashMessage && <h3 className={flashType}>{flashMessage}</h3>}
        
        <main className="container">
          <Route path='/sign-up' render={() => (
            <SignUp flash={this.flash} setUser={this.setUser} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn flash={this.flash} setUser={this.setUser} />
          )} />
          <AuthenticatedRoute user={user} path='/sign-out' render={() => (
            <SignOut flash={this.flash} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/change-password' render={() => (
            <ChangePassword flash={this.flash} user={user} />
          )} />
          <div>
            <div>
              <form>
                <FormGroup>
                  <label>
                  Enter a word to look up!
                    <input
                      style={{heght: 40, borderColor: 'black', borderWidth: 3}}
                      onChange={this.inputUpdated}
                      value={this.state.wordInput}
                    />
                  </label>
                </FormGroup>
              </form>
            </div>
            <div>
              <ul>
                {this.state.wordList.map((word) => (
                  <li key={word.word}><strong>{word.word + ' - '}</strong>{word.defs}</li>

                ))}
              </ul>
            </div>
          </div>
        </main>
      </React.Fragment>
    )
  }
}

export default App
