jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <View {...props} />,
    Ionicons: (props) => <View {...props} />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props) => React.createElement(View, { ...props, testID: props.name || props.icon });
});
