import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { loginUser, setUserLocation } from '../../actions';
import Map from '../../components/Map/Map';
import NavBar from '../../components/NavBar/NavBar';
import { Routes } from '../../components/Routes/Routes';
import './App.css';

import * as keys from '../../utilities/apiCalls/apiKeys';
import { postUser } from '../../utilities/apiCalls/apiCalls';

export class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      mapType: 'streets',
      displaySidebar: false,
      redirect: false
    };
  }

  componentDidMount() {
    this.setLatLngEvents();
  }

  setLatLngEvents = async () => {
    await navigator.geolocation.getCurrentPosition(async location => {
      const { latitude, longitude } = location.coords;
      await this.props.setUserLocation({ latitude, longitude });
    });
  };

  login = async res => {
    const activeUser = await postUser(res.profileObj);
    this.props.loginUser(activeUser);
    this.setState({ user: activeUser, redirect: true });
  };

  logout = res => {
    this.setState({ user: null, redirect: false });
  };

  changeMap = (event, style) => {
    event.preventDefault();
    const { mapType } = this.state;
    mapType !== style
      ? this.setState({ mapType: style })
      : this.setState({ mapType: 'streets' });
  };

  displaySidebar = () => {
    this.setState({ displaySidebar: !this.state.displaySidebar });
  };

  render() {
    const { mapType, redirect, displaySidebar, user } = this.state;
    return (
      <Router>
        <div>
          {user && (
            <div>
              <div
                className={
                  mapType === 'streets'
                    ? 'toggle-map-style'
                    : 'toggle-map-style-active'
                }
              >
                <button
                  className={`${mapType}-button`}
                  onClick={event => this.changeMap(event, 'dark')}
                />
              </div>
              <i
                className={
                  !displaySidebar
                    ? `fas fa-bars ${mapType}`
                    : 'far fa-window-close'
                }
                onClick={this.displaySidebar}
              />
            </div>
          )}
          {displaySidebar && <NavBar logout={this.logout} />}
          <Routes
            redirect={redirect}
            changeMap={this.changeMap}
            displaySidebar={this.displaySidebar}
            stateSidebar={displaySidebar}
            user={user}
            mapType={mapType}
            login={this.login}
          />
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  loginUser: PropTypes.func
};

export const mapDispatchToProps = dispatch => ({
  loginUser: user => dispatch(loginUser(user))
});

export default connect(
  null,
  mapDispatchToProps
)(App);
