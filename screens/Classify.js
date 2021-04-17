import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    StatusBar,
    Image,
    TouchableOpacity
  } from 'react-native'
  import * as tf from '@tensorflow/tfjs'
  import { fetch, bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'
  import * as ImagePicker from 'expo-image-picker'
  import Constants from 'expo-constants'
  import * as Permissions from 'expo-permissions'

export const Classify = ({navigation, route}) => {
    return (
        <ML></ML>
    )
}

class ML extends React.Component {
  state = {
    isTfReady: false,
    isModelReady: false,
    predictions: null,
    image: null
  }

  async componentDidMount() {
    await tf.ready()
    this.setState({
      isTfReady: true
    })
    
    const model = require("../assets/model/model.json");
    const weights = require("../assets/model/group1-shard1of1.bin");
    const loadedModel = await tf.loadLayersModel (
      bundleResourceIO(model, weights)
    );
    this.model = loadedModel;
    

    this.setState({ isModelReady: true })
    this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  imageToTensor(rawImageData) {
    const imageData = new Uint8Array(rawImageData);
    const image = decodeJpeg(imageData);
    const resized = tf.image.resizeBilinear(image, [64, 64]);
    const scaled = resized.div(255.0);
    const expanded = scaled.expandDims();

    return expanded;
  }

  convertProbsToClasses(probs) {
    const classNames = ['apple', 'banana', 'beetroot', 'bell pepper', 'cabbage', 'capsicum', 'carrot', 'cauliflower', 'chilli pepper', 'corn', 'cucumber', 'eggplant', 'garlic', 'ginger', 'grapes', 'jalepeno', 'kiwi', 'lemon', 'lettuce', 'mango', 'onion', 'orange', 'paprika', 'pear', 'peas', 'pineapple', 'pomegranate', 'potato', 'raddish', 'soy beans', 'spinach', 'sweetcorn', 'sweetpotato', 'tomato', 'turnip', 'watermelon'];
    let res = []
    let prob1 = -1;
    let prob2 = -1;
    let prob3 = -1;
    let max1 = 0;
    let max2 = 0;
    let max3 = 0;

    for(let i = 0; i < classNames.length; i++) {
      if (probs[i] > prob1) {
        prob1 = probs[i];
        max1 = i;
      }
    }

    for(let i = 0; i < classNames.length; i++) {
      if (probs[i] > prob2 && i != max1) {
        prob2 = probs[i];
        max2 = i;
      }
    }

    for(let i = 0; i < classNames.length; i++) {
      if (probs[i] > prob3 && i != max1 && i != max2) {
        prob3 = probs[i];
        max3 = i;
      }
    }

    res.push({
      className: classNames[max1],
      probability: probs[max1]
    });

    res.push({
      className: classNames[max2],
      probability: probs[max2]
    });

    res.push({
      className: classNames[max3],
      probability: probs[max3]
    });

    return res;
  }

  classifyImage = async () => {
    try {
      const imageAssetPath = Image.resolveAssetSource(this.state.image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = this.imageToTensor(rawImageData)
      const probs = await this.model.predict(imageTensor);
      probs.print();
      probs.softmax().print();
      const probTensor = await probs.softmax().data();
      const predictions = this.convertProbsToClasses(probTensor);
      console.log(predictions);
      this.setState({ predictions })
    } catch (error) {
      console.log(error)
    }
  }

  selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      })

      if (!response.cancelled) {
        const source = { uri: response.uri }
        this.setState({ image: source })
        this.classifyImage()
      }
    } catch (error) {
      console.log(error)
    }
  }

  renderPrediction = prediction => {
    return (
      
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }

  render() {
    const { isTfReady, isModelReady, predictions, image } = this.state

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <View style={styles.loadingContainer}>
          <Text style={styles.text}>
            TFJS ready? {isTfReady ? <Text>✅</Text> : ''}
          </Text>

          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>Model ready? </Text>
            {isModelReady ? (
              <Text style={styles.text}>✅</Text>
            ) : (
              <ActivityIndicator size='small' />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.selectImage : undefined}>
          {image && <Image source={image} style={styles.imageContainer} />}

          {isModelReady && !image && (
            <Text style={styles.transparentText}>Tap to choose image</Text>
          )}
        </TouchableOpacity>
        <View style={styles.predictionWrapper}>
          {isModelReady && image && (
            <Text style={styles.text}>
              Predictions: {predictions ? '' : 'Predicting...'}
            </Text>
          )}
          {isModelReady &&
            predictions &&
            predictions.map(p => this.renderPrediction(p))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.poweredBy}>Powered by:</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171f24',
    alignItems: 'center'
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 16
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: '#cf667f',
    borderWidth: 5,
    borderStyle: 'dashed',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentText: {
    color: '#ffffff',
    opacity: 0.7
  },
  footer: {
    marginTop: 40
  },
  poweredBy: {
    fontSize: 20,
    color: '#e69e34',
    marginBottom: 6
  },
  tfLogo: {
    width: 125,
    height: 70
  }
})