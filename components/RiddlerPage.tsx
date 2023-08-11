import { StatusBar } from 'expo-status-bar'
import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from 'react-native'
import { IconButton, Text, TextInput, useTheme } from 'react-native-paper'
import RiddlrApiService, { RiddlesForTopic } from '../services/RiddlrApiService'
import RiddleCard from './RiddleCard'
import { UidContext } from './UidProvider'

const TopicPlaceholder = 'Food Trivia'
const IconButtonContainerWidth = 40

export default function RiddlerPage() {
  const theme = useTheme()
  const uid = useContext(UidContext)

  const [dim, setDim] = useState(Dimensions.get('window'))
  useEffect(() => {
    Dimensions.addEventListener('change', ({ window }) => setDim(window))
  }, [])
  const isPortraitMode = dim.width < dim.height

  const styles = StyleSheet.create({
    appTitleIsConstricted: {
      marginBottom: dim.height * .02,
      marginTop: Math.max(50, dim.height * .05),
    },
    appTitleIsExpanded: {
      marginBottom: dim.height * .1,
      marginTop: dim.height * .1,
    },
    appTitle: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: dim.width,
      borderColor: theme.colors.primary,
      borderWidth: Math.min(dim.width, dim.height) * .01,
      paddingHorizontal: dim.width * .05,
      paddingVertical: dim.height * .01,
    },
    appTitleText: {
      color: theme.colors.primary,
      letterSpacing: 16,
      verticalAlign: 'middle',
    },
    container: {
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      flex: 1,
      flexGrow: 1,
    },
    riddlesContainer: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginVertical: dim.height * .03,
    },
    textInput: {
      flexGrow: 1,
      flex: 1,
      backgroundColor: 'transparent',
    },
    textInputContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: dim.width * .06,
    },
  })

  const [busy, setBusy] = useState(false)
  const [topic, setTopic] = useState('')
  const [riddlesForTopic, setRiddlesForTopic] = useState<RiddlesForTopic>()

  async function fetchRiddles() {
    setBusy(true)
    setRiddlesForTopic(undefined)
    const service = RiddlrApiService.get()
    return service.getRiddlesForTopic({
      uid,
      topic: topic || TopicPlaceholder,
    })
      .then(setRiddlesForTopic)
      .finally(() => setBusy(false))
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.appTitle,
          riddlesForTopic ? styles.appTitleIsConstricted : styles.appTitleIsExpanded,
        ]}
      >
        <Text
          style={[
            styles.appTitleText,
          ]}
          variant='displaySmall'
        >
          rιδδlr
        </Text>
      </View>
      <View style={styles.textInputContainer}>
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
          outlineColor={theme.colors.primary}
          outlineStyle={{
            borderRadius: theme.roundness,
          }}
          placeholder={TopicPlaceholder}
          style={styles.textInput}
          value={topic}
        />
        <View
          style={{
            alignItems: 'center',
            width: IconButtonContainerWidth,
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
      {riddlesForTopic &&
        <View style={styles.riddlesContainer}>
          <FlatList
            data={riddlesForTopic.Riddles}
            horizontal
            keyExtractor={(riddle, index) => `${index}`}
            renderItem={({ item }) => <RiddleCard riddle={item} />}
            contentContainerStyle={{
              alignItems: 'flex-start',
              marginBottom: 5,
            }}
          />
        </View>
      }
      <StatusBar style="auto" />
    </View>
  )
}