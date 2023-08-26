import * as Linking from 'expo-linking'
import { useCallback, useEffect, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, IconButton, Text, useTheme } from 'react-native-paper'
import { RiddleModel } from '../services/RiddlrApiService'

export default function RiddleCard(props: { riddle: RiddleModel }): JSX.Element {
  const theme = useTheme()

  const [dim, setDim] = useState(Dimensions.get('window'))
  useEffect(() => {
    Dimensions.addEventListener('change', ({ window }) => setDim(window))
  }, [])
  const isPortraitMode = dim.width < dim.height

  const [options, setOptions] = useState<Array<string>>([])
  const [guesses, setGuesses] = useState<Array<string>>([])
  const [showCitationLink, setShowCitationLink] = useState(false)

  useEffect(() => {
    setOptions([props.riddle.CorrectAnswer, ...props.riddle.IncorrectAnswers].sort())
    setGuesses([])
    Linking.canOpenURL(props.riddle.CitationURL).then(setShowCitationLink)
  }, [props.riddle])

  const guess = useCallback((option: string) => {
    setGuesses([...guesses, option].sort())
  }, [guesses])

  function openCitationLink() {
    Linking.openURL(props.riddle.CitationURL)
  }

  const styles = StyleSheet.create({
    card: {
      borderColor: theme.colors.primary,
      backgroundColor: 'transparent',
      marginHorizontal: dim.width * .06,
      width: dim.width * .88 - 40,
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
            {props.riddle.Question}
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
                  disabled={guesses.length > 0}
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
                        {item === props.riddle.CorrectAnswer ? '✅' : '❌'}
                      </Text>
                    }
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
          {guesses.length > 0 &&
            <View style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              paddingVertical: dim.height * .01,
            }}>
              <Text
                style={{ flexShrink: 1 }}
                variant='bodyLarge'
              >
                {props.riddle.Explanation}
              </Text>
              {showCitationLink &&
                <IconButton
                  icon='link-variant'
                  iconColor={theme.colors.primary}
                  onPress={openCitationLink}
                  size={20}
                  style={{
                    margin: 0,
                    marginLeft: 4,
                  }}
                />
              }
            </View>
          }
        </View>
      </Card.Content>
    </Card>
  )
}