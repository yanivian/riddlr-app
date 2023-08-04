import { useCallback, useEffect, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, Text, useTheme } from 'react-native-paper'
import { RiddleModel } from './GenerativeLanguageService'

export default function RiddleCard(props: { riddle: RiddleModel }): JSX.Element {
  const theme = useTheme()

  const [dim, setDim] = useState(Dimensions.get('window'))
  useEffect(() => {
    Dimensions.addEventListener('change', ({ window }) => setDim(window))
  }, [])
  const isPortraitMode = dim.width < dim.height

  const [options, setOptions] = useState<Array<string>>([])
  const [guesses, setGuesses] = useState<Array<string>>([])

  useEffect(() => {
    setOptions([props.riddle.correctAnswer, ...props.riddle.incorrectAnswers].sort())
    setGuesses([])
  }, [props.riddle])

  const guess = useCallback((option: string) => {
    setGuesses([...guesses, option].sort())
  }, [guesses])

  const styles = StyleSheet.create({
    card: {
      borderColor: theme.colors.primary,
      backgroundColor: 'transparent',
      marginHorizontal: dim.width * .05,
      width: dim.width * .9 - 40,
    },
    question: {
      marginBottom: dim.height * .01,
    },
  })

  return (
    <Card
      mode='outlined'
      style={styles.card}
    >
      <Card.Content>
        <View>
          <Text
            style={styles.question}
            variant='bodyLarge'
          >
            {props.riddle.question}
          </Text>
          <View style={{
            alignItems: 'flex-start',
            flexDirection: isPortraitMode ? 'column' : 'row',
            flexWrap: 'wrap',
          }}>
            {options.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => guess(item)}
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    borderColor: theme.colors.primary,
                    borderRadius: theme.roundness,
                    borderWidth: 1,
                    elevation: 2,
                    marginHorizontal: dim.width * .01,
                    marginVertical: dim.height * .01,
                    paddingHorizontal: dim.width * .05,
                    paddingVertical: dim.height * .01,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text variant='bodyMedium'>
                      {item}
                    </Text>
                    {guesses.includes(item) &&
                      <Text
                        style={{ marginLeft: 8 }}
                        variant='bodyMedium'
                      >
                        {item === props.riddle.correctAnswer ? '✅' : '❌'}
                      </Text>
                    }
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}