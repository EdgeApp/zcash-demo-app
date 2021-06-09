/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {KeyTool, makeSynchronizer, AddressTool} from 'react-native-zcash';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

class App extends Component {
  state = {textString: ''};
  log(arg) {
    this.setState({textString: this.state.textString + arg + '\n'});
  }
  async componentDidMount() {
    // console.log(synchronizer)
    const seedBytesHex =
      '0xafdfcbe42f2bdfafdfcbe42f2bdfafdfcbe42f2bdfafdfcbe42f2bdffabcabcd';
    this.log(`seedBytesHex ${seedBytesHex}`);
    const viewKey = await KeyTool.deriveViewingKey(seedBytesHex);
    this.log(`viewKey ${viewKey}`);
    const initializer = {
      host: 'zcash.edge.app',
      port: 80,
      fullViewingKey: viewKey,
      birthdayHeight: 1000,
    };
    // const synchronizer = await makeSynchronizer(initializer);
    // const spendKey = await KeyTool.deriveSpendingKey(seedBytesHex);
    // this.log(`spendKey ${spendKey}`);

    // // const shieldedBalance = await synchronizer.getShieldedBalance();
    // // this.log(`shieldedBalance: ${JSON.stringify(shieldedBalance)}`);
    // try {
    //   const transparentAddress = await AddressTool.deriveTransparentAddress(
    //     viewKey,
    //   );
    //   this.log('transparentAddress', transparentAddress);
    // } catch (e) {
    //   this.log(e);
    // }

    // const shieldedAddress = await AddressTool.deriveShieldedAddress(viewKey);
    // this.log(`shieldAddress ${shieldedAddress}`);
    // const validShieldedAddress = await AddressTool.isValidShieldedAddress(
    //   shieldedAddress,
    // );
    // this.log(`validShieldedAddress ${validShieldedAddress}`);
  }
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
          />
          <Text>{this.state.textString}</Text>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
