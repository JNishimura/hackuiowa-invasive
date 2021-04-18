import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
  } from 'react-native'
  import * as tf from '@tensorflow/tfjs'
  import { fetch, bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'
  import * as ImagePicker from 'expo-image-picker'
  import Constants from 'expo-constants'
  import * as Permissions from 'expo-permissions'

export const Classify = () => {
    return (
        <ML></ML>
    )
}

class ML extends React.Component {
  state = {
    isTfReady: false,
    isModelReady: false,
    prediction: null,
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

  convertProbToClass(probs) {
    const classNames = ['Bush Honeysuckle', 'European Buckthorn', 'Garlic Mustard', 'Multiflora Rose', 'Non-invasive', 'Reed Canary Grass']
    let maxProb = probs[0];
    let maxInd = 0

    for(let i = 0; i < classNames.length; i++) {
        if (probs[i] > maxProb) {
            maxProb = probs[i];
            maxInd = i;
        }
    }

    return classNames[maxInd];
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
      const predictedClass = this.convertProbToClass(probTensor);
      console.log(predictedClass);
      this.setState({ prediction: predictedClass});
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
    const { isModelReady, image } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <Text style = {styles.headerText}>Identifier</Text>
        <Text style = {{textAlign:'center'}}>Can't figure out what a plant might be from the guidebook? Try identifying it with our recognition tool.</Text>
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.selectImage : undefined}>
          {image && <Image source={image} style={styles.imageContainer} />}

          {isModelReady && !image && (
            <Text style={styles.transparentText}>Tap to choose image</Text>
          )}
        </TouchableOpacity>
        <View style = {styles.predictionInfoContainer}>
          <View style = {{flex: 0.25}}>
            <Text style = {styles.text}>
                We think this is:
            </Text>
            <Text style = {styles.predictionText}>
                {this.state.prediction}
            </Text>
          </View>
          <View style = {{flex: 1}}>
            <Text style = {[styles.text, {fontWeight: 'bold'}]}>
                What should I do if I find an invasive plant?
            </Text>
            
            <Text style = {styles.text}>
                If you believe this is a new problem, take notes or pictures of the plant and nearby landmarks. Report this to your local DNR office.
            </Text>
            <Text style = {styles.text}>
                If you wish to collect a sample or remove a plant, take caution not to spread it or its seeds elsewhere. Make sure to carry it in a secure bag.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center'
  },
  text: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center'
  },
  predictionText: {
    color: '#000',
    fontSize: 30,
    textAlign: 'center'
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: '#546747',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 280,
    height: 280,
    position: 'absolute',
    borderRadius:10
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center'
},
  transparentText: {
    color: '#000',
    opacity: 0.7,
    textAlign: 'center'
  },
  predictionInfoContainer: {
      flexDirection: 'column',
      justifyContent: 'center'
  }
})