declare module 'react-native-modal-dropdown' {
  import { Component } from 'react';
  import { StyleProp, ViewStyle, TextStyle } from 'react-native';
  
  interface ModalDropdownProps {
    options: string[] | number[];
    defaultIndex?: number;
    defaultValue?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    dropdownStyle?: StyleProp<ViewStyle>;
    onSelect?: (index: number, value: string | number) => void;
    renderRow?: (option: string | number, index: number, isSelected: boolean) => JSX.Element;
    renderButtonText?: (option: string | number) => string;
  }

  export default class ModalDropdown extends Component<ModalDropdownProps> {}
}
