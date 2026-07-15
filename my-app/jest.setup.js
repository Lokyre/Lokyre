import 'react-native-gesture-handler/jestSetup';

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
    FontAwesome: () => <View />,
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const actualPaper = jest.requireActual('react-native-paper');

  const MockCardTitle = (props) => (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.subtitle}</Text>
      {props.right && props.right()}
    </View>
  );

  const MockCardContent = ({ children }) => <View>{children}</View>;
  const MockCardActions = ({ children }) => <View>{children}</View>;

  const MockCard = Object.assign((props) => <View {...props} />, {
    Title: MockCardTitle,
    Content: MockCardContent,
    Actions: MockCardActions,
  });

  const MockRadioButtonGroup = ({ children }) => <View>{children}</View>;
  const MockRadioButtonItem = (props) => <View {...props} />;
  const MockRadioButton = Object.assign((props) => <View {...props} />, {
    Group: MockRadioButtonGroup,
    Item: MockRadioButtonItem,
  });

  return {
    ...actualPaper,
    Card: MockCard,
    RadioButton: MockRadioButton,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});
