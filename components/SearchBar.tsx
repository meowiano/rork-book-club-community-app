import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search',
  value,
  onChangeText,
  onSubmit,
  autoFocus = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClear = () => {
    onChangeText('');
  };
  
  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused
    ]}>
      <Search size={20} color={colors.textSecondary} />
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
      />
      
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <X size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerFocused: {
    borderColor: colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: colors.text,
  },
});