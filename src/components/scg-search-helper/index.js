import React, { Component, PropTypes } from 'react';

import css from './styles.css';

const searchProvider = 'https://www.starcitygames.com/results?name=';

export default class ScgSearchHelper extends Component {
  constructor() {
    super();

    this.state = {
      searchText: '',
    };

    this.updateSearchText = this.updateSearchText.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
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
          className={css.searchForm}
          id="search-form"
          onSubmit={this.submitSearch}
        >
          <input
            id="search-text"
	    className={css.searchTextBox}
            type="text"
            value={this.state.searchText}
            onChange={this.updateSearchText}
          />
          <button
	    type="submit"
	    className={css.searchButton}
          >
            Search Star City Games!
          </button>
        </form>
      </div>
    )
  }
}
