import type { ReactNode } from 'react';
import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput, View, Text } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  editable?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  leftIcon,
  rightIcon,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showFloatingLabel = Boolean(label) && (isFocused || value.length > 0);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.field,
          error ? styles.fieldError : styles.fieldNormal,
          !editable && styles.fieldDisabled,
          isFocused && styles.fieldFocused,
        ]}
      >
        {label ? (
          <Text
            style={[
              styles.floatLabel,
              showFloatingLabel ? styles.floatLabelUp : styles.floatLabelDown,
            ]}
          >
            {label}
          </Text>
        ) : null}
        <View style={[styles.row, label ? styles.rowWithLabel : styles.rowNoLabel]}>
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={label ? undefined : placeholder}
            accessibilityLabel={label ?? placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={editable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={styles.input}
            placeholderTextColor="rgba(255,255,255,0.35)"
            selectionColor="#3b82f6"
          />
          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  field: {
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#1e293b',
    position: 'relative',
  },
  fieldNormal: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  fieldFocused: {
    borderColor: 'rgba(59,130,246,0.5)',
  },
  fieldError: {
    borderColor: '#ef4444',
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  floatLabel: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  floatLabelUp: {
    top: -9,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    backgroundColor: '#1e293b',
    paddingHorizontal: 4,
  },
  floatLabelDown: {
    top: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rowWithLabel: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  rowNoLabel: {
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
  },
});
