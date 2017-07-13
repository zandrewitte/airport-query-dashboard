import React, { Component } from 'react';
import { render } from 'react-dom';
import NavBar from './components/navbar';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import QueryViewComponent from './views/query-view';
import ReportViewComponent from './views/report-view';
import PropTypes from 'prop-types';

class Root extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
     super(props, context);
     
  }

  render() {
    return (
      <DocumentTitle className="document" title={`Lunatech Assessment`}>
        <div className="container">
          <NavBar selectedNav={window.location.pathname.substr(1)} changeNav={this.changeNav.bind(this)} />
          <div className="content">
            {this.props.children}
          </div>
        </div>
      </DocumentTitle>
    );
  }

  changeNav(selectedNav) {
    this.context.router.history.push(`/${selectedNav}`);
  }
}

const router = (
  <Router>
      <Root>
        <Switch>
          <Route path="/query" component={QueryViewComponent} />
          <Route path="/reports" component={ReportViewComponent} />
          <Redirect from="/" exact to="/query" />
        </Switch>
      </Root>
  </Router>
);

const container = document.getElementById('app');
render(router, container);
