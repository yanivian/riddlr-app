import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from 'react-native'
import { IconButton, Text, TextInput, useTheme } from 'react-native-paper'
import GenerativeLanguageService, { RiddleModel } from './GenerativeLanguageService'
import RiddleCard from './RiddleCard'

// TODO: Move to server.
const ApiKey = 'AIzaSyC6doGY1WaMe3-ORdpzs2DktDYB3YsThzA'
const TopicPlaceholder = 'Food Trivia'

export default function RiddlerPage() {
  const dim = Dimensions.get('window')
  const theme = useTheme()

  const styles = StyleSheet.create({
    appTitleText: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: dim.width,
      borderColor: theme.colors.primary,
      borderWidth: dim.width * .01,
      color: theme.colors.primary,
      letterSpacing: 16,
      marginBottom: dim.width * .1,
      marginTop: dim.width * .2,
      paddingHorizontal: dim.width * .05,
      paddingVertical: dim.height * .01,
      verticalAlign: 'middle',
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  })

  const [busy, setBusy] = useState(false)
  const [topic, setTopic] = useState('')
  const [riddles, setRiddles] = useState<Array<RiddleModel>>()

  async function fetchRiddles() {
    setBusy(true)
    setRiddles([])
    const service = GenerativeLanguageService.get(ApiKey)
    return service.generateRiddles({
      topic: topic || TopicPlaceholder,
      numRiddles: 25,
      numIncorrectOptions: 4,
    })
      .then(setRiddles)
      .catch((err) => {
        throw 'Something went wrong'
      })
      .finally(() => setBusy(false))
  }

  return (
    <View style={styles.container}>
      <Text
        style={styles.appTitleText}
        variant='displaySmall'
      >
        rιδδlr
      </Text>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <TextInput
          autoCapitalize='words'
          autoComplete='off'
          contentStyle={{
            textAlignVertical: 'center',
          }}
          disabled={busy}
          inputMode='text'
          mode='outlined'
          onChangeText={setTopic}
          outlineColor={theme.colors.onPrimaryContainer}
          outlineStyle={{
            borderRadius: 3,
          }}
          placeholder={TopicPlaceholder}
          style={{
            backgroundColor: theme.colors.primaryContainer,
            width: dim.width * .8,
          }}
          value={topic}
        />
        <View
          style={{
            width: 40,
          }}
        >
          {!busy &&
            <IconButton
              icon='send'
              iconColor={theme.colors.primary}
              onPress={fetchRiddles}
              size={20}
              style={{
                margin: 0,
                padding: 0,
              }}
            />
          }
          {busy &&
            <ActivityIndicator
              animating={true}
              color={theme.colors.primary}
              size='small'
              style={{
                margin: 0,
                padding: 0,
              }}
            />
          }
        </View>
      </View>
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
          marginHorizontal: dim.width * .1,
        }}
      >
        <FlatList
          data={riddles}
          horizontal
          keyExtractor={(riddle, index) => `${index}`}
          renderItem={({ item }) => <RiddleCard riddle={item} />}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  )
}