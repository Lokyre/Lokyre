import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {}
    })),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text, TextInput } = require('react-native');

  const Card = Object.assign((props) => <TouchableOpacity {...props} />, {
    Content: ({ children }) => <View>{children}</View>,
    Actions: ({ children }) => <View>{children}</View>,
    Title: ({ title, subtitle }) => (
      <View>
        <Text>{title}</Text>
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    ),
  });

  return {
    ...jest.requireActual('react-native-paper'),
    Card,
    FAB: (props) => <TouchableOpacity {...props}><Text>FAB</Text></TouchableOpacity>,
    Title: ({ children }) => <Text>{children}</Text>,
    Paragraph: ({ children }) => <Text>{children}</Text>,
    Button: (props) => <TouchableOpacity {...props}><Text>{props.children}</Text></TouchableOpacity>,
    TextInput: (props) => <TextInput {...props} />,
    RadioButton: Object.assign((props) => <TouchableOpacity {...props}><Text>RadioButton</Text></TouchableOpacity>, {
      Group: ({ children, onValueChange, value }) => {
        return React.Children.map(children, (child) => {
          return React.cloneElement(child, { onValueChange, selectedValue: value });
        });
      }
    }),
    Text: ({ children, ...props }) => <Text {...props}>{children}</Text>
  };
});
