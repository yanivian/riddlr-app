import { useCallback, useEffect, useState } from 'react'
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native'
import { Card, Text, useTheme } from 'react-native-paper'
import { RiddleModel } from './GenerativeLanguageService'

export default function RiddleCard(props: { riddle: RiddleModel }): JSX.Element {
  const dim = Dimensions.get('window')
  const theme = useTheme()

  const [options, setOptions] = useState<Array<string>>([])
  const [guesses, setGuesses] = useState<Array<string>>([])

  useEffect(() => {
    setOptions([props.riddle.correctAnswer, ...props.riddle.incorrectAnswers].sort())
    setGuesses([])
  }, [props.riddle])

  const guess = useCallback((option: string) => {
    setGuesses([...guesses, option].sort())
  }, [guesses])

  return (
    <Card
      mode='elevated'
      style={{
        borderColor: theme.colors.onSecondaryContainer,
        borderWidth: 1,
        backgroundColor: theme.colors.secondaryContainer,
        marginHorizontal: dim.width * .025,
        marginVertical: dim.width * .1,
        width: dim.width * .7,
        maxHeight: dim.height * .7,
      }}
    >
      <Card.Content>
        <View>
          <Text
            style={{
              marginVertical: dim.width * .01,
              paddingHorizontal: dim.width * .05,
              paddingVertical: dim.height * .01,
              verticalAlign: 'middle',
              textAlign: 'justify',
            }}
            variant='bodyLarge'
          >
            {props.riddle.question}
          </Text>
          <FlatList
            data={options}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => guess(item)}
                  style={{
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: theme.colors.onSecondaryContainer,
                    backgroundColor: theme.colors.secondaryContainer,
                    borderRadius: dim.width * .03,
                    marginVertical: dim.width * .01,
                    paddingHorizontal: dim.width * .05,
                    paddingVertical: dim.height * .01,
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flexGrow: 1 }}
                      variant='bodyMedium'
                    >
                      {item}
                    </Text>
                    {guesses.includes(item) &&
                      <Text
                        variant='bodyMedium'
                      >
                        {item === props.riddle.correctAnswer ? ' ✅' : ' ❌'}
                      </Text>
                    }
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </Card.Content>
    </Card>
  )
}