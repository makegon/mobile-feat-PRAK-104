import {StyleSheet, Text, View} from 'react-native'
import {CoreTheme} from "../../common/ui-kitten/theme.ts";

interface TypingIndicatorProps {
  tempMessage?: string
}

export const TypingIndicator = ({tempMessage}: TypingIndicatorProps) => {
  return (
    <View style={styles.typingContainer}>
      <Text style={styles.messageText}>{tempMessage ? tempMessage : '...'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    minHeight: 36,
    backgroundColor: CoreTheme['gpt-message-color'],
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    color: CoreTheme['text-basic-color'],
  },
})
