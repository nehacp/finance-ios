import React, { Component } from 'react';
import { StyleSheet, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StyledButton from '../button';
import StyledText from '../text/styled-text';
import { updateUserPortfolio } from '../../actions/update-user-portfolio';
import { updateUserPortfolioTotal } from '../../actions/update-user-portfolio-total';
import { fontColor, borderColor, onFocusBorderColor } from '../../constants/styles';
import { getWidthSizeForScreen } from '../../constants/layout';

class UserPortfolioForm extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentWillMount() {
    this.updateInputValues(this.props);
  }

  updateInputValues(props) {
    props.investmentTypes.map(type => {
      let value = props.userPortfolio ? props.userPortfolio[type.name] : '';
      this.state[type.name] = `$${value ? value : ''}`;
    });
  }

  componentWillReceiveProps(newProps) {
    this.updateInputValues(newProps);
  };

  updateInput(type, input) {
    const value = input[0] === '$' ? input.slice(1) : input;
    this.setState({ [type]: `$${value}` });
  }

  handleSubmit() {
    let total = 0;
    const payload = {};
    for (let type in this.state) {
      let amount = (this.state[type]).slice(1);
      amount = Number(amount) || 0;
      total += amount
      payload[type] = amount > 0 ? amount : 0;
    }

    this.props.updateUserPortfolio(payload);
    this.props.updateUserPortfolioTotal(total);
    this.props.submit();
  }

  handleResetToOriginal() {
    console.log('reset to original');
  }

  handleClearPortfolio() {
    const portfolio = {};
    for (let inv in this.props.investmentTypes) {
      portfolio[inv] = 0;
    }
    this.props.updateUserPortfolio(portfolio);
    this.props.updateUserPortfolioTotal(0);
  }

  createInputFields() {
    return this.props.investmentTypes.map(field => {
      return (
        <View style={viewStyles.formRowView} key={field.name}>
          <StyledText 
            text={`${field.name}:`}
            style={textStyles.formRowLabel}
          />
          <TextInput
            onChangeText={(value => this.updateInput(field.name, value))}
            value={this.state[field.name]}
            style={textStyles.formRowValue}
            keyboardType='numeric'
            returnKeyType="done"
          />
        </View>
      );
    })
  }

  render() {
    return (
      <View style={viewStyles.formBody}>
          {this.createInputFields()}
          <View style={viewStyles.showPortfolioButtonView}>
              <StyledButton 
                title='Show Portfolio' 
                click={this.handleSubmit.bind(this)} 
              />
              <View style={viewStyles.resetButtonView}>
              
                <View>
                  <StyledButton
                    title='Clear'
                    click={this.handleClearPortfolio.bind(this)}
                    clear={true}
                  />
                </View>
              </View>
            </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { investmentTypes, userPortfolio } = state;
  return { investmentTypes, userPortfolio };
};
   
const mapDispatchToProps = (dispatch) => (
  bindActionCreators({ updateUserPortfolio, updateUserPortfolioTotal }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(UserPortfolioForm);

const viewStyles = StyleSheet.create({
  formBody: {
    marginTop: '5%',
    marginHorizontal: '15%',
  },
  formRowView: {
    alignItems: 'flex-start',
    marginBottom: '3%',
  },
  showPortfolioButtonView: {
    marginVertical: '8%',
    marginHorizontal: '-5%',
  },
  resetButtonView: {
    flexDirection: 'row',
  }
});

const textStyles = StyleSheet.create({
  formRowLabel: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: '2%',
  },  
  formRowValue: {
    padding: '1%',
    borderWidth: 0.5,
    borderColor: borderColor,
    color: fontColor,
    width: getWidthSizeForScreen(175, 200, 225),
    height: getWidthSizeForScreen(22, 24, 28),
  }
});


// <View>
//   <StyledButton
//     title='Reset To Original'
//     click={this.handleSubmit.bind(this)}
//     clear={true}
//   />
// </View>