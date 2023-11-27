import * as React from 'react';
import { SearchBar } from 'react-native-elements';

export default class SearchBarComp extends React.Component {
  state = {
    search: '',
  };

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;
  
    return (
      <SearchBar
        lightTheme
        placeholder={'Søg oplevelse'}
        onChangeText={this.updateSearch}
        value={search}
      />
    );
  }
}