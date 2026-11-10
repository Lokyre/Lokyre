import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('react-native-paper', () => {
    const React = require('react');
    const { Text } = require('react-native');
    const actualPaper = jest.requireActual('react-native-paper');
    return {
        ...actualPaper,
        Provider: ({ children }) => children,
        List: {
            ...actualPaper.List,
            Icon: (props) => <Text {...props}>{props.icon}</Text>
        },
        FAB: (props) => <Text {...props}>{props.icon}</Text>
    };
});
