import React, { useEffect, useState } from 'react';
import { View, Image, SafeAreaView, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import { Feather as Icone, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { RectButton } from 'react-native-gesture-handler';

import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';



interface Params {
  point_id: number
}

interface Point {
  "id": number,
  "image": string,
  "image_url": string,
  "name": string,
  "uf": string,
  "city": string,
  "email": string,
  "whatsapp": string,
  "items": { "titulo": string }[]

}

const Detail = () => {

  const [point, setPoint] = useState<Point>({} as Point);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParam = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParam.point_id}`).then(response => {
      console.log(response.data)
      setPoint(response.data)
      console.log(point.image_url)
    })
  }, []);

  function handleComposeMail() {
    MailComposer.composeAsync(
      {
        recipients: [point.email],
        subject: 'Interesse na coleta'
      }
    )
  };

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${point.whatsapp}&text=Interesse na coleta`);
  };

  function handleNavigateBack() {
    navigation.goBack();
  }

  if (!point.id) {
    return null
  }

  return (<SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleNavigateBack}
      >
        <Icone
          name="arrow-left"
          size={28}
          color="#34cb79"
        />
      </TouchableOpacity>

      <Image
        style={styles.pointImage}
        source={{
          uri: point.image_url
        }}
      />

      <Text style={styles.pointName}> {point.name} </Text>
      <Text style={styles.pointItems}>
        {point.items.map(item => item.titulo).join(', ')}
      </Text>

      <View style={styles.address}>
        <Text style={styles.addressTitle}>Endereço</Text>
        <Text style={styles.addressContent}> {point.city} / {point.uf} </Text>

      </View>
    </View>
    <View style={styles.footer}>
      <RectButton
        style={styles.button}
        onPress={handleComposeMail}
      >
        <Icone name="mail" size={20} color="#FFF" />
        <Text style={styles.buttonText}>E-mail</Text>
      </RectButton>
      <RectButton
        style={styles.button}
        onPress={handleWhatsapp}
      >
        <FontAwesome name="whatsapp" size={20} color="#FFF" />
        <Text style={styles.buttonText}>Whatsapp</Text>
      </RectButton>

    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;