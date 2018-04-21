import React, { Component, PropTypes } from 'react';

// import css from './styles.css';

const searchProvider = 'https://www.starcitygames.com/results?name=';

export default class ScgSearchHelper extends Component {
  constructor() {
    super();

    this.state = {
      searchText: '',
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }
  
  updateSearchText(event) {
    this.setState({
      searchText: event.target.value,
    })
  }
  
  submitSearch(event) {
    event.preventDefault()
  
	  const initialText = this.state.searchText;
  
    let searchQuery = initialText.replace(/(\s)+/g, '+')
      .replace(/^\+/g, '')
      .replace(/\+$/g, '');

    const searchUrl = `${searchProvider}${searchQuery}`;
    window.open(searchUrl);
  }
  
  render() {
    return (
      <div>
        <form
          id="search-form"
          onSubmit={this.submitSearch}
        >
          <input
            id="search-text"
            type="text"
            value={this.state.searchText}
            onChange={this.updateSearchText}
          />
          <button type="submit">
            Search Star City Games!
          </button>
        </form>
      </div>
    )
  }
}
