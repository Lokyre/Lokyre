import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component }) => (
        <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />
      ),
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
    },
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const actualPaper = jest.requireActual('react-native-paper');

  const MockCardTitle = (props) => (
    <View testID="mock-card-title">
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.left && props.left({})}
      {props.right && props.right({})}
    </View>
  );

  const MockCard = Object.assign((props) => <View testID={props.testID}>{props.children}</View>, {
    Title: MockCardTitle,
    Content: ({ children }) => <View>{children}</View>,
  });

  const MockRadioButtonGroup = ({ children, onValueChange, value }) => (
    <View testID="radio-group" accessibilityValue={{ text: value }}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          onPress: () => { if (child.props.children && child.props.children.props) { onValueChange(child.props.children.props.value) } else { onValueChange(child.props.value) } }
        });
      })}
    </View>
  );

  const MockRadioButton = ({ value, testID, onPress }) => (<Text testID={testID} onPress={onPress} accessibilityRole="radio">{value}</Text>);

  MockRadioButtonGroup.Item = MockRadioButton;
  MockRadioButton.Group = MockRadioButtonGroup;

  return {
    ...actualPaper,
    Card: MockCard,
    RadioButton: Object.assign(MockRadioButton, { Group: MockRadioButtonGroup }),
  };
});
