import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

import styles from './styles'

function Button({ children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  )
}

export default Button
