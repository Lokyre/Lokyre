import 'react-native-gesture-handler/jestSetup';
import '@testing-library/react-native';

const { View, Text } = require('react-native');

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 })
    }
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    NavigationContainer: ({ children }) => {
      const React = require('react');
      const { View } = require('react-native');
      return <View>{children}</View>;
    }
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children)}</View>,
      Screen: ({ component: Component, name }) => {
         const props = {
            navigation: { navigate: jest.fn(), goBack: jest.fn() },
            route: { params: {} },
         };
         return <Component {...props} />;
      },
    }),
  };
});


jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');

  const Paper = jest.requireActual('react-native-paper');

  return {
    ...Paper,
    Card: Object.assign(({ children }) => <View testID="card">{children}</View>, {
      Title: ({ title, subtitle, right, left, ...props }) => (
        <View testID="card-title" {...props}>
          {title && <Text>{title}</Text>}
          {subtitle && <Text>{subtitle}</Text>}
          {left && left()}
          {right && right()}
        </View>
      ),
      Content: ({ children }) => <View testID="card-content">{children}</View>,
    }),
    FAB: (props) => {
      return (
        <TouchableOpacity testID={props.testID || 'fab'} onPress={props.onPress}>
          <Text>FAB</Text>
        </TouchableOpacity>
      )
    },
    RadioButton: Object.assign(({ value, status, onPress }) => (
       <TouchableOpacity onPress={onPress}>
           <Text>{value}</Text>
       </TouchableOpacity>
    ), {
       Group: ({ children }) => <View>{children}</View>,
       Item: ({ label, value }) => <Text>{label}</Text>
    }),
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return ({ name }) => <View testID={`icon-${name}`} />;
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }) => <View testID={`icon-${name}`} />,
    Ionicons: ({ name }) => <View testID={`icon-${name}`} />,
  };
});
