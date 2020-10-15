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
import {
  makeSynchronizer,
  AddressTool,
  KeyTool,
  SynchronizerCallbacks,
  SynchronizerStatus,
} from 'react-native-zcash';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

class App extends Component {
  state = {
    textString: '',
    status: '',
    totalBalance: '',
    transactionCount: '',
    updateEvent: {},
  };
  log(arg) {
    this.setState({textString: this.state.textString + arg + '\n'});
  }

  onProcessorUpdate = (event) => {
    this.log(`got event: ${event}`);
  };

  async componentDidMount() {
    // actual seed from the demo wallet
    const seedBytesHex =
      'bfd59d293d79ffac7c572233c8364f9053e4cef61d2d494cb6e9cd55b586a34cd01aba51fdbc59031d8bc64f35865fd87ca7d5ba3b5bec26e7c00ce91ec31dbd';
    this.log(`seedBytesHex ${seedBytesHex}`);

    try {
      const spendingKey = await KeyTool.deriveSpendingKey(seedBytesHex);
      this.log(`spendingKey ${spendingKey}`);

      const viewingKey = await KeyTool.deriveViewingKey(seedBytesHex);
      this.log(`viewingKey ${viewingKey}`);

      const initializer = {
        fullViewingKey: viewingKey,
        birthdayHeight: 968000,
        // change this value to effectively "delete" the app data and re-test the load sequence
        alias: 'user5_account0',
      };

      this.log('making synchronizer...');
      const synchronizer = await makeSynchronizer(initializer);

      synchronizer.subscribe({
        onShieldedBalanceChanged: (walletBalance) => {
          this.onShieldedBalanceChanged(walletBalance);
        },
        onStatusChanged: (status) => {
          this.onStatusChanged(status);
        },
        onTransactionsChanged: (event) => {
          this.onTransactionsChanged(event);
        },
        onUpdate: (updateEvent) => {
          this.onUpdate(updateEvent);
        },
      });

      this.log('synchronizer created!');

      const zAddr = await AddressTool.deriveShieldedAddress(viewingKey);
      const zAddrValid = await AddressTool.isValidShieldedAddress(zAddr);
      this.log(`z-addr ${zAddr} (${zAddrValid})`);

      const tAddr = await AddressTool.deriveTransparentAddress(seedBytesHex);
      const tAddrValid = await AddressTool.isValidTransparentAddress(tAddr);
      this.log(`t-addr ${tAddr} (${tAddrValid})`);

      const blockHeight = await synchronizer.getLatestNetworkHeight();
      this.log(`syncing...(initial block height: ${blockHeight})`);
      await synchronizer.start();
    } catch (err) {
      this.log('Failed to initialize due to: ' + err);
    }
  }

  async componentWillUnmount() {
    this.synchronizer.stop();
  }

  onShieldedBalanceChanged(walletBalance) {
    this.setState({totalBalance: walletBalance.totalZatoshi});
  }
  onStatusChanged(status) {
    // TODO: map from status.name to SynchronizerStatus enum (using SynchronizerStatus[status.name] doesn't work)
    this.setState({status: status.name});
  }
  onTransactionsChanged(event) {
    this.setState({transactionCount: event.transactionCount});
  }
  onUpdate(event) {
    this.setState({
      updateEvent: {
        isDownloading: event.isDownloading,
        isScanning: event.isScanning,
        lastDownloadedHeight: event.lastDownloadedHeight,
        lastScannedHeight: event.lastScannedHeight,
        scanProgress: event.scanProgress,
        networkBlockHeight: event.networkBlockHeight,
      },
    });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Text>{this.state.textString}</Text>
            <Text>status: {this.state.status}</Text>
            <Text>transaction count: {this.state.transactionCount}</Text>
            <Text>
              shielded balance (zatoshi): {this.state.totalBalance + '\n'}
            </Text>
            <Text>
              network height: {this.state.updateEvent.networkBlockHeight}
            </Text>
            <Text>scan progress: {this.state.updateEvent.scanProgress}%</Text>
            <Text>
              downloaded height: {this.state.updateEvent.lastDownloadedHeight}
            </Text>
            <Text>
              scanned height: {this.state.updateEvent.lastScannedHeight}
            </Text>
          </ScrollView>
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
