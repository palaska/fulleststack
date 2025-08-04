import type { TextInput, TextInputProps } from "react-native";

type SearchInputProps = TextInputProps & {
  className?: string;
  containerClassName?: string;
  iconContainerClassName?: string;
  cancelText?: string;
  iconColor?: string;
};

type SearchInputRef = TextInput;

export type { SearchInputProps, SearchInputRef };
